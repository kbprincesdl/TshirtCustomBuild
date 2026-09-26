import React, { useState } from 'react';
import {
  GarmentConfig,
  GarmentColor,
  ArtworkDesign,
  SizeBreakdown,
  PrintSettings,
} from '../types/apparel';
import { calculateCustomItemPrice, getVolumeDiscountTier } from '../data/apparelPresets';
import { Building2, Package, Tag, ShieldCheck, FileSpreadsheet, Check } from 'lucide-react';

interface B2BWholesalePanelProps {
  garment: GarmentConfig;
  color: GarmentColor;
  design: ArtworkDesign;
  printSettings: PrintSettings;
  onUpdatePrintSettings: (settings: Partial<PrintSettings>) => void;
  onAddWholesaleBatchToCart: (sizeBreakdown: SizeBreakdown, customNeckLabel: any) => void;
}

export const B2BWholesalePanel: React.FC<B2BWholesalePanelProps> = ({
  garment,
  color,
  design,
  printSettings,
  onUpdatePrintSettings,
  onAddWholesaleBatchToCart,
}) => {
  const [sizes, setSizes] = useState<SizeBreakdown>({
    S: 10,
    M: 25,
    L: 35,
    XL: 20,
    '2XL': 10,
  });

  const [neckLabelEnabled, setNeckLabelEnabled] = useState(true);
  const [brandText, setBrandText] = useState('SHANKAR STUDIO');
  const [careText, setCareText] = useState('100% COMBED COTTON · COLD WASH');
  const [polybagEnabled, setPolybagEnabled] = useState(true);
  const [sampleProofRequested, setSampleProofRequested] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const totalQuantity = Object.values(sizes).reduce((acc, q) => acc + (q || 0), 0);
  const pricing = calculateCustomItemPrice(
    garment,
    totalQuantity,
    printSettings.printMethod,
    neckLabelEnabled
  );

  const handleSizeChange = (sizeKey: string, val: number) => {
    setSizes((prev) => ({
      ...prev,
      [sizeKey]: Math.max(0, val),
    }));
  };

  const handleApplyPresetCurve = (type: 'retail' | 'streetwear' | 'bulk100') => {
    if (type === 'retail') {
      setSizes({ S: 10, M: 25, L: 35, XL: 20, '2XL': 10 });
    } else if (type === 'streetwear') {
      setSizes({ M: 20, L: 50, XL: 40, '2XL': 20, '3XL': 10 });
    } else if (type === 'bulk100') {
      setSizes({ S: 15, M: 35, L: 35, XL: 15 });
    }
  };

  const handleAddToCart = () => {
    onAddWholesaleBatchToCart(sizes, {
      enabled: neckLabelEnabled,
      brandText,
      subText: careText,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Building2 className="w-4 h-4" />
            <span>Industrial Apparel Manufacturing</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            B2B Custom Production & Wholesale Order Engine
          </h2>
          <p className="text-xs text-neutral-300">
            Direct-from-factory volume pricing for clothing brands, streetwear labels, corporate merch, and events.
            Includes custom woven neck labels, Pantone color matching, and full tech pack validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Size Matrix & Production Specs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Size Breakdown Matrix */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Bulk Size Distribution Matrix
                </h3>
                <p className="text-xs text-neutral-400">Specify quantity per size (Units)</p>
              </div>

              {/* Preset Distribution Buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-500 text-[11px]">Curves:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPresetCurve('retail')}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs"
                >
                  Standard 100
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetCurve('streetwear')}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs"
                >
                  Streetwear 140
                </button>
              </div>
            </div>

            {/* Matrix Input Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((sizeKey) => {
                const isAvailable = garment.availableSizes.includes(sizeKey);
                return (
                  <div
                    key={sizeKey}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      isAvailable ? 'bg-neutral-950 border-neutral-800' : 'opacity-40 border-neutral-900'
                    }`}
                  >
                    <span className="text-xs font-bold text-neutral-300">{sizeKey}</span>
                    <input
                      type="number"
                      min="0"
                      disabled={!isAvailable}
                      value={sizes[sizeKey] || 0}
                      onChange={(e) => handleSizeChange(sizeKey, parseInt(e.target.value) || 0)}
                      className="w-full mt-2 text-center bg-neutral-900 border border-neutral-700 rounded-lg py-1.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400 font-semibold"
                    />
                    <span className="text-[10px] text-neutral-500 mt-1">units</span>
                  </div>
                );
              })}
            </div>

            {/* Total Units Summary */}
            <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
              <span className="text-neutral-400">Total Run Quantity:</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                  {totalQuantity}
                </span>
                <span className="text-neutral-400">Units</span>
                <span className="text-neutral-600">·</span>
                <span className="text-emerald-400 font-semibold">{pricing.tierName}</span>
              </div>
            </div>
          </div>

          {/* Manufacturing Print Techniques */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Industrial Print & Embellishment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'dtg',
                  name: 'Industrial DTG (Direct-to-Garment)',
                  desc: 'Full-spectrum unlimited colors, ultra-soft breathable hand feel.',
                  surcharge: 'Standard included',
                },
                {
                  id: 'screen_print',
                  name: 'Plastisol Screen Print (Spot Colors)',
                  desc: 'High opacity, maximum durability for 50+ wash cycles, bright ink deposit.',
                  surcharge: 'Best for 50+ units',
                },
                {
                  id: 'embroidery',
                  name: 'High-Density 3D Embroidery',
                  desc: 'Tactile thread cresting up to 15,000 stitches. Premium luxury finish.',
                  surcharge: '+$4.00 / unit',
                },
                {
                  id: 'puff_print',
                  name: '3D Puff Raised Screen Print',
                  desc: 'Volumetric expansion ink for vintage 90s streetwear pop.',
                  surcharge: '+$2.50 / unit',
                },
              ].map((method) => {
                const isSelected = printSettings.printMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => onUpdatePrintSettings({ printMethod: method.id as any })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{method.name}</span>
                      <span className="text-[11px] text-amber-400 font-medium">{method.surcharge}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">{method.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Private Label Branding & Custom Neck Tag */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Private Label & Custom Woven Neck Tags
                </h3>
                <p className="text-xs text-neutral-400">Replace factory labels with your proprietary brand tags</p>
              </div>
              <input
                type="checkbox"
                checked={neckLabelEnabled}
                onChange={(e) => setNeckLabelEnabled(e.target.checked)}
                className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
              />
            </div>

            {neckLabelEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs text-neutral-300 font-semibold block mb-1">
                    Brand Name / Wordmark
                  </label>
                  <input
                    type="text"
                    value={brandText}
                    onChange={(e) => setBrandText(e.target.value)}
                    placeholder="e.g. YOUR BRAND NAME"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white uppercase focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-300 font-semibold block mb-1">
                    Care & Origin Text
                  </label>
                  <input
                    type="text"
                    value={careText}
                    onChange={(e) => setCareText(e.target.value)}
                    placeholder="e.g. 100% COMBED COTTON · MADE IN INDIA"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white uppercase focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Packaging add-ons */}
            <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={polybagEnabled}
                  onChange={(e) => setPolybagEnabled(e.target.checked)}
                  className="accent-amber-400 rounded"
                />
                <span>Individual Clear Polybag + SKU Barcode Sticker (Included)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={sampleProofRequested}
                  onChange={(e) => setSampleProofRequested(e.target.checked)}
                  className="accent-amber-400 rounded"
                />
                <span>Request Physical Pre-Production Sample (+ $35 refundable on run)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Wholesale Pricing Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 sticky top-24">
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                B2B Pricing Matrix
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
                  ${pricing.unitPrice.toFixed(2)}
                </span>
                <span className="text-xs text-neutral-400">/ unit</span>
                {pricing.discountRate > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    Save {(pricing.discountRate * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>

            {/* Wholesale Tier Discount Milestones */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                Volume Discount Tiers
              </div>
              {[
                { qty: '1 - 9 pcs', rate: '0% off', price: `$${garment.basePrice.toFixed(2)}` },
                { qty: '10 - 49 pcs', rate: '15% off', price: `$${(garment.basePrice * 0.85).toFixed(2)}` },
                { qty: '50 - 249 pcs', rate: '35% off (MOQ)', price: `$${(garment.basePrice * 0.65).toFixed(2)}` },
                { qty: '250 - 999 pcs', rate: '48% off', price: `$${(garment.basePrice * 0.52).toFixed(2)}` },
                { qty: '1,000+ pcs', rate: '60% Factory Direct', price: `$${(garment.basePrice * 0.40).toFixed(2)}` },
              ].map((tier) => (
                <div key={tier.qty} className="flex items-center justify-between text-neutral-300 py-1 border-b border-neutral-800/60">
                  <span>{tier.qty}</span>
                  <span className="text-neutral-400">{tier.rate}</span>
                  <span className="font-mono font-medium text-white">{tier.price}</span>
                </div>
              ))}
            </div>

            {/* Order Total Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Total Quantity</span>
                <span className="font-mono text-white font-semibold">{totalQuantity} Units</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Unit Base Price</span>
                <span className="font-mono text-white">${pricing.unitPrice.toFixed(2)}</span>
              </div>
              {sampleProofRequested && (
                <div className="flex items-center justify-between text-amber-400">
                  <span>Pre-Production Proof</span>
                  <span className="font-mono">+$35.00</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                <span>Batch Total</span>
                <span className="font-mono text-amber-400 text-xl tabular-nums">
                  ${(pricing.totalPrice + (sampleProofRequested ? 35 : 0)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={totalQuantity < 1}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 disabled:opacity-50"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-neutral-950" />
                    <span>Added Batch to Cart!</span>
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    <span>Add {totalQuantity} Units to Cart</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-500">
                Net-30 Invoice & PO terms supported at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
