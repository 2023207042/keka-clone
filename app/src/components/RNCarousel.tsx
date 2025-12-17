import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/composeStyles';
import { RNButton } from './RNButton';

export interface RNCarouselProps {
  children: React.ReactNode[];
  options?: any; // Embla options
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
}

export function RNCarousel({ children, options, className, showArrows = true, showDots = true }: RNCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, ...options });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative group", className)}>
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {children.map((child, index) => (
            <div className="flex-[0_0_100%] min-w-0 pl-4 relative" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <RNButton
            variant="ghost" 
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </RNButton>
          <RNButton
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </RNButton>
        </>
      )}

      {showDots && (
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === selectedIndex ? "bg-[var(--color-primary-600)] w-6" : "bg-[var(--color-surface-300)] hover:bg-[var(--color-primary-300)]"
              )}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
