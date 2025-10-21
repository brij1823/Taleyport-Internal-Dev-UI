interface HeaderProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
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
            onClick={onLogout}
            className="ml-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

