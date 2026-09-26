import React, { useState } from 'react';
import { Sparkles, Wand2, Upload, Loader2, Image as ImageIcon, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { STYLE_PRESETS, PROCEDURAL_ICONS } from '../data/apparelPresets';
import { ArtworkDesign, StylePreset } from '../types/apparel';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArtwork: (artwork: ArtworkDesign) => void;
  currentDesign: ArtworkDesign;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectArtwork,
  currentDesign,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [engine, setEngine] = useState<'gemini' | 'free' | 'auto'>('auto');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedArtworks, setGeneratedArtworks] = useState<ArtworkDesign[]>([]);

  if (!isOpen) return null;

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setPrompt('Majestic cybernetic roaring tiger');
    }
    const targetPrompt = prompt.trim() || 'Majestic cybernetic roaring tiger';
    setIsEnhancing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: targetPrompt, style: selectedStyle.name }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err: any) {
      console.warn('Enhance prompt warning:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    const finalPrompt = prompt.trim() || 'Neon cybernetic tiger with Japanese calligraphy';
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          style: selectedStyle.promptSuffix,
          engine,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate image');
      }

      const newArtwork: ArtworkDesign = {
        id: `ai_${Date.now()}`,
        title: finalPrompt.slice(0, 30),
        prompt: finalPrompt,
        imageUrl: data.imageUrl,
        style: selectedStyle.name,
        engine: data.engine?.includes('gemini') ? 'gemini' : 'free',
        createdAt: Date.now(),
      };

      if (data.notice) {
        console.info(data.notice);
      }

      setGeneratedArtworks((prev) => [newArtwork, ...prev]);
      onSelectArtwork(newArtwork);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'Error communicating with generation engine');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const customArt: ArtworkDesign = {
          id: `upload_${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          prompt: 'Custom uploaded artwork',
          imageUrl: result,
          style: 'Custom Vector / Upload',
          engine: 'upload',
          createdAt: Date.now(),
        };
        setGeneratedArtworks((prev) => [customArt, ...prev]);
        onSelectArtwork(customArt);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectProcedural = (icon: typeof PROCEDURAL_ICONS[0]) => {
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(icon.svg)}`;
    const newArt: ArtworkDesign = {
      id: `svg_${icon.id}_${Date.now()}`,
      title: icon.name,
      prompt: icon.prompt,
      imageUrl: dataUrl,
      style: icon.category,
      engine: 'preset',
      createdAt: Date.now(),
    };
    onSelectArtwork(newArt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                AI Image Studio & Graphic Customizer
              </h2>
              <p className="text-xs text-neutral-400">
                Generate print-ready artwork with Gemini & Free Creative engines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white px-3 py-1 rounded-lg text-sm bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Engine Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
            <div>
              <span className="text-xs font-semibold text-neutral-200">Generation Engine</span>
              <p className="text-[11px] text-neutral-400">Choose between Google Gemini or Free High-Res creative API</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
              <button
                type="button"
                onClick={() => setEngine('auto')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  engine === 'auto' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Auto (Smart)
              </button>
              <button
                type="button"
                onClick={() => setEngine('gemini')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  engine === 'gemini' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Gemini API
              </button>
              <button
                type="button"
                onClick={() => setEngine('free')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  engine === 'free' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Free Engine
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Text-To-Image Prompt
              </label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={isEnhancing}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors disabled:opacity-50"
              >
                {isEnhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>AI Prompt Enhancer</span>
              </button>
            </div>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Roaring cybernetic samurai tiger with bold crimson brush strokes and neon kanji..."
                rows={3}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 text-sm transition-colors resize-none"
              />
            </div>

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-neutral-500">Inspire:</span>
              {[
                'Cybernetic Panther with kanji neon',
                'Vintage 90s Heavyweight Tour Tee',
                'Bauhaus Geometric Solar Compass',
                'Harajuku Streetwear Samurai Stencil',
                'Liquid Chrome Y2K Sigil Emblem',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setPrompt(chip)}
                  className="text-[11px] px-2.5 py-1 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-md transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Style Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Style Presets (Optimized for T-Shirt Print)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {STYLE_PRESETS.map((style) => {
                const isSelected = selectedStyle.id === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="text-xl mb-1">{style.sampleThumbnail}</div>
                    <div className="font-semibold text-xs text-white">{style.name}</div>
                    <div className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{style.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Silhouette Shape & Aspect Ratio row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-neutral-800">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-400 whitespace-nowrap">Cutout Silhouette:</span>
              <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[11px] font-semibold rounded-md">
                Fluid Contour (No Square Boxes)
              </span>
            </div>

            {/* Custom File Upload */}
            <label className="cursor-pointer px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors border border-neutral-700 w-full sm:w-auto justify-center">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Custom Artwork / Logo</span>
              <input
                type="file"
                accept="image/*,.svg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Curated SVG Vectors (Instant Fallback) */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Instant Production Vectors (Zero Latency)
              </span>
              <span className="text-[11px] text-neutral-500">100% Scalable & Ready to Print</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PROCEDURAL_ICONS.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => handleSelectProcedural(icon)}
                  className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-amber-400 transition-all flex items-center gap-3 text-left group"
                >
                  <div
                    className="w-12 h-12 bg-neutral-900 rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-neutral-800 group-hover:border-amber-400/50"
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400">{icon.name}</div>
                    <div className="text-[10px] text-neutral-400">{icon.category} · Instant Vector</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            Active: <span className="text-neutral-300 font-medium">{currentDesign.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-amber-400 text-neutral-950 hover:bg-amber-300 text-xs font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-amber-400/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Graphic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Artwork</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
