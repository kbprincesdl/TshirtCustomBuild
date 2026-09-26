import React from 'react';
import { GraphicShape } from '../types/apparel';

interface FluidGraphicProps {
  src: string;
  alt: string;
  shape: GraphicShape;
  featherEdges: boolean;
  blendMode?: string;
  opacity?: number;
  className?: string;
  maxHeight?: string;
}

/**
 * FluidGraphic applies organic silhouette cutouts, feathered edge vignetting,
 * and ink-absorption filters so graphics look natively screenprinted or dyed
 * onto the garment rather than appearing as a harsh square box or rectangular photo.
 */
export const FluidGraphic: React.FC<FluidGraphicProps> = ({
  src,
  alt,
  shape = 'fluid',
  featherEdges = true,
  blendMode = 'multiply',
  opacity = 0.95,
  className = '',
  maxHeight = '270px',
}) => {
  // SVG Mask paths that give organic, curved, fluid edges
  const getMaskStyle = (): React.CSSProperties => {
    if (shape === 'natural') {
      // Natural clean vector contour
      return featherEdges
        ? {
            WebkitMaskImage:
              'radial-gradient(ellipse 94% 94% at 50% 50%, black 72%, rgba(0, 0, 0, 0.4) 88%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 94% 94% at 50% 50%, black 72%, rgba(0, 0, 0, 0.4) 88%, transparent 100%)',
          }
        : {};
    }

    if (shape === 'organic_soft') {
      // Soft organic vignette that melts into fabric
      return {
        WebkitMaskImage:
          'radial-gradient(ellipse 88% 85% at 50% 48%, black 50%, rgba(0, 0, 0, 0.7) 72%, rgba(0,0,0,0.15) 90%, transparent 100%)',
        maskImage:
          'radial-gradient(ellipse 88% 85% at 50% 48%, black 50%, rgba(0, 0, 0, 0.7) 72%, rgba(0,0,0,0.15) 90%, transparent 100%)',
      };
    }

    if (shape === 'die_cut') {
      // Hexagonal / faceted streetwear decal shape
      return {
        clipPath: 'polygon(50% 0%, 93% 20%, 93% 80%, 50% 100%, 7% 80%, 7% 20%)',
      };
    }

    if (shape === 'grunge_weathered') {
      // Distressed streetwear oval contour
      return {
        WebkitMaskImage:
          'radial-gradient(ellipse 90% 92% at 50% 50%, black 60%, rgba(0,0,0,0.6) 80%, transparent 98%)',
        maskImage:
          'radial-gradient(ellipse 90% 92% at 50% 50%, black 60%, rgba(0,0,0,0.6) 80%, transparent 98%)',
        filter: 'contrast(1.15) brightness(0.98)',
      };
    }

    // Default 'fluid': Organic rounded blob vignette that eliminates all harsh square borders
    return {
      WebkitMaskImage:
        'radial-gradient(ellipse 86% 88% at 50% 50%, black 62%, rgba(0, 0, 0, 0.6) 80%, rgba(0, 0, 0, 0.1) 94%, transparent 100%)',
      maskImage:
        'radial-gradient(ellipse 86% 88% at 50% 50%, black 62%, rgba(0, 0, 0, 0.6) 80%, rgba(0, 0, 0, 0.1) 94%, transparent 100%)',
      borderRadius: '24px',
    };
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-all duration-200 select-none ${className}`}
      style={{
        ...getMaskStyle(),
        mixBlendMode: blendMode as any,
        opacity: opacity,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-300"
        style={{
          maxHeight,
          // Subtle screenprint ink absorption filter
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12)) contrast(1.08)',
        }}
      />
    </div>
  );
};
