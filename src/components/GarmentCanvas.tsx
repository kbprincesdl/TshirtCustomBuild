import React, { useRef, useState } from 'react';
import {
  GarmentConfig,
  GarmentColor,
  ArtworkDesign,
  PrintPlacement,
  PrintSettings,
  GraphicShape,
} from '../types/apparel';
import { RotateCw, ZoomIn, ZoomOut, Move, Grid, RefreshCw, Wand2, Sparkles, Type } from 'lucide-react';
import { FluidGraphic } from './FluidGraphic';
import { SuperimposedTextLayer } from './SuperimposedTextLayer';

interface GarmentCanvasProps {
  garment: GarmentConfig;
  color: GarmentColor;
  design: ArtworkDesign;
  placement: PrintPlacement;
  printSettings: PrintSettings;
  onUpdateSettings: (settings: Partial<PrintSettings>) => void;
  viewSide: 'front' | 'back';
  onChangeViewSide: (side: 'front' | 'back') => void;
}

export const GarmentCanvas: React.FC<GarmentCanvasProps> = ({
  garment,
  color,
  design,
  placement,
  printSettings,
  onUpdateSettings,
  viewSide,
  onChangeViewSide,
}) => {
  const [showGuides, setShowGuides] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startOffsetX: number; startOffsetY: number }>({
    x: 0,
    y: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  // Calculate placement positioning presets
  const getPlacementCoordinates = () => {
    switch (placement) {
      case 'front_chest_left':
        return { top: '24%', left: '60%', maxW: '24%', maxH: '20%' };
      case 'back_oversized':
        return { top: '24%', left: '50%', maxW: '58%', maxH: '56%' };
      case 'back_center':
        return { top: '26%', left: '50%', maxW: '44%', maxH: '44%' };
      case 'front_center':
      default:
        return { top: '30%', left: '50%', maxW: '46%', maxH: '48%' };
    }
  };

  const coords = getPlacementCoordinates();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startOffsetX: printSettings.offsetX,
      startOffsetY: printSettings.offsetY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.2;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.2;
    onUpdateSettings({
      offsetX: Math.max(-50, Math.min(50, dragStartRef.current.startOffsetX + deltaX)),
      offsetY: Math.max(-50, Math.min(50, dragStartRef.current.startOffsetY + deltaY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full aspect-[4/5] sm:aspect-square max-h-[620px] bg-neutral-900/60 rounded-2xl border border-neutral-800 flex items-center justify-center overflow-hidden select-none p-4 sm:p-6"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        {/* Front / Back Toggle */}
        <div className="flex items-center p-1 bg-neutral-950/80 backdrop-blur-md rounded-xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => onChangeViewSide('front')}
            className={`px-3 py-1 font-medium rounded-lg transition-colors ${
              viewSide === 'front'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Front View
          </button>
          <button
            type="button"
            onClick={() => onChangeViewSide('back')}
            className={`px-3 py-1 font-medium rounded-lg transition-colors ${
              viewSide === 'back'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Back View
          </button>
        </div>

        {/* Guides Toggle */}
        <button
          type="button"
          onClick={() => setShowGuides(!showGuides)}
          className={`p-2 rounded-xl border transition-colors ${
            showGuides
              ? 'bg-amber-400/10 border-amber-400 text-amber-400'
              : 'bg-neutral-950/80 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
          title="Toggle Print Bounds & Platen Grid"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Fabric GSM & Color Specs Tag */}
      <div className="absolute top-4 right-4 z-20 text-right bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-800">
        <div className="text-[11px] font-bold text-white uppercase tracking-wider">{garment.weightGsm} GSM</div>
        <div className="text-[10px] text-neutral-400">{color.pantone}</div>
      </div>

      {/* SVG T-Shirt Silhouette with Realistic Shading */}
      <div className="relative w-full h-full max-w-[500px] flex items-center justify-center">
        <svg
          viewBox="0 0 600 680"
          className="w-full h-full drop-shadow-2xl transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fabric texture subtle gradient */}
            <radialGradient id="tshirtHighlight" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={color.textColor === 'light' ? 0.08 : 0.03} />
              <stop offset="60%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity={color.textColor === 'light' ? 0.35 : 0.12} />
            </radialGradient>

            {/* Crease shadow lines */}
            <linearGradient id="creaseShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* T-Shirt Main Body Outline */}
          <path
            d="M 220 50 
               Q 300 95 380 50 
               L 490 100 
               L 550 200 
               L 480 240 
               L 445 195 
               L 455 600 
               Q 455 615 440 615 
               L 160 615 
               Q 145 615 145 600 
               L 155 195 
               L 120 240 
               L 50 200 
               L 110 100 
               Z"
            fill={color.hex}
            stroke={color.textColor === 'light' ? '#3f3f46' : '#d4d4d8'}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Collar Details */}
          {viewSide === 'front' ? (
            <>
              {/* Front Neck Scoop & Ribbing */}
              <path
                d="M 220 50 Q 300 135 380 50"
                fill="none"
                stroke={color.textColor === 'light' ? '#18181b' : '#a1a1aa'}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 220 50 Q 300 135 380 50"
                fill="none"
                stroke={color.textColor === 'light' ? '#52525b' : '#e4e4e7'}
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <path
                d="M 235 60 Q 300 120 365 60"
                fill="none"
                stroke={color.textColor === 'light' ? '#09090b' : '#71717a'}
                strokeWidth="2"
              />
            </>
          ) : (
            <>
              {/* Back Collar High Cut */}
              <path
                d="M 220 50 Q 300 70 380 50"
                fill="none"
                stroke={color.textColor === 'light' ? '#18181b' : '#a1a1aa'}
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Woven Neck Label Simulation (Back View) */}
              <rect
                x="280"
                y="65"
                width="40"
                height="32"
                rx="3"
                fill="#ffffff"
                stroke="#d4d4d8"
                strokeWidth="1"
              />
              <text x="300" y="78" fontSize="6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#000000">
                SHANKAR
              </text>
              <text x="300" y="86" fontSize="5" fontFamily="monospace" textAnchor="middle" fill="#52525b">
                100% COTTON · L
              </text>
            </>
          )}

          {/* Sleeve Stitch Lines */}
          <path d="M 445 195 L 485 180" stroke={color.textColor === 'light' ? '#09090b' : '#a1a1aa'} strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 155 195 L 115 180" stroke={color.textColor === 'light' ? '#09090b' : '#a1a1aa'} strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Hem Stitch Bottom */}
          <path d="M 150 595 L 450 595" stroke={color.textColor === 'light' ? '#09090b' : '#a1a1aa'} strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Shading Overlay for 3D Volume */}
          <path
            d="M 220 50 Q 300 95 380 50 L 490 100 L 550 200 L 480 240 L 445 195 L 455 600 Q 455 615 440 615 L 160 615 Q 145 615 145 600 L 155 195 L 120 240 L 50 200 L 110 100 Z"
            fill="url(#tshirtHighlight)"
          />
        </svg>

        {/* Print Printable Area Overlay Container */}
        <div
          className={`absolute flex items-center justify-center pointer-events-none transition-all duration-150 ${
            showGuides ? 'border-2 border-dashed border-amber-400/80 bg-amber-400/5' : ''
          }`}
          style={{
            top: coords.top,
            left: coords.left,
            width: coords.maxW,
            height: coords.maxH,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {showGuides && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-950 font-bold px-2 py-0.5 rounded text-[10px] whitespace-nowrap shadow">
              DTG Platen: 35cm x 45cm (14" x 18")
            </div>
          )}

          {/* Rendered Artwork Graphic on Fabric with Fluid Silhouette & Feathering & Superimposed Text */}
          <div
            className="cursor-move pointer-events-auto transition-transform flex flex-col items-center justify-center"
            onMouseDown={handleMouseDown}
            style={{
              transform: `translate(${printSettings.offsetX}px, ${printSettings.offsetY}px) scale(${
                printSettings.scale / 100
              }) rotate(${printSettings.rotation}deg)`,
            }}
          >
            {/* Text Layer Positioned ABOVE Image */}
            {printSettings.textLayer?.enabled &&
              printSettings.textLayer.position === 'above_image' && (
                <div className="mb-2 w-full">
                  <SuperimposedTextLayer textLayer={printSettings.textLayer} />
                </div>
              )}

            {/* Graphic Artwork with Optional Overlay Center Text */}
            <div className="relative inline-flex items-center justify-center">
              <FluidGraphic
                src={design.imageUrl}
                alt={design.title}
                shape={printSettings.graphicShape || 'fluid'}
                featherEdges={printSettings.featherEdges ?? true}
                blendMode={printSettings.blendMode || 'multiply'}
                opacity={printSettings.opacity}
                maxHeight="260px"
              />

              {/* Text Layer Positioned in Center OVERLAY */}
              {printSettings.textLayer?.enabled &&
                printSettings.textLayer.position === 'overlay_center' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <SuperimposedTextLayer textLayer={printSettings.textLayer} />
                  </div>
                )}
            </div>

            {/* Text Layer Positioned BELOW Image */}
            {printSettings.textLayer?.enabled &&
              printSettings.textLayer.position === 'below_image' && (
                <div className="mt-2 w-full">
                  <SuperimposedTextLayer textLayer={printSettings.textLayer} />
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Bottom Placement & Scale Quick Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-800 text-xs">
        {/* Silhouette & Edge Contour Mode */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider hidden sm:inline">
            Fit:
          </span>
          {[
            { id: 'fluid', label: 'Fluid Contour' },
            { id: 'organic_soft', label: 'Melted Fade' },
            { id: 'natural', label: 'Feathered' },
            { id: 'die_cut', label: 'Faceted Crest' },
            { id: 'grunge_weathered', label: 'Grunge' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onUpdateSettings({ graphicShape: mode.id as GraphicShape })}
              className={`px-2 py-1 text-[11px] rounded-md font-medium transition-all ${
                printSettings.graphicShape === mode.id
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Quick Sliders */}
        <div className="flex items-center gap-4">
          {/* Scale */}
          <div className="flex items-center gap-1.5">
            <ZoomOut className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="range"
              min="50"
              max="180"
              value={printSettings.scale}
              onChange={(e) => onUpdateSettings({ scale: Number(e.target.value) })}
              className="w-16 sm:w-20 accent-amber-400 h-1 bg-neutral-700 rounded-lg cursor-pointer"
            />
            <ZoomIn className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px] text-neutral-400 font-mono w-8">{printSettings.scale}%</span>
          </div>

          {/* Reset Position */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ offsetX: 0, offsetY: 0, scale: 100, rotation: 0 })}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title="Reset Positioning"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
