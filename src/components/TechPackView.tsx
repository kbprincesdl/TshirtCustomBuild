import React from 'react';
import {
  GarmentConfig,
  GarmentColor,
  ArtworkDesign,
  PrintSettings,
  PrintPlacement,
} from '../types/apparel';
import { Printer, Download, CheckCircle, ArrowLeft } from 'lucide-react';

interface TechPackViewProps {
  design: ArtworkDesign;
  garment: GarmentConfig;
  color: GarmentColor;
  placement: PrintPlacement;
  printSettings: PrintSettings;
  onBackToStudio: () => void;
}

export const TechPackView: React.FC<TechPackViewProps> = ({
  design,
  garment,
  color,
  placement,
  printSettings,
  onBackToStudio,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getPlacementDistance = () => {
    switch (placement) {
      case 'front_chest_left':
        return 'Collar: 12.0 cm down · Center seam: 14.5 cm left';
      case 'back_oversized':
        return 'Collar: 6.0 cm down · Centered';
      case 'back_center':
        return 'Collar: 8.5 cm down · Centered';
      case 'front_center':
      default:
        return 'Collar: 7.5 cm down · Centered on chest';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBackToStudio}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Custom Studio</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF Tech Pack</span>
          </button>
        </div>
      </div>

      {/* Tech Pack Printable Document Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-8 text-neutral-200 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-800 pb-6 print:border-neutral-300">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold print:text-neutral-800">
              SHANKAR APPAREL MANUFACTURING LTD.
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1 print:text-black" style={{ fontFamily: "'Syne', sans-serif" }}>
              FACTORY SPECIFICATION TECH PACK
            </h1>
            <p className="text-xs text-neutral-400 print:text-neutral-600 mt-0.5">
              Production Job Order: #SHK-TP-{design.id.slice(-6).toUpperCase()} · Revision 1.4
            </p>
          </div>
          <div className="text-right text-xs space-y-1 font-mono">
            <div><span className="text-neutral-500">DATE:</span> {new Date().toLocaleDateString()}</div>
            <div><span className="text-neutral-500">STAGE:</span> PRE-PRESS APPROVED</div>
            <div><span className="text-neutral-500">PLANT:</span> UNIT 4 - DTG & SCREEN AUTOMATION</div>
          </div>
        </div>

        {/* Section 1: Garment & Fabric Specification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 print:bg-neutral-50 print:border-neutral-200 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider print:text-black">
              1. Garment & Fabric Architecture
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                <span className="text-neutral-400">Garment Style:</span>
                <span className="font-semibold text-white print:text-black">{garment.name}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                <span className="text-neutral-400">Fabric Weight:</span>
                <span className="font-semibold text-white print:text-black">{garment.weightGsm} GSM (High Density)</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                <span className="text-neutral-400">Composition:</span>
                <span className="font-semibold text-white print:text-black">{garment.composition}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                <span className="text-neutral-400">Color Reference:</span>
                <span className="font-semibold text-white print:text-black">{color.name} ({color.pantone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Fit Silhouette:</span>
                <span className="font-semibold text-white print:text-black">{garment.fit.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Print & Embellishment Directives */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 print:bg-neutral-50 print:border-neutral-200 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider print:text-black">
              2. Print Calibration & Coordinates
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                <span className="text-neutral-400">Embellishment Method:</span>
                <span className="font-semibold text-white uppercase print:text-black">{printSettings.printMethod}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                <span className="text-neutral-400">Design Title:</span>
                <span className="font-semibold text-white print:text-black">{design.title}</span>
              </div>
              {printSettings.textLayer?.enabled && (
                <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                  <span className="text-neutral-400">Superimposed Typography:</span>
                  <span className="font-semibold text-amber-400 print:text-black">
                    "{printSettings.textLayer.text}" ({printSettings.textLayer.fontFamily.split(',')[0]} · {printSettings.textLayer.color})
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                <span className="text-neutral-400">Placement Directive:</span>
                <span className="font-semibold text-white print:text-black">{getPlacementDistance()}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                <span className="text-neutral-400">Print Scale & Rotation:</span>
                <span className="font-mono text-white print:text-black">{printSettings.scale}% @ {printSettings.rotation}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">RIP Resolution:</span>
                <span className="font-mono text-emerald-400 print:text-emerald-700 font-semibold">1200 x 1200 DPI (Direct)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Artwork Placement Schematic */}
        <div className="p-6 bg-neutral-950 rounded-xl border border-neutral-800 print:bg-neutral-50 print:border-neutral-200 space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider print:text-black">
            3. Master Visual Proof & Platen Coordinates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Garment Mockup Thumbnail */}
            <div className="relative aspect-[4/5] max-h-[300px] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden flex items-center justify-center p-4">
              <div
                className="w-48 h-56 rounded-lg flex flex-col items-center justify-center relative shadow-lg p-2"
                style={{ backgroundColor: color.hex }}
              >
                {printSettings.textLayer?.enabled && printSettings.textLayer.position === 'above_image' && (
                  <div
                    className="text-[9px] font-bold text-center truncate max-w-full mb-1"
                    style={{
                      fontFamily: printSettings.textLayer.fontFamily,
                      color: printSettings.textLayer.color,
                      letterSpacing: '1px',
                    }}
                  >
                    {printSettings.textLayer.text}
                  </div>
                )}

                <div
                  className="w-24 h-24 flex items-center justify-center relative"
                  style={{
                    transform: `scale(${printSettings.scale / 100}) rotate(${printSettings.rotation}deg)`,
                    mixBlendMode: 'multiply',
                  }}
                >
                  <img src={design.imageUrl} alt={design.title} className="max-w-full max-h-full object-contain" />
                </div>

                {printSettings.textLayer?.enabled && printSettings.textLayer.position === 'below_image' && (
                  <div
                    className="text-[9px] font-bold text-center truncate max-w-full mt-1"
                    style={{
                      fontFamily: printSettings.textLayer.fontFamily,
                      color: printSettings.textLayer.color,
                      letterSpacing: '1px',
                    }}
                  >
                    {printSettings.textLayer.text}
                  </div>
                )}

                <div className="absolute top-2 left-2 text-[9px] font-mono text-white/70">
                  {garment.weightGsm}g
                </div>
              </div>
            </div>

            {/* Dimensional Tolerance Table */}
            <div className="space-y-3 text-xs">
              <div className="font-semibold text-white print:text-black">Factory Construction Measurements (Size L Baseline)</div>
              <table className="w-full text-left font-mono text-[11px] border border-neutral-800 print:border-neutral-300">
                <thead className="bg-neutral-900 print:bg-neutral-100 text-neutral-400">
                  <tr>
                    <th className="p-2">Point of Measure</th>
                    <th className="p-2">Spec (cm)</th>
                    <th className="p-2">Tolerance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 print:divide-neutral-200">
                  <tr>
                    <td className="p-2">A: Chest Width (Armpit to Armpit)</td>
                    <td className="p-2 font-bold text-white print:text-black">58.0 cm</td>
                    <td className="p-2 text-neutral-500">+/- 1.0 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2">B: Body Length (HSP to Hem)</td>
                    <td className="p-2 font-bold text-white print:text-black">74.0 cm</td>
                    <td className="p-2 text-neutral-500">+/- 1.5 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2">C: Sleeve Length (Overarm)</td>
                    <td className="p-2 font-bold text-white print:text-black">23.0 cm</td>
                    <td className="p-2 text-neutral-500">+/- 0.8 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2">D: Collar Rib Width</td>
                    <td className="p-2 font-bold text-white print:text-black">3.2 cm (1.25")</td>
                    <td className="p-2 text-neutral-500">+/- 0.2 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2">E: Print Offset from Collar Seam</td>
                    <td className="p-2 font-bold text-amber-400 print:text-neutral-900">7.5 cm (3.0")</td>
                    <td className="p-2 text-neutral-500">Exact</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 4: Bill of Materials (BOM) & Signoff */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 print:border-neutral-200 space-y-2">
            <div className="font-bold text-white uppercase print:text-black">Bill of Materials (BOM)</div>
            <ul className="space-y-1 text-neutral-400 print:text-neutral-600 list-disc list-inside">
              <li>Shell: 100% Combed Compact Ring-Spun Cotton, {garment.weightGsm} GSM</li>
              <li>Ribbing: 1x1 Heavy Spandex Rib Collar with Twin Needle Stitch</li>
              <li>Sewing Thread: Coats Epic 40/2 Poly-Wrapped High Strength</li>
              <li>Neck Label: Ultrasonic Cut Damask Woven Label (Center Back)</li>
              <li>Packaging: Polybag 30μm with Ventilation Hole & SKU Barcode</li>
            </ul>
          </div>

          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 print:border-neutral-200 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white uppercase print:text-black">QC Sign-Off & Verification</div>
              <p className="text-neutral-400 print:text-neutral-600 text-[11px]">
                Pre-production sample reviewed and certified compliant with AATCC wash fastness standard Level 4.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800 print:border-neutral-300 flex justify-between items-end text-[11px] font-mono text-neutral-400">
              <div>
                <div>QA MANAGER: S. SHANKAR</div>
                <div>FACTORY ID: SHK-IND-09</div>
              </div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>SPEC CONFIRMED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
