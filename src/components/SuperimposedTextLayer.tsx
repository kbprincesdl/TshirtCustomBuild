import React from 'react';
import { CustomTextLayer } from '../types/apparel';

interface SuperimposedTextLayerProps {
  textLayer: CustomTextLayer;
  isFrontView?: boolean;
}

export const SuperimposedTextLayer: React.FC<SuperimposedTextLayerProps> = ({
  textLayer,
}) => {
  if (!textLayer.enabled || !textLayer.text.trim()) return null;

  // Compute text effect styles
  const getTextShadow = () => {
    switch (textLayer.textEffect) {
      case 'shadow':
        return '2px 3px 6px rgba(0, 0, 0, 0.75), 0px 1px 2px rgba(0, 0, 0, 0.5)';
      case 'outline':
        return `-1px -1px 0 ${textLayer.strokeColor || '#000'}, 1px -1px 0 ${textLayer.strokeColor || '#000'}, -1px 1px 0 ${textLayer.strokeColor || '#000'}, 1px 1px 0 ${textLayer.strokeColor || '#000'}`;
      case 'neon_glow':
        return `0 0 5px ${textLayer.color}, 0 0 10px ${textLayer.color}, 0 0 20px ${textLayer.color}`;
      case 'vintage_distressed':
        return '1px 1px 1px rgba(0,0,0,0.5), -1px -1px 1px rgba(255,255,255,0.2)';
      default:
        return '0 1px 3px rgba(0, 0, 0, 0.25)';
    }
  };

  const formattedText =
    textLayer.textTransform === 'uppercase'
      ? textLayer.text.toUpperCase()
      : textLayer.textTransform === 'lowercase'
      ? textLayer.text.toLowerCase()
      : textLayer.text;

  // Curved text path support via SVG
  if (textLayer.textEffect === 'curved') {
    return (
      <div
        className="w-full flex items-center justify-center select-none pointer-events-none transition-all duration-150"
        style={{
          transform: `translate(${textLayer.offsetX}px, ${textLayer.offsetY}px) rotate(${textLayer.rotation}deg)`,
        }}
      >
        <svg
          viewBox="0 0 500 120"
          className="w-full max-w-[340px] overflow-visible drop-shadow-sm"
        >
          <path
            id="textArcPath"
            d="M 30,100 A 280,180 0 0,1 470,100"
            fill="transparent"
          />
          <text
            fill={textLayer.color}
            fontFamily={textLayer.fontFamily}
            fontSize={textLayer.fontSize * 1.05}
            fontWeight={textLayer.fontWeight}
            fontStyle={textLayer.fontStyle}
            letterSpacing={textLayer.letterSpacing}
            stroke={textLayer.strokeColor || 'none'}
            strokeWidth={textLayer.strokeWidth || 0}
            style={{ textAnchor: 'middle' }}
          >
            <textPath href="#textArcPath" startOffset="50%" textAnchor="middle">
              {formattedText}
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  // Standard line typography rendering with fabric ink absorption
  return (
    <div
      className="w-full flex items-center justify-center select-none pointer-events-none transition-all duration-150 text-center px-2"
      style={{
        transform: `translate(${textLayer.offsetX}px, ${textLayer.offsetY}px) rotate(${textLayer.rotation}deg)`,
      }}
    >
      <span
        style={{
          fontFamily: textLayer.fontFamily,
          fontSize: `${textLayer.fontSize}px`,
          color: textLayer.color,
          letterSpacing: `${textLayer.letterSpacing}px`,
          lineHeight: textLayer.lineHeight,
          fontWeight: textLayer.fontWeight,
          fontStyle: textLayer.fontStyle,
          textShadow: getTextShadow(),
          wordBreak: 'break-word',
          maxWidth: '380px',
          display: 'inline-block',
          mixBlendMode: 'normal',
          filter: textLayer.textEffect === 'vintage_distressed' ? 'contrast(1.2) brightness(0.95)' : undefined,
        }}
      >
        {formattedText}
      </span>
    </div>
  );
};
