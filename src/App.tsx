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

  const handleLogout = async () => {
    await fetch(`${BACKEND_URL}/logout`, { credentials: 'include' })
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Taleyport Dev</h1>
        <div className="flex items-center gap-4">
          <img 
            src={user.picture} 
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div className="text-white">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content - 3 columns */}
      <div className="grid grid-cols-3 h-[calc(100vh-80px)]">
        
        {/* Column 1: Upload Photo */}
        <div className="border-r border-gray-800 p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">📷 Upload Photo</h2>
            <p className="text-gray-400 text-sm">Upload images for processing</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-gray-600 transition cursor-pointer">
                <p className="text-gray-400 mb-4">Drag & drop or click to upload</p>
                <button className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition">
                  Browse Files
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Generate Audio */}
        <div className="border-r border-gray-800 p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">🎵 Generate Audio</h2>
            <p className="text-gray-400 text-sm">Create audio from text or scripts</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <textarea 
                className="w-full h-48 p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:border-gray-600 focus:outline-none resize-none"
                placeholder="Enter text to generate audio..."
              />
              <button className="mt-4 w-full px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition">
                Generate Audio
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Generate Video */}
        <div className="p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">🎬 Generate Video</h2>
            <p className="text-gray-400 text-sm">Create videos from content</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="space-y-4">
                <input 
                  type="text"
                  className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:border-gray-600 focus:outline-none"
                  placeholder="Video title..."
                />
                <textarea 
                  className="w-full h-32 p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:border-gray-600 focus:outline-none resize-none"
                  placeholder="Video description..."
                />
                <button className="w-full px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition">
                  Generate Video
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App

