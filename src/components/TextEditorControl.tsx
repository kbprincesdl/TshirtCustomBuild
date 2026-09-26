import React, { useState } from 'react';
import { CustomTextLayer } from '../types/apparel';
import {
  TYPOGRAPHY_FONTS,
  TEXT_COLOR_PALETTES,
  QUICK_TEXT_TEMPLATES,
} from '../data/typographyPresets';
import {
  Type,
  Bold,
  Italic,
  Sliders,
  Sparkles,
  Move,
  RotateCw,
  Palette,
  Eye,
  EyeOff,
  Trash2,
  Check,
} from 'lucide-react';

interface TextEditorControlProps {
  textLayer: CustomTextLayer;
  onChange: (updated: Partial<CustomTextLayer>) => void;
}

export const TextEditorControl: React.FC<TextEditorControlProps> = ({
  textLayer,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'font' | 'effects' | 'position'>('content');

  const handleApplyTemplate = (tpl: (typeof QUICK_TEXT_TEMPLATES)[0]) => {
    onChange({
      enabled: true,
      text: tpl.text,
      fontFamily: tpl.font,
      textEffect: tpl.effect,
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
      {/* Header with Enable / Disable toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Custom Typography & Text Layer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={textLayer.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
          </label>
          <span className="text-xs font-semibold text-neutral-300">
            {textLayer.enabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`py-1.5 font-medium rounded-lg transition-colors ${
            activeTab === 'content'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Text & Colors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('font')}
          className={`py-1.5 font-medium rounded-lg transition-colors ${
            activeTab === 'font'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Fonts (11)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('effects')}
          className={`py-1.5 font-medium rounded-lg transition-colors ${
            activeTab === 'effects'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Curved & Effects
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('position')}
          className={`py-1.5 font-medium rounded-lg transition-colors ${
            activeTab === 'position'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Layout & Pos
        </button>
      </div>

      {/* TAB 1: Content & Quick Colors */}
      {activeTab === 'content' && (
        <div className="space-y-4 text-xs">
          {/* Text Input */}
          <div className="space-y-1.5">
            <label className="text-neutral-400 font-medium flex items-center justify-between">
              <span>Type Custom Text / Slogan / Name:</span>
              <span className="text-[10px] text-neutral-500">{textLayer.text.length}/40</span>
            </label>
            <input
              type="text"
              value={textLayer.text}
              onChange={(e) => onChange({ text: e.target.value, enabled: true })}
              placeholder="e.g. TOKYO RUNWAY 2026..."
              maxLength={40}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-amber-400 focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* Quick Style Inspiration Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-neutral-500">Popular Quick Slogans:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TEXT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.text}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-neutral-300 hover:text-white rounded-lg text-[11px] transition-colors"
                >
                  {tpl.text}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Swatches */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">Text Print Color:</span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-neutral-700"
                  style={{ backgroundColor: textLayer.color }}
                />
                <span className="text-white font-mono text-[11px]">{textLayer.color}</span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 pt-1">
              {TEXT_COLOR_PALETTES.map((c) => {
                const isSelected = textLayer.color.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onChange({ color: c.hex, enabled: true })}
                    title={c.name}
                    className={`h-7 rounded-lg border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                        : 'border-neutral-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          c.hex === '#FFFFFF' || c.hex === '#F5EEDC' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Typography & Fonts */}
      {activeTab === 'font' && (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          <div className="text-[11px] text-neutral-400 font-medium">
            Select High-Impact Apparel Typeface:
          </div>
          <div className="space-y-1.5">
            {TYPOGRAPHY_FONTS.map((font) => {
              const isSelected = textLayer.fontFamily === font.family;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onChange({ fontFamily: font.family, enabled: true })}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div>
                    <div className="text-xs text-neutral-400">{font.name}</div>
                    <div
                      className="text-sm font-semibold text-white mt-0.5 tracking-wide"
                      style={{ fontFamily: font.family }}
                    >
                      {textLayer.text || font.previewText}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-bold flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Curved Text & Special Screenprint Effects */}
      {activeTab === 'effects' && (
        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="text-neutral-400 font-medium block">
              Typography Style & Distortion:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'Standard Flat Line' },
                { id: 'curved', label: 'Arch / Curved Arc' },
                { id: 'outline', label: 'Silkscreen Outline' },
                { id: 'shadow', label: '3D Drop Shadow' },
                { id: 'vintage_distressed', label: 'Vintage Distressed' },
                { id: 'neon_glow', label: 'Neon Glow Decal' },
              ].map((eff) => (
                <button
                  key={eff.id}
                  type="button"
                  onClick={() => onChange({ textEffect: eff.id as any, enabled: true })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    textLayer.textEffect === eff.id
                      ? 'bg-amber-400/10 border-amber-400 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {eff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Case & Formatting toggles */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={() =>
                onChange({
                  textTransform: textLayer.textTransform === 'uppercase' ? 'none' : 'uppercase',
                })
              }
              className={`p-2 rounded-lg border text-center font-bold ${
                textLayer.textTransform === 'uppercase'
                  ? 'bg-amber-400 text-neutral-950 border-amber-400'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300'
              }`}
            >
              ALL CAPS
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  fontWeight: textLayer.fontWeight === '900' ? 'normal' : '900',
                })
              }
              className={`p-2 rounded-lg border text-center font-bold ${
                textLayer.fontWeight === '900'
                  ? 'bg-amber-400 text-neutral-950 border-amber-400'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300'
              }`}
            >
              Heavy 900
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  fontStyle: textLayer.fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
              className={`p-2 rounded-lg border text-center italic font-bold ${
                textLayer.fontStyle === 'italic'
                  ? 'bg-amber-400 text-neutral-950 border-amber-400'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300'
              }`}
            >
              Italic
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Layout & Position */}
      {activeTab === 'position' && (
        <div className="space-y-4 text-xs">
          {/* Position relative to image */}
          <div className="space-y-1.5">
            <label className="text-neutral-400 font-medium">Text Position Relative to Graphic:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'above_image', label: 'Top (Header)' },
                { id: 'below_image', label: 'Bottom (Footer)' },
                { id: 'overlay_center', label: 'Center (Overlay)' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => onChange({ position: pos.id as any, enabled: true })}
                  className={`p-2 rounded-xl border text-center text-[11px] ${
                    textLayer.position === pos.id
                      ? 'bg-amber-400/10 border-amber-400 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Font Size & Letter Spacing */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Font Size</span>
                <span className="font-mono text-white font-semibold">{textLayer.fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="56"
                value={textLayer.fontSize}
                onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1 bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Letter Spacing (Kerning)</span>
                <span className="font-mono text-white font-semibold">{textLayer.letterSpacing}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                value={textLayer.letterSpacing}
                onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1 bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Text Vertical Offset</span>
                <span className="font-mono text-white font-semibold">{textLayer.offsetY}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={textLayer.offsetY}
                onChange={(e) => onChange({ offsetY: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1 bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
