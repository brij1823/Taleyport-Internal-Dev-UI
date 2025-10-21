import ImagePreviewCard from './ImagePreviewCard';

interface GenerateAudioStepProps {
  uploadResponse: any;
  imagePreview1: string | null;
  imagePreview2: string | null;
  kidName: string;
  language: string;
  gender: string;
  storyId: string;
  stories: Array<{id: string, name: string, total_scenes: number}>;
  isGeneratingAudio: boolean;
  audioGenerated: boolean;
  audioUrl: string | null;
  audioResponse: any;
  onKidNameChange: (name: string) => void;
  onLanguageChange: (lang: string) => void;
  onGenderChange: (gender: string) => void;
  onStoryChange: (storyId: string) => void;
  onGenerateAudio: () => void;
  onCopyToClipboard: (text: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function GenerateAudioStep({
  uploadResponse,
  imagePreview1,
  imagePreview2,
  kidName,
  language,
  gender,
  storyId,
  stories,
  isGeneratingAudio,
  audioGenerated,
  audioUrl,
  audioResponse,
  onKidNameChange,
  onLanguageChange,
  onGenderChange,
  onStoryChange,
  onGenerateAudio,
  onCopyToClipboard,
  onContinue,
  onBack
}: GenerateAudioStepProps) {
  const selectedStory = stories.find(s => s.id === storyId);
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Back Button */}
      <div className="w-full max-w-3xl mb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">Generate Audio</h2>
      <p className="text-gray-400 mb-8 text-center">Create audio for your video</p>
      
      <div className="w-full max-w-3xl space-y-6">
        {/* Feedback Note */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-200 text-sm">
            <strong>Note:</strong> If you feel the audio is not up to expectation, please log it here:{' '}
            <a 
              href="https://docs.google.com/spreadsheets/d/1zmtkMzMhEDV264MIg4svE2pQ_DE4lDR_AxcDGGExsRI/edit?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline font-medium"
            >
              Audio Feedback Spreadsheet
            </a>
          </p>
        </div>

        {/* Uploaded Images Preview & URLs */}
        {uploadResponse && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Full Body Image */}
              {imagePreview1 && uploadResponse.image1 && (
                <ImagePreviewCard
                  label="Full Body"
                  imagePreview={imagePreview1}
                  url={uploadResponse.image1.url}
                  onCopy={() => onCopyToClipboard(uploadResponse.image1.url)}
                />
              )}
              
              {/* Close Up Image */}
              {imagePreview2 && uploadResponse.image2 && (
                <ImagePreviewCard
                  label="Close Up"
                  imagePreview={imagePreview2}
                  url={uploadResponse.image2.url}
                  onCopy={() => onCopyToClipboard(uploadResponse.image2.url)}
                />
              )}
            </div>
          </div>
        )}
        
        {/* Audio Generation Form */}
        {!audioGenerated ? (
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 space-y-4">
              <h3 className="text-white font-semibold text-lg mb-4">Audio Configuration</h3>
              
              {/* Kid Name */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Kid Name</label>
                <input 
                  type="text"
                  value={kidName}
                  onChange={(e) => onKidNameChange(e.target.value)}
                  placeholder="Enter kid's name"
                  className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => onGenderChange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                >
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                </select>
              </div>

              {/* Story */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Select Story</label>
                <select
                  value={storyId}
                  onChange={(e) => onStoryChange(e.target.value)}
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
            </div>

            <button
              onClick={onGenerateAudio}
              disabled={isGeneratingAudio}
              className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingAudio ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  Generating Audio...
                </span>
              ) : 'Generate Audio'}
            </button>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative px-4 bg-gray-800 text-gray-400 text-sm">OR</div>
            </div>

            {/* Skip to Video Generation Button */}
            <button
              onClick={onContinue}
              className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              Already have audio file? Skip to Video Generation →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-500 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">✓</div>
              <p className="text-green-400 font-semibold text-lg mb-2">Audio Generated Successfully!</p>
              <p className="text-gray-300 text-sm">{audioResponse?.story_name}</p>
            </div>

            {/* Audio URL Display */}
            {audioUrl && (
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span className="text-xl">🎵</span>
                      Audio URL
                    </p>
                    <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 break-all">
                      <code className="text-green-400 text-sm">{audioUrl}</code>
                    </div>
                  </div>
                  <button
                    onClick={() => onCopyToClipboard(audioUrl)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={onContinue}
              className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-lg"
            >
              Continue to Video Generation →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

