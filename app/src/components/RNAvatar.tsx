import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { User } from 'lucide-react';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full bg-[var(--color-surface-200)] items-center justify-center text-[var(--text-muted)]',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
        xl: 'h-20 w-20 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface RNAvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
  fallback?: React.ReactNode;
}

export function RNAvatar({ className, size, src, alt, fallback, ...props }: RNAvatarProps) {
  
  // Simple check for error/empty src could be added with state, but keeping it simple for now
  // For production, maybe use a loaded state or @radix-ui/react-avatar

  return (
    <div className={cn(avatarVariants({ size, className }))}>
       {src ? (
         <img
           src={src}
           alt={alt}
           className="aspect-square h-full w-full object-cover"
           {...props}
         />
       ) : (
         fallback || <User className="h-1/2 w-1/2" />
       )}
    </div>
  );
}
