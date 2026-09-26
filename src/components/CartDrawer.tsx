import React from 'react';
import { CartItem } from '../types/apparel';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Building2, User } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalUnits = items.reduce((acc, item) => acc + item.totalQuantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Your Custom Cart ({totalUnits} {totalUnits === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 text-sm rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="text-sm font-semibold text-white">Your cart is empty</div>
              <p className="text-xs text-neutral-400 max-w-xs">
                Create a customized T-shirt in the Design Studio or build a wholesale batch to get started.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div
                    className="w-16 h-18 rounded-lg shrink-0 flex items-center justify-center relative border border-neutral-800 p-1"
                    style={{ backgroundColor: item.color.hex }}
                  >
                    <img
                      src={item.design.imageUrl}
                      alt={item.design.title}
                      className="max-w-full max-h-full object-contain filter drop-shadow"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs font-bold text-white truncate">{item.design.title}</h3>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-500 hover:text-red-400 p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {item.garment.name.split('Tee')[0]} · {item.color.name}
                    </div>

                    {item.printSettings.textLayer?.enabled && item.printSettings.textLayer.text && (
                      <div className="text-[10px] text-amber-400 font-medium truncate mt-0.5">
                        Text: "{item.printSettings.textLayer.text}" ({item.printSettings.textLayer.fontFamily.split(',')[0]})
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">
                        {item.placement.replace('_', ' ').toUpperCase()}
                      </span>
                      {item.isB2B ? (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded font-semibold flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5" /> B2B Batch
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 bg-neutral-900 text-neutral-400 border border-neutral-800 rounded flex items-center gap-1">
                          <User className="w-2.5 h-2.5" /> Single Piece
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sizing Breakdown */}
                <div className="p-2 bg-neutral-900/60 rounded-lg text-[11px] text-neutral-300 flex flex-wrap gap-2">
                  <span className="text-neutral-500 font-semibold">Sizes:</span>
                  {Object.entries(item.sizeBreakdown).map(([sz, count]) => {
                    if (!count || count <= 0) return null;
                    return (
                      <span key={sz} className="font-mono">
                        {sz}: <strong className="text-white">{count}</strong>
                      </span>
                    );
                  })}
                </div>

                {/* Price & Quantity Summary */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-900 text-xs">
                  <div className="text-neutral-400 font-mono">
                    {item.totalQuantity} units @ ${item.unitPrice.toFixed(2)}
                  </div>
                  <div className="font-bold text-amber-400 font-mono text-sm tabular-nums">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-neutral-800 bg-neutral-950 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Total Quantity</span>
                <span className="font-mono text-white font-semibold">{totalUnits} Units</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping Estimate</span>
                <span className="text-emerald-400 font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
                <span>Estimated Subtotal</span>
                <span className="font-mono text-amber-400 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
            >
              <span>Proceed to Checkout & Shipping</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Direct factory dispatch · 100% Quality Guaranteed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
