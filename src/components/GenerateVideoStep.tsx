import { useState, useEffect, useRef } from 'react';
import ImagePreviewCard from './ImagePreviewCard';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

interface OutputPrompt {
  scene_id: string;
  status: string;
  task_id: string;
  video_url?: string;
}

interface GenerateVideoStepProps {
  uploadResponse: any;
  imagePreview1: string | null;
  imagePreview2: string | null;
  audioUrl: string | null;
  isGeneratingVideo: boolean;
  videoGenerated: boolean;
  imageUrl: string;
  faceUrl: string;
  videoStoryId: string;
  stories: Array<{id: string, name: string, total_scenes: number}>;
  outputPrompts: OutputPrompt[];
  onImageUrlChange: (url: string) => void;
  onFaceUrlChange: (url: string) => void;
  onVideoStoryIdChange: (storyId: string) => void;
  onGenerateVideo: (sceneIds: string[]) => void;
  onCopyToClipboard: (text: string) => void;
  onBack: () => void;
}

export default function GenerateVideoStep({
  uploadResponse,
  imagePreview1,
  imagePreview2,
  audioUrl,
  isGeneratingVideo,
  videoGenerated,
  imageUrl,
  faceUrl,
  videoStoryId,
  stories,
  outputPrompts,
  onImageUrlChange,
  onFaceUrlChange,
  onVideoStoryIdChange,
  onGenerateVideo,
  onCopyToClipboard,
  onBack
}: GenerateVideoStepProps) {
  const selectedStory = stories.find(s => s.id === videoStoryId);
  const [sceneIds, setSceneIds] = useState<string[]>([]);
  const [sceneInput, setSceneInput] = useState('');
  const [sceneError, setSceneError] = useState('');
  const [sceneStatuses, setSceneStatuses] = useState<OutputPrompt[]>([]);
  const pollingIntervalRef = useRef<number | null>(null);
  
  const handleAddScene = () => {
    const sceneNumber = sceneInput.trim();
    
    if (!sceneNumber) {
      setSceneError('Please enter a scene number');
      return;
    }
    
    const sceneNum = parseInt(sceneNumber);
    
    if (isNaN(sceneNum) || sceneNum < 1) {
      setSceneError('Scene number must be a positive number');
      return;
    }
    
    if (selectedStory && sceneNum > selectedStory.total_scenes) {
      setSceneError(`Scene number must be between 1 and ${selectedStory.total_scenes}`);
      return;
    }
    
    if (sceneIds.includes(sceneNumber)) {
      setSceneError('This scene has already been added');
      return;
    }
    
    setSceneIds([...sceneIds, sceneNumber]);
    setSceneInput('');
    setSceneError('');
  };
  
  const handleRemoveScene = (sceneId: string) => {
    setSceneIds(sceneIds.filter(id => id !== sceneId));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddScene();
    }
  };
  
  // Clear scenes when story changes
  useEffect(() => {
    setSceneIds([]);
    setSceneInput('');
    setSceneError('');
  }, [videoStoryId]);

  // Initialize scene statuses when output prompts arrive
  useEffect(() => {
    if (outputPrompts && outputPrompts.length > 0) {
      setSceneStatuses(outputPrompts);
    }
  }, [outputPrompts]);

  // Poll for status updates
  useEffect(() => {
    if (videoGenerated && sceneStatuses.length > 0) {
      // Check if all scenes are completed
      const allCompleted = sceneStatuses.every(scene => scene.status === 'completed');
      
      if (allCompleted) {
        // Stop polling if all scenes are completed
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        return;
      }

      // Start polling
      const pollStatus = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/get-task-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              output_prompts: sceneStatuses,
              story_id: videoStoryId
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.results) {
              setSceneStatuses(prevStatuses => 
                prevStatuses.map(scene => {
                  const updatedScene = data.results.find((r: any) => r.scene_id === scene.scene_id);
                  return updatedScene ? {
                    ...scene,
                    status: updatedScene.status,
                    video_url: updatedScene.video_url
                  } : scene;
                })
              );
            }
          }
        } catch (error) {
          console.error('Error polling status:', error);
        }
      };

      // Poll immediately
      pollStatus();
      
      // Then poll every 10 seconds
      pollingIntervalRef.current = window.setInterval(pollStatus, 10000);

      // Cleanup on unmount
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [videoGenerated, sceneStatuses.length, videoStoryId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-500/50 rounded-full text-xs font-semibold">⏳ Pending</span>;
      case 'processing':
        return <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/50 rounded-full text-xs font-semibold">⚙️ Processing</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-500/50 rounded-full text-xs font-semibold">✅ Completed</span>;
      default:
        return <span className="px-3 py-1 bg-gray-900/30 text-gray-400 border border-gray-500/50 rounded-full text-xs font-semibold">{status}</span>;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Back Button */}
      {!videoGenerated && (
        <div className="w-full max-w-3xl mb-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            ← Back
          </button>
        </div>
      )}

      <h2 className="text-3xl font-bold text-white mb-4">🎬 Generate Video</h2>
      <p className="text-gray-400 mb-8 text-center">Create your final video with images and audio</p>
      
      <div className="w-full max-w-3xl space-y-6">
        {/* Assets Preview & URLs */}
        {(uploadResponse || audioUrl) && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {/* Full Body Image */}
              {imagePreview1 && uploadResponse?.image1 && (
                <ImagePreviewCard
                  label="Full Body"
                  imagePreview={imagePreview1}
                  url={uploadResponse.image1.url}
                  onCopy={() => onCopyToClipboard(uploadResponse.image1.url)}
                />
              )}
              
              {/* Close Up Image */}
              {imagePreview2 && uploadResponse?.image2 && (
                <ImagePreviewCard
                  label="Close Up"
                  imagePreview={imagePreview2}
                  url={uploadResponse.image2.url}
                  onCopy={() => onCopyToClipboard(uploadResponse.image2.url)}
                />
              )}

              {/* Audio */}
              {audioUrl && (
                <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded border border-gray-600 flex-shrink-0 bg-gray-900 flex items-center justify-center w-12 h-12">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold mb-1">Audio</p>
                      <button
                        onClick={() => onCopyToClipboard(audioUrl)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded p-1.5 border border-gray-600">
                    <code className="text-green-400 text-[10px] break-all line-clamp-1">{audioUrl}</code>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Video Generation Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 space-y-4">
              <h3 className="text-white font-semibold text-lg mb-4">Video Configuration</h3>
              
              {/* Image URL */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Full Body Image URL
                </label>
                <input 
                  type="text"
                  value={imageUrl}
                  onChange={(e) => onImageUrlChange(e.target.value)}
                  placeholder="Enter full body image URL"
                  className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                />
              </div>

              {/* Face URL */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Close-Up Face Image URL
                </label>
                <input 
                  type="text"
                  value={faceUrl}
                  onChange={(e) => onFaceUrlChange(e.target.value)}
                  placeholder="Enter close-up face image URL"
                  className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                />
              </div>

              {/* Story Selection */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Select Story</label>
                <select
                  value={videoStoryId}
                  onChange={(e) => onVideoStoryIdChange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                >
                  {stories.map((story) => (
                    <option key={story.id} value={story.id}>
                      {story.name}
                    </option>
                  ))}
                </select>
                {selectedStory && (
                  <p className="text-gray-400 text-sm mt-2">
                    This story has a total of {selectedStory.total_scenes} scenes
                  </p>
                )}
              </div>

              {/* Scene Selection */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Scene Numbers <span className="text-gray-400 font-normal">(Enter scene number and press Enter)</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={sceneInput}
                    onChange={(e) => {
                      setSceneInput(e.target.value);
                      setSceneError('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedStory ? `Enter scene number (1-${selectedStory.total_scenes})` : 'Enter scene number'}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                  />
                  <button
                    onClick={handleAddScene}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Add
                  </button>
                </div>
                
                {sceneError && (
                  <p className="text-red-400 text-sm mt-2">{sceneError}</p>
                )}
                
                {/* Display added scenes */}
                {sceneIds.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-400 text-xs mb-2">Added Scenes:</p>
                    <div className="flex flex-wrap gap-2">
                      {sceneIds.map((sceneId) => (
                        <div
                          key={sceneId}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/50 rounded-lg"
                        >
                          <span className="text-blue-300 font-semibold">Scene {sceneId}</span>
                          <button
                            onClick={() => handleRemoveScene(sceneId)}
                            className="text-blue-300 hover:text-red-400 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                const payload = {
                  image_url: imageUrl,
                  face_url: faceUrl,
                  scene_ids: sceneIds,
                  story_id: videoStoryId
                };
                console.log('========================================');
                console.log('VIDEO GENERATION PAYLOAD:');
                console.log('========================================');
                console.log(JSON.stringify(payload, null, 2));
                console.log('========================================');
                console.log('Payload Object:', payload);
                console.log('========================================');
                onGenerateVideo(sceneIds);
              }}
              disabled={isGeneratingVideo || !imageUrl || !faceUrl || sceneIds.length === 0}
              className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingVideo ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  Generating Video...
                </span>
              ) : 'Generate Video'}
            </button>
          </div>
          
          {/* Video Generation Status Table */}
          {videoGenerated && sceneStatuses.length > 0 && (
            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Scene ID</th>
                      <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Task ID</th>
                      <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Video URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sceneStatuses.map((scene, index) => (
                      <tr 
                        key={scene.task_id}
                        className={`border-b border-gray-700/50 ${index % 2 === 0 ? 'bg-gray-900/20' : 'bg-gray-900/10'}`}
                      >
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">Scene {scene.scene_id}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(scene.status)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <code className="text-gray-400 text-xs bg-gray-900 px-2 py-1 rounded">
                            {scene.task_id.substring(0, 8)}...
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          {scene.video_url ? (
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <a
                                href={scene.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm underline flex-shrink-0"
                              >
                                View Video
                              </a>
                              <button
                                onClick={() => onCopyToClipboard(scene.video_url!)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition flex-shrink-0"
                              >
                                📋 Copy
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm whitespace-nowrap">Waiting...</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* All completed message */}
            {sceneStatuses.every(scene => scene.status === 'completed') && (
              <div className="bg-green-900/30 border border-green-500 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-green-400 font-bold text-lg mb-1">All Videos Generated Successfully!</p>
                <p className="text-gray-400 text-sm">All your videos are ready to view and download</p>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

