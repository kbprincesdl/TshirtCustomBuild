import React, { useState } from 'react';
import {
  GarmentConfig,
  GarmentColor,
  ArtworkDesign,
  PrintSettings,
  PrintPlacement,
} from '../types/apparel';
import { Download, FileText, Image as ImageIcon, Code2, Check, Printer, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: ArtworkDesign;
  garment: GarmentConfig;
  color: GarmentColor;
  placement: PrintPlacement;
  printSettings: PrintSettings;
  onOpenTechPack: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  design,
  garment,
  color,
  placement,
  printSettings,
  onOpenTechPack,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export 1: High Resolution 300 DPI PNG (3000 x 3000 px Master File)
  const handleExportHighResPNG = () => {
    setDownloadingFormat('png');
    const canvas = document.createElement('canvas');
    const size = 3000;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = design.imageUrl;
    img.onload = () => {
      // Clear transparent background
      ctx.clearRect(0, 0, size, size);

      // Draw high resolution image centered with print settings applied
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((printSettings.rotation * Math.PI) / 180);
      const scaleFactor = (printSettings.scale / 100) * 0.8;
      const targetW = size * scaleFactor;
      const targetH = size * scaleFactor;

      // Organic fluid border clipping for print-ready PNG (no harsh square cut)
      ctx.beginPath();
      ctx.ellipse(0, 0, (targetW / 2) * 0.95, (targetH / 2) * 0.95, 0, 0, Math.PI * 2);
      ctx.clip();

      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      ctx.restore();

      // Superimpose Custom Text on High-Res 300 DPI Export if enabled
      if (printSettings.textLayer?.enabled && printSettings.textLayer.text.trim()) {
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((printSettings.rotation * Math.PI) / 180);

        const tl = printSettings.textLayer;
        const fontScale = (size / 500) * 1.5;
        const exportFontSize = tl.fontSize * fontScale;
        ctx.font = `${tl.fontStyle === 'italic' ? 'italic ' : ''}${tl.fontWeight === '900' ? '900 ' : 'bold '}${exportFontSize}px ${tl.fontFamily}`;
        ctx.fillStyle = tl.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let textY = 0;
        if (tl.position === 'above_image') {
          textY = -targetH / 2 - exportFontSize * 0.8;
        } else if (tl.position === 'below_image') {
          textY = targetH / 2 + exportFontSize * 0.8;
        }

        const renderText = tl.textTransform === 'uppercase' ? tl.text.toUpperCase() : tl.text;
        ctx.fillText(renderText, tl.offsetX * fontScale, textY + tl.offsetY * fontScale);
        ctx.restore();
      }

      const link = document.createElement('a');
      link.download = `shankar-print-ready-300dpi-${design.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloadingFormat(null);
    };
  };

  // Export 2: Vector SVG with registration marks
  const handleExportSVG = () => {
    setDownloadingFormat('svg');
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <metadata>
    <shankar:spec 
      garment="${garment.name}"
      weight="${garment.weightGsm}gsm"
      color="${color.name}"
      pantone="${color.pantone}"
      placement="${placement}"
      printMethod="${printSettings.printMethod}"
    />
  </metadata>
  <!-- Registration Marks -->
  <circle cx="50" cy="50" r="20" fill="none" stroke="#000" stroke-width="2"/>
  <line x1="50" y1="20" x2="50" y2="80" stroke="#000" stroke-width="2"/>
  <line x1="20" y1="50" x2="80" y2="50" stroke="#000" stroke-width="2"/>
  
  <circle cx="950" cy="50" r="20" fill="none" stroke="#000" stroke-width="2"/>
  <line x1="950" y1="20" x2="950" y2="80" stroke="#000" stroke-width="2"/>
  <line x1="920" y1="50" x2="980" y2="50" stroke="#000" stroke-width="2"/>

  <!-- Graphic Vector Image Node -->
  <g transform="translate(500, 500) rotate(${printSettings.rotation}) scale(${printSettings.scale / 100}) translate(-400, -400)">
    <image href="${design.imageUrl}" width="800" height="800"/>
  </g>

  <!-- Technical Spec Footer -->
  <text x="50" y="960" font-family="monospace" font-size="16" fill="#444">
    SHANKAR APPAREL INDUSTRIAL EXPORT // 300 DPI EQUIV // COLOR: ${color.pantone} // METHOD: ${printSettings.printMethod.toUpperCase()}
  </text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `shankar-vector-artwork-${Date.now()}.svg`;
    link.href = url;
    link.click();
    setDownloadingFormat(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Export High-Resolution Production Files
            </h2>
            <p className="text-xs text-neutral-400">
              Select desired manufacturing & distribution file formats
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white px-3 py-1 rounded-lg text-sm bg-neutral-800 hover:bg-neutral-700"
          >
            ✕
          </button>
        </div>

        {/* Formats Grid */}
        <div className="p-6 space-y-4">
          {/* Format 1: 300 DPI PNG */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between hover:border-amber-400/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Master Print-Ready PNG (300 DPI)</div>
                <div className="text-xs text-neutral-400">
                  Transparent background · 3000 × 3000 px · Direct-to-Garment RIP compatible
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportHighResPNG}
              disabled={downloadingFormat === 'png'}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{downloadingFormat === 'png' ? 'Rendering...' : 'Download PNG'}</span>
            </button>
          </div>

          {/* Format 2: Vector SVG */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between hover:border-amber-400/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Production Vector SVG with Reg Marks</div>
                <div className="text-xs text-neutral-400">
                  Scalable vector file with registration crosses and embedded Pantone metadata
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportSVG}
              disabled={downloadingFormat === 'svg'}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>{downloadingFormat === 'svg' ? 'Generating...' : 'Download SVG'}</span>
            </button>
          </div>

          {/* Format 3: Factory Tech Pack */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between hover:border-amber-400/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Full Manufacturing Tech Pack (Spec Sheet)</div>
                <div className="text-xs text-neutral-400">
                  Complete technical dossier with seam coordinates, GSM, dye lot, and BOM
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTechPack();
              }}
              className="px-4 py-2 bg-amber-400 text-neutral-950 hover:bg-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-950" />
              <span>View & Print Tech Pack</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/60 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
