import { useState, useEffect } from 'react'
import Login from './components/Login'
import Header from './components/Header'
import StepIndicator from './components/StepIndicator'
import UploadImagesStep from './components/UploadImagesStep'
import GenerateAudioStep from './components/GenerateAudioStep'
import GenerateVideoStep from './components/GenerateVideoStep'

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
  const [stories, setStories] = useState<Array<{id: string, name: string, total_scenes: number}>>([])
  const [kidName, setKidName] = useState('')
  const [language, setLanguage] = useState('English')
  const [gender, setGender] = useState('boy')
  const [storyId, setStoryId] = useState('')
  
  // Step 3 state
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [videoGenerated, setVideoGenerated] = useState(false)
  const [videoImageUrl, setVideoImageUrl] = useState('')
  const [videoFaceUrl, setVideoFaceUrl] = useState('')
  const [videoStoryId, setVideoStoryId] = useState('')
  const [videoOutputPrompts, setVideoOutputPrompts] = useState<any[]>([])

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
          setStoryId(data.stories[0].id)
          setVideoStoryId(data.stories[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch stories:', error)
      }
    }
    fetchStories()
  }, [])

  // Pre-fill video form when moving to step 3
  useEffect(() => {
    if (currentStep === 3) {
      // Pre-fill image URLs from upload response
      if (uploadResponse?.image1?.url) {
        setVideoImageUrl(uploadResponse.image1.url)
      }
      if (uploadResponse?.image2?.url) {
        setVideoFaceUrl(uploadResponse.image2.url)
      }
      // Pre-fill story ID from audio step
      if (storyId) {
        setVideoStoryId(storyId)
      }
    }
  }, [currentStep, uploadResponse, storyId])

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

  const handleGenerateVideo = async (sceneIds: string[]) => {
    if (!videoImageUrl || !videoFaceUrl || sceneIds.length === 0) {
      alert('Please provide all required fields')
      return
    }

    setIsGeneratingVideo(true)
    
    try {
      const response = await fetch(`${BACKEND_URL}/generate-specific-videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: videoImageUrl,
          face_url: videoFaceUrl,
          scene_ids: sceneIds,
          story_id: videoStoryId
        })
      })

      if (!response.ok) {
        throw new Error(`Video generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      setVideoOutputPrompts(data.output_prompts || [])
      setVideoGenerated(true)
      console.log('Video generation response:', data)
    } catch (error) {
      console.error('Video generation error:', error)
      alert(`Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGeneratingVideo(false)
    }
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
    setVideoImageUrl('')
    setVideoFaceUrl('')
    setVideoStoryId(stories.length > 0 ? stories[0].id : '')
    setVideoOutputPrompts([])
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
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl min-h-[500px]">
          
          {/* Step 1: Upload Images */}
          {currentStep === 1 && (
            <UploadImagesStep
              uploadedImage1={uploadedImage1}
              imagePreview1={imagePreview1}
              uploadedImage2={uploadedImage2}
              imagePreview2={imagePreview2}
              isUploading={isUploading}
              uploadResponse={uploadResponse}
              onImageUpload1={handleImageUpload1}
              onImageUpload2={handleImageUpload2}
              onRemoveImage1={() => {
                                setUploadedImage1(null)
                                setImagePreview1(null)
                              }}
              onRemoveImage2={() => {
                                setUploadedImage2(null)
                                setImagePreview2(null)
                              }}
              onUploadImages={handleUploadImages}
              onCopyToClipboard={copyToClipboard}
              onContinue={() => setCurrentStep(2)}
            />
          )}

          {/* Step 2: Generate Audio */}
          {currentStep === 2 && (
            <GenerateAudioStep
              uploadResponse={uploadResponse}
              imagePreview1={imagePreview1}
              imagePreview2={imagePreview2}
              kidName={kidName}
              language={language}
              gender={gender}
              storyId={storyId}
              stories={stories}
              isGeneratingAudio={isGeneratingAudio}
              audioGenerated={audioGenerated}
              audioUrl={audioUrl}
              audioResponse={audioResponse}
              onKidNameChange={setKidName}
              onLanguageChange={setLanguage}
              onGenderChange={setGender}
              onStoryChange={setStoryId}
              onGenerateAudio={handleGenerateAudio}
              onCopyToClipboard={copyToClipboard}
              onContinue={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {/* Step 3: Generate Video */}
          {currentStep === 3 && (
            <GenerateVideoStep
              uploadResponse={uploadResponse}
              imagePreview1={imagePreview1}
              imagePreview2={imagePreview2}
              audioUrl={audioUrl}
              isGeneratingVideo={isGeneratingVideo}
              videoGenerated={videoGenerated}
              imageUrl={videoImageUrl}
              faceUrl={videoFaceUrl}
              videoStoryId={videoStoryId}
              stories={stories}
              outputPrompts={videoOutputPrompts}
              onImageUrlChange={setVideoImageUrl}
              onFaceUrlChange={setVideoFaceUrl}
              onVideoStoryIdChange={setVideoStoryId}
              onGenerateVideo={handleGenerateVideo}
              onCopyToClipboard={copyToClipboard}
              onBack={() => setCurrentStep(2)}
            />
          )}

        </div>

      </div>
    </div>
  )
}

export default App

