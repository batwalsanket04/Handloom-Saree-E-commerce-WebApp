import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import hero1 from '../../assets/hero.jpg';
import hero2 from '../../assets/hero2.jpeg';
import hero3 from '../../assets/hero3.jpg';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
 

const Hero = () => {
  const heroImages = [
    { src: hero1, alt: 'Handloom saree collection' },
    { src: hero2, alt: 'Elegant silk sarees' },
    { src: hero3, alt: 'Traditional cotton sarees' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);

  const goToSlide = useCallback((index) => {
    setCurrentIndex((prev) => (index + heroImages.length) % heroImages.length);
  }, []);

  const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') { e.preventDefault(); setIsPlaying(!isPlaying); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide, isPlaying]);

  // Touch/swipe support
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    setTouchStart(null);
  };

  return (
    <Section
      as="section"
      spacing="none"
      background="none"
      container={false}
      className="relative"
    >
      <div
        className="relative w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={cn(
                'absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000',
                index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
              style={{ backgroundImage: `url(${img.src})` }}
              aria-hidden="true"
            >
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center">
          <Container size="lg">
            <div className="max-w-3xl animate-slide-up">
              <span className="inline-block px-4 py-1.5 rounded-button bg-white/20 backdrop-blur-sm text-white text-body-sm font-medium mb-4">
                New Collection 2024
              </span>
              <h1 className="text-heading-1 sm:text-heading-1 md:text-[4rem] lg:text-[4.5rem] font-extrabold text-white leading-tight mb-6">
                Elegant Handloom<br />
                <span className="text-brand-300">Sarees</span>
              </h1>
              <p className="text-body-lg sm:text-heading-6 text-white/90 max-w-xl mb-8 leading-relaxed">
                Discover the timeless beauty of handcrafted sarees, woven with tradition and love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                  onClick={() => window.location.href = '/collection'}
                >
                  Shop Collection
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white/20 border-white/30 hover:bg-white/30 text-white"
                  onClick={() => window.location.href = '/about'}
                >
                  Our Story
                </Button>
              </div>
            </div>
          </Container>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={cn(
            'absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20',
            'p-3 rounded-full bg-white/20 backdrop-blur-sm text-white',
            'hover:bg-white/30 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-400',
            'hidden sm:block'
          )}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className={cn(
            'absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20',
            'p-3 rounded-full bg-white/20 backdrop-blur-sm text-white',
            'hover:bg-white/30 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-400',
            'hidden sm:block'
          )}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Play/Pause & Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <div className="flex gap-2" role="tablist" aria-label="Slide indicators">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent',
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;