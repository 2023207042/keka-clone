import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { useTranslation } from 'react-i18next';

const labelVariants = cva('inline-flex items-baseline gap-1', {
  variants: {
    variant: {
      h1: 'text-2xl md:text-3xl lg:text-4xl leading-tight font-normal',
      h1Bold: 'text-2xl md:text-3xl lg:text-4xl leading-tight font-bold',
      h2: 'text-xl md:text-2xl lg:text-3xl leading-snug font-normal',
      h2Bold: 'text-xl md:text-2xl lg:text-3xl leading-snug font-bold',
      h3: 'text-lg md:text-xl lg:text-2xl leading-snug font-normal',
      h3Bold: 'text-lg md:text-xl lg:text-2xl leading-snug font-bold',
      p1: 'text-base md:text-lg leading-relaxed font-normal',
      p1Bold: 'text-base md:text-lg leading-relaxed font-semibold',
      p2: 'text-sm md:text-base leading-relaxed font-normal',
      p2Bold: 'text-sm md:text-base leading-relaxed font-semibold',
      p3: 'text-xs md:text-sm leading-relaxed font-normal',
      p3Bold: 'text-xs md:text-sm leading-relaxed font-semibold',
      p4: 'text-[11px] md:text-xs leading-relaxed font-normal',
      p4Bold: 'text-[11px] md:text-xs leading-relaxed font-semibold',
      interactionLarge: 'text-base font-medium',
      interactionLargeBold: 'text-base font-bold',
      interactionMedium: 'text-sm font-medium',
      interactionMediumBold: 'text-sm font-bold',
      interactionSmall: 'text-xs font-medium',
      interactionSmallBold: 'text-xs font-bold',
      avatarLabel: 'text-[10px] leading-none font-medium',
    },
    color: {
      primary: 'text-[var(--color-primary-600)]',
      secondary: 'text-[var(--text-secondary)]',
      muted: 'text-[var(--color-surface-400)]',
      success: 'text-green-600',
      danger: 'text-red-600',
      warning: 'text-amber-500',
      info: 'text-[var(--color-primary-400)]',
      white: 'text-white',
      black: 'text-[var(--text-primary)]',
      inherit: 'text-inherit',
    },
    statusLabel: {
      Standard: 'text-[var(--text-primary)]',
      Success: 'text-green-600',
      Hot: 'text-red-500',
      Warning: 'text-amber-500',
      Disabled: 'text-[var(--text-secondary)] opacity-50',
      RHBPremierBanking: 'text-[var(--color-primary-800)]',
    },
  },
  defaultVariants: {
    variant: 'p1',
    color: 'black',
  },
});

export type RNLabelProps = Omit<HTMLAttributes<HTMLLabelElement>, 'color'> &
  VariantProps<typeof labelVariants> & {
    /** i18n key or plain text; supports `key1::key2` joining like your Angular impl */
    label?: string;
    /** whether to show (optional) tag */
    required?: boolean;
    /** htmlFor association */
    htmlFor?: string;
    /** optional translator; if provided we’ll split by `::` and translate parts */
    translateFn?: (key: string) => string;
    /** Custom color override */
    customColor?: string;
  };

export const RNLabel = forwardRef<HTMLLabelElement, RNLabelProps>(function RNLabel(
  {
    label,
    required = false,
    htmlFor,
    color,
    className,
    variant,
    statusLabel,
    children,
    translateFn,
    customColor,
    ...rest
  },
  ref
) {
  const { t } = useTranslation();

  // replicate Angular: "key1::key2" => translate each, join with space
  const renderLabel = (raw?: string) => {
    if (!raw) return null;
    return raw
      .split('::')
      .map((p) => t(p.trim()))
      .join(' ');
  };

  return (
    <label
      ref={ref}
      htmlFor={htmlFor || label}
      className={cn(labelVariants({ variant, color, statusLabel, className }))}
      style={customColor ? { color: customColor } : undefined}
      {...rest}
    >
      {label ? renderLabel(label) : children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
});
