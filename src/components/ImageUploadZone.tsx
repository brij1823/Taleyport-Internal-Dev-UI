interface ImageUploadZoneProps {
  label: string;
  imagePreview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export default function ImageUploadZone({ label, imagePreview, onUpload, onRemove }: ImageUploadZoneProps) {
  return (
    <div>
      <p className="text-white text-sm font-semibold mb-2">{label}</p>
      {!imagePreview ? (
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
            onChange={onUpload}
          />
        </label>
      ) : (
        <div className="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
          <img 
            src={imagePreview} 
            alt={label} 
            className="w-full h-48 object-cover"
          />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

