import { useState, useEffect } from 'react';

export default function SampleImagesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const referenceImages = [
    {
      src: "https://i.ibb.co/gZk8gF4g/3-ADA326-C-4-DDE-40-A1-88-EB-697-A22-E4-B647.jpg",
      alt: "Example 1 - Good photo quality",
      name: "Example 1"
    },
    {
      src: "https://i.ibb.co/bRC8tcS4/9-CF091-F0-44-E9-41-EC-A805-179-FEE3428-A0.jpg",
      alt: "Example 2 - Clear face visibility", 
      name: "Example 2"
    },
    {
      src: "https://i.ibb.co/G37YJgpP/2058-FB56-4-F3-E-43-ED-9-D38-632-A93-C6-F3-F2.jpg",
      alt: "Example 3 - Proper outfit choice",
      name: "Example 3"
    },
    {
      src: "https://i.ibb.co/jPz1CTqJ/39568-A66-33-BD-48-B6-929-E-7874115031-DA.jpg",
      alt: "Example 4 - Multiple angle reference",
      name: "Example 4"
    },
    {
      src: "https://i.ibb.co/QF36Pdn6/E7-F7-F9-B6-2641-45-B1-8-CD1-2-E37-C4-C9-A1-F6.jpg",
      alt: "Example 5 - Good photo composition",
      name: "Example 5"
    }
  ];

  // Responsive carousel logic
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide effect - responsive based on screen size
  const imagesPerView = isMobile ? 1 : 3;
  const maxSlides = Math.max(0, referenceImages.length - imagesPerView);
  
  useEffect(() => {
    if (maxSlides === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (maxSlides + 1));
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [maxSlides]);

  const nextSlide = () => {
    if (maxSlides === 0) return;
    setCurrentSlide((prev) => (prev + 1) % (maxSlides + 1));
  };

  const prevSlide = () => {
    if (maxSlides === 0) return;
    setCurrentSlide((prev) => (prev - 1 + maxSlides + 1) % (maxSlides + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Good Sample Images
      </h3>
      
      <div className="relative bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        {/* Carousel Container */}
        <div className="relative h-80 overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full gap-4 px-4"
            style={{ 
              transform: `translateX(-${currentSlide * (isMobile ? 100 : 33.333)}%)` 
            }}
          >
            {referenceImages.map((image, index) => (
              <div key={index} className={`${isMobile ? 'w-full' : 'w-1/3'} flex-shrink-0 relative`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-72 object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
                  <p className="text-white font-medium text-sm">{image.name}</p>
                  <p className="text-white/80 text-xs">{image.alt.split(' - ')[1]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 p-4">
          {Array.from({ length: maxSlides + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-blue-400' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <p className="text-sm text-white/60 mt-3 text-center">
        ✅ These photos show clear faces with good lighting and white backgrounds
      </p>
    </div>
  );
}

