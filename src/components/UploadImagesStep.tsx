import ImageUploadZone from './ImageUploadZone';
import InstructionsPanel from './InstructionsPanel';
import SampleImagesCarousel from './SampleImagesCarousel';

interface UploadImagesStepProps {
  uploadedImage1: File | null;
  imagePreview1: string | null;
  uploadedImage2: File | null;
  imagePreview2: string | null;
  isUploading: boolean;
  uploadResponse: any;
  onImageUpload1: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload2: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage1: () => void;
  onRemoveImage2: () => void;
  onUploadImages: () => void;
  onCopyToClipboard: (text: string) => void;
  onContinue: () => void;
}

export default function UploadImagesStep({
  uploadedImage1,
  imagePreview1,
  uploadedImage2,
  imagePreview2,
  isUploading,
  uploadResponse,
  onImageUpload1,
  onImageUpload2,
  onRemoveImage1,
  onRemoveImage2,
  onUploadImages,
  onCopyToClipboard,
  onContinue
}: UploadImagesStepProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-white mb-4">Upload Your Images</h2>
      <p className="text-gray-400 mb-8 text-center">Upload two images to get started</p>
      
      <div className="w-full max-w-4xl">
        {!uploadResponse ? (
          <div className="space-y-6">
            {/* Sample Images Carousel */}
            <SampleImagesCarousel />

            {/* Two Image Upload Zones */}
            <div className="grid grid-cols-2 gap-6">
              <ImageUploadZone
                label="Full Body Image"
                imagePreview={imagePreview1}
                onUpload={onImageUpload1}
                onRemove={onRemoveImage1}
              />
              <ImageUploadZone
                label="Close Up Image"
                imagePreview={imagePreview2}
                onUpload={onImageUpload2}
                onRemove={onRemoveImage2}
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={onUploadImages}
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

            {/* OR Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative px-4 bg-gray-900 text-gray-400 text-sm">OR</div>
            </div>

            {/* Skip to Next Step Button */}
            <button
              onClick={onContinue}
              className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              I Have Image URLs - Take Me Next! →
            </button>

            {/* Instructions Section */}
            <InstructionsPanel />
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
                    onClick={() => onCopyToClipboard(uploadResponse.image1?.url)}
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
                    onClick={() => onCopyToClipboard(uploadResponse.image2?.url)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={onContinue}
              className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-lg"
            >
              Continue to Audio Generation →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

