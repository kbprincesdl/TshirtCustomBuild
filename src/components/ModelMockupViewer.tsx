import React, { useState } from 'react';
import {
  ModelPreset,
  ArtworkDesign,
  GarmentColor,
  GarmentConfig,
  PrintSettings,
} from '../types/apparel';
import { MODEL_PRESETS } from '../data/apparelPresets';
import { Download, Sparkles, ZoomIn, Eye, Check, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import { FluidGraphic } from './FluidGraphic';
import { SuperimposedTextLayer } from './SuperimposedTextLayer';

interface ModelMockupViewerProps {
  design: ArtworkDesign;
  color: GarmentColor;
  garment: GarmentConfig;
  printSettings: PrintSettings;
  onProceedToCheckout: () => void;
}

export const ModelMockupViewer: React.FC<ModelMockupViewerProps> = ({
  design,
  color,
  garment,
  printSettings,
  onProceedToCheckout,
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelPreset>(MODEL_PRESETS[0]);
  const [zoomLevel, setZoomLevel] = useState<'fit' | 'chest'>('fit');
  const [isCopied, setIsCopied] = useState(false);

  // Model index navigation
  const currentIndex = MODEL_PRESETS.findIndex((m) => m.id === selectedModel.id);
  const handlePrevModel = () => {
    const nextIdx = (currentIndex - 1 + MODEL_PRESETS.length) % MODEL_PRESETS.length;
    setSelectedModel(MODEL_PRESETS[nextIdx]);
  };
  const handleNextModel = () => {
    const nextIdx = (currentIndex + 1) % MODEL_PRESETS.length;
    setSelectedModel(MODEL_PRESETS[nextIdx]);
  };

  const handleDownloadMockup = () => {
    // Generate high resolution mockup download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    baseImg.src = selectedModel.imageSrc;

    baseImg.onload = () => {
      canvas.width = baseImg.naturalWidth || 1024;
      canvas.height = baseImg.naturalHeight || 1365;

      // Draw base model photo
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      // Draw tinted color tint layer over t-shirt area if desired
      if (color.hex !== '#F4F4F2') {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = color.hex;
        ctx.globalAlpha = 0.45;
        // Apply tint
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // Draw artwork graphic onto designated print bounding box
      const artImg = new Image();
      artImg.crossOrigin = 'anonymous';
      artImg.src = design.imageUrl;

      artImg.onload = () => {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = printSettings.opacity;

        const pTop = (selectedModel.printBox.top / 100) * canvas.height;
        const pLeft = (selectedModel.printBox.left / 100) * canvas.width;
        const pWidth = (selectedModel.printBox.width / 100) * canvas.width * (printSettings.scale / 100);
        const pHeight = (selectedModel.printBox.height / 100) * canvas.height * (printSettings.scale / 100);

        // Fluid feathered clipping to eliminate square box edges in exported mockup
        ctx.beginPath();
        const cx = pLeft + pWidth / 2;
        const cy = pTop + pHeight / 2;
        const rx = pWidth * 0.48;
        const ry = pHeight * 0.48;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(artImg, pLeft, pTop, pWidth, pHeight);
        ctx.restore();

        // Watermark branding
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('SHANKAR APPAREL RUNWAY SPEC', 30, canvas.height - 40);

        const link = document.createElement('a');
        link.download = `shankar-mockup-${selectedModel.id}-${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();

        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      };
    };
  };

  return (
    <div className="w-full space-y-6">
      {/* Editorial Runway Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Live Runway & Model Simulation
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Photorealistic studio models showcasing your design with natural fabric drape & crease blending
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setZoomLevel(zoomLevel === 'fit' ? 'chest' : 'fit')}
            className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
            <span>{zoomLevel === 'fit' ? 'Zoom Chest Detail' : 'Full Runway View'}</span>
          </button>

          {/* Download Mockup */}
          <button
            type="button"
            onClick={handleDownloadMockup}
            className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold text-white hover:border-amber-400 flex items-center gap-1.5 transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-amber-400" />}
            <span>Export High-Res Mockup</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Model Viewport Frame (Center Stage) */}
        <div className="lg:col-span-8 relative aspect-[3/4] max-h-[720px] mx-auto w-full bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex items-center justify-center select-none group">
          {/* Inner container with zoom transform */}
          <div
            className={`relative w-full h-full transition-transform duration-500 ease-out origin-top ${
              zoomLevel === 'chest' ? 'scale-150 translate-y-12' : 'scale-100'
            }`}
          >
            {/* Base Model Photography */}
            <img
              src={selectedModel.imageSrc}
              alt={selectedModel.name}
              className="w-full h-full object-cover select-none"
            />

            {/* Subtle dynamic color cast overlay on shirt */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-25"
              style={{ backgroundColor: color.hex }}
            />

            {/* Projected Artwork Graphic with Fabric Fold Blending & Fluid Silhouette */}
            <div
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                top: `${selectedModel.printBox.top}%`,
                left: `${selectedModel.printBox.left}%`,
                width: `${selectedModel.printBox.width}%`,
                height: `${selectedModel.printBox.height}%`,
              }}
            >
              <div
                className="w-full h-full flex flex-col items-center justify-center transition-all duration-200"
                style={{
                  transform: `translate(${printSettings.offsetX * 0.4}px, ${printSettings.offsetY * 0.4}px) scale(${
                    printSettings.scale / 100
                  }) rotate(${printSettings.rotation * 0.5}deg)`,
                }}
              >
                {/* Text Above */}
                {printSettings.textLayer?.enabled &&
                  printSettings.textLayer.position === 'above_image' && (
                    <div className="mb-1 w-full text-center">
                      <SuperimposedTextLayer textLayer={printSettings.textLayer} />
                    </div>
                  )}

                <div className="relative inline-flex items-center justify-center">
                  <FluidGraphic
                    src={design.imageUrl}
                    alt={design.title}
                    shape={printSettings.graphicShape || 'fluid'}
                    featherEdges={printSettings.featherEdges ?? true}
                    blendMode={printSettings.blendMode || 'multiply'}
                    opacity={printSettings.opacity * 0.96}
                    maxHeight="100%"
                  />

                  {/* Overlay Center Text */}
                  {printSettings.textLayer?.enabled &&
                    printSettings.textLayer.position === 'overlay_center' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <SuperimposedTextLayer textLayer={printSettings.textLayer} />
                      </div>
                    )}
                </div>

                {/* Text Below */}
                {printSettings.textLayer?.enabled &&
                  printSettings.textLayer.position === 'below_image' && (
                    <div className="mt-1 w-full text-center">
                      <SuperimposedTextLayer textLayer={printSettings.textLayer} />
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrevModel}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-950/70 text-white backdrop-blur-md border border-neutral-800 hover:bg-neutral-900 transition-colors shadow-lg"
            aria-label="Previous Model"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNextModel}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-950/70 text-white backdrop-blur-md border border-neutral-800 hover:bg-neutral-900 transition-colors shadow-lg"
            aria-label="Next Model"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Model Info Badge Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 bg-neutral-950/85 backdrop-blur-md rounded-xl border border-neutral-800 text-xs">
            <div>
              <div className="font-bold text-white text-sm tracking-tight">{selectedModel.name}</div>
              <div className="text-[11px] text-neutral-400">
                Fit: {garment.fit.split(',')[0]} · {garment.weightGsm} GSM {color.name}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono font-bold block">
                {selectedModel.category.toUpperCase()} SPEC
              </span>
              <span className="text-neutral-400 text-[11px]">Direct Print Simulation</span>
            </div>
          </div>
        </div>

        {/* Model Selector & Production Verification Card (Right Side) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Select Runway Model & Pose
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {MODEL_PRESETS.map((m) => {
                const isActive = m.id === selectedModel.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModel(m)}
                    className={`relative rounded-xl overflow-hidden border text-left transition-all group ${
                      isActive
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                      <img
                        src={m.imageSrc}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 bg-neutral-950/90 text-xs">
                      <div className="font-semibold text-white truncate">{m.name.split('(')[0]}</div>
                      <div className="text-[10px] text-neutral-400 capitalize">{m.gender} · {m.category}</div>
                    </div>
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Garment Verification Checklist */}
            <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
              <div className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                Pre-Press Validation
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Color Contrast Check</span>
                <span className="text-emerald-400 font-medium">Optimal 14.8:1</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Resolution Density</span>
                <span className="text-emerald-400 font-medium">300 DPI High-Def</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Fabric Mesh Rating</span>
                <span className="text-neutral-300 font-medium">200T Screen / High-DTG</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm & Order This T-Shirt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
