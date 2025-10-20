const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

function Login() {
  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-12">Taleyport Dev</h1>
        
        <button
          onClick={handleLogin}
          className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;

