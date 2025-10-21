interface ImagePreviewCardProps {
  label: string;
  imagePreview: string | null;
  url: string;
  onCopy: () => void;
}

export default function ImagePreviewCard({ label, imagePreview, url, onCopy }: ImagePreviewCardProps) {
  return (
    <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <div className="rounded overflow-hidden border border-gray-600 flex-shrink-0">
          <img src={imagePreview || ''} alt={label} className="w-12 h-12 object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold mb-1">{label}</p>
          <button
            onClick={onCopy}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
          >
            📋 Copy
          </button>
        </div>
      </div>
      <div className="bg-gray-900 rounded p-1.5 border border-gray-600">
        <code className="text-green-400 text-[10px] break-all line-clamp-1">{url}</code>
      </div>
    </div>
  );
}

