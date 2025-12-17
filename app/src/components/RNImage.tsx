import { cn } from '@/utils/composeStyles';

export interface RNImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  fit?: 'cover' | 'contain' | 'fill' | 'none';
}

const aspectStyles = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: 'aspect-auto',
};

const fitStyles = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
};

export function RNImage({ className, aspectRatio = 'auto', fit = 'cover', alt, ...props }: RNImageProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl bg-[var(--color-surface-100)]", aspectStyles[aspectRatio], className)}>
      <img
        className={cn("h-full w-full transition-all duration-300 hover:scale-105", fitStyles[fit])}
        alt={alt}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
