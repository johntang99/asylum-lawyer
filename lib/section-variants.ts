// ============================================
// SECTION VARIANT SYSTEM
// Defines different layout variants for hero and other section types
// Adapted from BAAM chinese-medicine site
// ============================================

export type HeroVariant =
  | 'stats-bar'               // Text left, stats row below (asylum default)
  | 'centered'                // Text centered, optional background image
  | 'split-photo-right'       // Text left, photo right
  | 'split-photo-left'        // Text right, photo left
  | 'overlap'                 // Text overlaps photo with dark overlay
  | 'photo-background'        // Photo as full background
  | 'gallery-background'      // Rotating gallery background
  | 'video-background';       // Video as background

export interface SectionVariantConfig {
  variant: string;
  className?: string;
  layout?: 'container' | 'full-width' | 'narrow';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'gradient' | 'image' | 'video';
}

export const heroVariantConfig: Record<HeroVariant, SectionVariantConfig> = {
  'stats-bar': {
    variant: 'stats-bar',
    layout: 'container',
    padding: 'lg',
    background: 'gradient',
  },
  centered: {
    variant: 'centered',
    layout: 'container',
    padding: 'xl',
    className: 'text-center',
  },
  'split-photo-right': {
    variant: 'split-photo-right',
    layout: 'container',
    padding: 'lg',
    className: 'grid md:grid-cols-2 gap-12 items-center',
  },
  'split-photo-left': {
    variant: 'split-photo-left',
    layout: 'container',
    padding: 'lg',
    className: 'grid md:grid-cols-2 gap-12 items-center',
  },
  overlap: {
    variant: 'overlap',
    layout: 'full-width',
    padding: 'none',
    className: 'relative',
  },
  'photo-background': {
    variant: 'photo-background',
    layout: 'full-width',
    padding: 'xl',
    background: 'image',
    className: 'relative bg-cover bg-center',
  },
  'gallery-background': {
    variant: 'gallery-background',
    layout: 'full-width',
    padding: 'xl',
    background: 'image',
    className: 'relative bg-cover bg-center',
  },
  'video-background': {
    variant: 'video-background',
    layout: 'full-width',
    padding: 'xl',
    background: 'video',
    className: 'relative overflow-hidden',
  },
};

export function getSectionVariant<T extends SectionVariantConfig>(
  variants: Record<string, T>,
  variantName: string
): T {
  return variants[variantName] || Object.values(variants)[0];
}
