export default function InstructionsPanel() {
  return (
    <div className="bg-blue-900/20 border-2 border-blue-500/50 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-3">Image Preparation Tools</h3>
        <p className="text-blue-200 text-sm mb-4">Use these tools to prepare your images:</p>
        
        <div className="space-y-2">
          {/* Photoroom Link */}
          <a 
            href="https://www.photoroom.com/tools/white-background" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline font-medium block"
          >
            Photoroom - White Background Tool
          </a>

          {/* Picsart Link */}
          <a 
            href="https://picsart.com/ai-image-enhancer/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline font-medium block"
          >
            Picsart - AI Image Enhancer
          </a>
        </div>
      </div>

    </div>
  );
}

