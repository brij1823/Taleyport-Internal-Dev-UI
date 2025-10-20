import { useState, useEffect } from 'react'
import Login from './components/Login'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

interface User {
  name: string;
  email: string;
  picture: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Step 1 state
  const [uploadedImage1, setUploadedImage1] = useState<File | null>(null)
  const [imagePreview1, setImagePreview1] = useState<string | null>(null)
  const [uploadedImage2, setUploadedImage2] = useState<File | null>(null)
  const [imagePreview2, setImagePreview2] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResponse, setUploadResponse] = useState<any>(null)
  
  // Step 2 state
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioResponse, setAudioResponse] = useState<any>(null)
  const [stories, setStories] = useState<Array<{id: string, name: string}>>([])
  const [kidName, setKidName] = useState('')
  const [language, setLanguage] = useState('English')
  const [gender, setGender] = useState('boy')
  const [storyId, setStoryId] = useState('')
  
  // Step 3 state
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [videoGenerated, setVideoGenerated] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('error')) {
      alert(`Login failed: ${params.get('error')}`)
      window.history.replaceState({}, '', '/')
      setLoading(false)
      return
    }
    if (params.get('login') === 'success') window.history.replaceState({}, '', '/')
    
    fetch(`${BACKEND_URL}/user`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => data.logged_in && setUser(data.user))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Fetch stories list
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/stories`)
        const data = await response.json()
        setStories(data.stories || [])
        if (data.stories && data.stories.length > 0) {
          setStoryId(data.stories[0].id) // Set first story as default
        }
      } catch (error) {
        console.error('Failed to fetch stories:', error)
      }
    }
    fetchStories()
  }, [])

  const handleLogout = async () => {
    await fetch(`${BACKEND_URL}/logout`, { credentials: 'include' })
    setUser(null)
  }

  const handleImageUpload1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage1(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview1(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage2(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview2(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleUploadImages = async () => {
    if (!uploadedImage1 || !uploadedImage2) {
      alert('Please upload both images')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('image1', uploadedImage1)
    formData.append('image2', uploadedImage2)

    try {
      const response = await fetch(`${BACKEND_URL}/upload-image`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      setUploadResponse(data)
      console.log('Upload response:', data)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleNextFromStep1 = () => {
    if (uploadResponse) {
      setCurrentStep(2)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('URL copied to clipboard!')
  }

  const handleGenerateAudio = async () => {
    if (!kidName.trim()) {
      alert('Please enter a kid name')
      return
    }
    if (!storyId) {
      alert('Please select a story')
      return
    }

    setIsGeneratingAudio(true)
    try {
      const response = await fetch(`${BACKEND_URL}/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kid_name: kidName,
          language: language,
          story_id: storyId,
          gender: gender
        })
      })

      if (!response.ok) {
        throw new Error(`Audio generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      setAudioResponse(data)
      setAudioUrl(data.audio_url)
      setAudioGenerated(true)
      console.log('Audio response:', data)
    } catch (error) {
      console.error('Audio generation error:', error)
      alert(`Failed to generate audio: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  const handleNextFromStep2 = () => {
    if (audioGenerated) {
      setCurrentStep(3)
    }
  }

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true)
    // Simulate video generation
    setTimeout(() => {
      setIsGeneratingVideo(false)
      setVideoGenerated(true)
      setVideoUrl('sample-video.mp4') // Replace with actual API call
    }, 3000)
  }

  const handleReset = () => {
    setCurrentStep(1)
    setUploadedImage1(null)
    setImagePreview1(null)
    setUploadedImage2(null)
    setImagePreview2(null)
    setUploadResponse(null)
    setAudioGenerated(false)
    setAudioUrl(null)
    setAudioResponse(null)
    setKidName('')
    setLanguage('English')
    setGender('boy')
    setVideoGenerated(false)
    setVideoUrl(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Taleyport Studio</h1>
        <div className="flex items-center gap-4">
          <img 
            src={user.picture} 
            alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
          />
          <div className="text-white">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition shadow-lg"
          >
            Logout
          </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    currentStep === step 
                      ? 'bg-white text-black shadow-lg shadow-white/50' 
                      : currentStep > step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${
                    currentStep >= step ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Upload Image' : step === 2 ? 'Generate Audio' : 'Generate Video'}
                  </p>
          </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl min-h-[500px]">
          
          {/* Step 1: Upload Images */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl font-bold text-white mb-4">📷 Upload Your Images</h2>
              <p className="text-gray-400 mb-8 text-center">Upload two images to get started</p>
              
              <div className="w-full max-w-4xl">
                {!uploadResponse ? (
                  <div className="space-y-6">
                    {/* Two Image Upload Zones */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Image 1 */}
                      <div>
                        <p className="text-white text-sm font-semibold mb-2">Full Body Image</p>
                        {!imagePreview1 ? (
                          <label className="block">
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-white hover:bg-gray-800/50 transition cursor-pointer">
                              <div className="text-4xl mb-3">📁</div>
                              <p className="text-white text-sm mb-1">Click to upload</p>
                              <p className="text-gray-400 text-xs">PNG, JPG, WEBP</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload1}
                            />
                          </label>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                            <img 
                              src={imagePreview1} 
                              alt="Preview 1" 
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => {
                                setUploadedImage1(null)
                                setImagePreview1(null)
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Image 2 */}
                      <div>
                        <p className="text-white text-sm font-semibold mb-2">Close Up Image</p>
                        {!imagePreview2 ? (
                          <label className="block">
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-white hover:bg-gray-800/50 transition cursor-pointer">
                              <div className="text-4xl mb-3">📁</div>
                              <p className="text-white text-sm mb-1">Click to upload</p>
                              <p className="text-gray-400 text-xs">PNG, JPG, WEBP</p>
          </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload2}
                            />
                          </label>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                            <img 
                              src={imagePreview2} 
                              alt="Preview 2" 
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => {
                                setUploadedImage2(null)
                                setImagePreview2(null)
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Button */}
                    <button
                      onClick={handleUploadImages}
                      disabled={!uploadedImage1 || !uploadedImage2 || isUploading}
                      className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                          Uploading Images...
                        </span>
                      ) : 'Upload Images'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Success Message */}
                    <div className="bg-green-900/30 border border-green-500 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-2">✓</div>
                      <p className="text-green-400 font-semibold text-lg">{uploadResponse.message || 'Images uploaded successfully!'}</p>
                    </div>

                    {/* URLs Display */}
                    <div className="space-y-4">
                      {/* Image 1 URL */}
                      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold mb-2 flex items-center gap-2">
                              <span className="text-xl">🖼️</span>
                              Full Body URL
                            </p>
                            <p className="text-gray-400 text-sm mb-1">Filename: {uploadResponse.image1?.filename}</p>
                            <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 break-all">
                              <code className="text-green-400 text-sm">{uploadResponse.image1?.url}</code>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(uploadResponse.image1?.url)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                          >
                            📋 Copy
                          </button>
                        </div>
                      </div>

                      {/* Image 2 URL */}
                      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold mb-2 flex items-center gap-2">
                              <span className="text-xl">🖼️</span>
                              Close Up URL
                            </p>
                            <p className="text-gray-400 text-sm mb-1">Filename: {uploadResponse.image2?.filename}</p>
                            <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 break-all">
                              <code className="text-green-400 text-sm">{uploadResponse.image2?.url}</code>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(uploadResponse.image2?.url)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                          >
                            📋 Copy
              </button>
            </div>
          </div>
        </div>

                    {/* Continue Button */}
                    <button
                      onClick={handleNextFromStep1}
                      className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-lg"
                    >
                      Continue to Audio Generation →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Generate Audio */}
          {currentStep === 2 && (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl font-bold text-white mb-4">🎵 Generate Audio</h2>
              <p className="text-gray-400 mb-8 text-center">Create audio for your video</p>
              
              <div className="w-full max-w-3xl space-y-6">
                {/* Uploaded Images Preview & URLs */}
                {uploadResponse && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Full Body Image */}
                      {imagePreview1 && uploadResponse.image1 && (
                        <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="rounded overflow-hidden border border-gray-600 flex-shrink-0">
                              <img src={imagePreview1} alt="Full Body" className="w-12 h-12 object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-semibold mb-1">Full Body</p>
                              <button
                                onClick={() => copyToClipboard(uploadResponse.image1.url)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                          <div className="bg-gray-900 rounded p-1.5 border border-gray-600">
                            <code className="text-green-400 text-[10px] break-all line-clamp-1">{uploadResponse.image1.url}</code>
                          </div>
                        </div>
                      )}
                      
                      {/* Close Up Image */}
                      {imagePreview2 && uploadResponse.image2 && (
                        <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="rounded overflow-hidden border border-gray-600 flex-shrink-0">
                              <img src={imagePreview2} alt="Close Up" className="w-12 h-12 object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-semibold mb-1">Close Up</p>
                              <button
                                onClick={() => copyToClipboard(uploadResponse.image2.url)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                          <div className="bg-gray-900 rounded p-1.5 border border-gray-600">
                            <code className="text-green-400 text-[10px] break-all line-clamp-1">{uploadResponse.image2.url}</code>
                          </div>
                        </div>
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
                          onChange={(e) => setKidName(e.target.value)}
                          placeholder="Enter kid's name"
                          className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                        />
                      </div>

                      {/* Language */}
                      <div>
                        <label className="block text-white text-sm font-semibold mb-2">Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
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
                          onChange={(e) => setGender(e.target.value)}
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
                          onChange={(e) => setStoryId(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-white focus:outline-none"
                        >
                          {stories.map((story) => (
                            <option key={story.id} value={story.id}>
                              {story.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateAudio}
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
                            onClick={() => copyToClipboard(audioUrl)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                          >
                            📋 Copy
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleNextFromStep2}
                      className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-lg"
                    >
                      Continue to Video Generation →
                </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Generate Video */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl font-bold text-white mb-4">🎬 Generate Video</h2>
              <p className="text-gray-400 mb-8 text-center">Create your final video with images and audio</p>
              
              <div className="w-full max-w-3xl space-y-6">
                {/* Assets Preview & URLs */}
                {(uploadResponse || audioUrl) && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {/* Full Body Image */}
                      {imagePreview1 && uploadResponse?.image1 && (
                        <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="rounded overflow-hidden border border-gray-600 flex-shrink-0">
                              <img src={imagePreview1} alt="Full Body" className="w-12 h-12 object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-semibold mb-1">Full Body</p>
                              <button
                                onClick={() => copyToClipboard(uploadResponse.image1.url)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                          <div className="bg-gray-900 rounded p-1.5 border border-gray-600">
                            <code className="text-green-400 text-[10px] break-all line-clamp-1">{uploadResponse.image1.url}</code>
                          </div>
                        </div>
                      )}
                      
                      {/* Close Up Image */}
                      {imagePreview2 && uploadResponse?.image2 && (
                        <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="rounded overflow-hidden border border-gray-600 flex-shrink-0">
                              <img src={imagePreview2} alt="Close Up" className="w-12 h-12 object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-semibold mb-1">Close Up</p>
                              <button
                                onClick={() => copyToClipboard(uploadResponse.image2.url)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                          <div className="bg-gray-900 rounded p-1.5 border border-gray-600">
                            <code className="text-green-400 text-[10px] break-all line-clamp-1">{uploadResponse.image2.url}</code>
                          </div>
                        </div>
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
                                onClick={() => copyToClipboard(audioUrl)}
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
                
                {/* Video Generation Section */}
                {!videoGenerated ? (
                  <button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingVideo ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                        Generating Video...
                      </span>
                    ) : 'Generate Video'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-900/30 border border-green-500 rounded-xl p-8 text-center">
                      <div className="text-5xl mb-3">🎉</div>
                      <p className="text-green-400 font-bold text-xl mb-2">Video Generated Successfully!</p>
                      <p className="text-gray-400 text-sm">Your video is ready to download</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg"
                      >
                        Download Video
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition"
                      >
                        Start New Project
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
          )}

        </div>

        {/* Navigation Buttons */}
        {currentStep > 1 && !videoGenerated && (
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
            >
              ← Back
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default App

