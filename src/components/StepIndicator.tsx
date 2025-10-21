interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Upload Image' },
  { number: 2, label: 'Generate Audio' },
  { number: 3, label: 'Generate Video' }
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                currentStep === step.number 
                  ? 'bg-white text-black shadow-lg shadow-white/50' 
                  : currentStep > step.number 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <p className={`mt-2 text-sm font-semibold ${
                currentStep >= step.number ? 'text-white' : 'text-gray-500'
              }`}>
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 transition-all ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-700'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

