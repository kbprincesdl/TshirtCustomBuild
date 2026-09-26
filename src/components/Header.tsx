import React from 'react';
import { ShoppingBag, Sparkles, Building2, User } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'models' | 'b2b' | 'techpack' | 'orders';
  onSelectTab: (tab: 'studio' | 'models' | 'b2b' | 'techpack' | 'orders') => void;
  cartCount: number;
  onOpenCart: () => void;
  isB2BMode: boolean;
  onToggleB2B: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  isB2BMode,
  onToggleB2B,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onSelectTab('studio')}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors cursor-pointer"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          SHANKAR APPAREL
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectTab('studio')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'studio' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Design Studio
          </button>
          <button
            onClick={() => onSelectTab('models')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'models' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Model Runway
          </button>
          <button
            onClick={() => onSelectTab('b2b')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'b2b' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            B2B Wholesale
          </button>
          <button
            onClick={() => onSelectTab('techpack')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'techpack' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Tech Pack Specs
          </button>
          <button
            onClick={() => onSelectTab('orders')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'orders' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Track Order
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <button
            onClick={onToggleB2B}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isB2BMode
                ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300'
                : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
            }`}
            title="Toggle between B2B Bulk Manufacturing & B2C Direct Retail"
          >
            {isB2BMode ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span>{isB2BMode ? 'B2B Wholesale' : 'B2C Retail'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 border border-neutral-700 text-white rounded-lg hover:border-neutral-500 transition-colors flex items-center gap-2 whitespace-nowrap"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-neutral-950 font-bold rounded-full text-[11px] tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Sub-Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-800/80 px-2 py-2 text-xs font-medium text-neutral-400 bg-neutral-950/95 overflow-x-auto">
        <button
          onClick={() => onSelectTab('studio')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'studio' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Studio
        </button>
        <button
          onClick={() => onSelectTab('models')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'models' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Models
        </button>
        <button
          onClick={() => onSelectTab('b2b')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'b2b' ? 'text-amber-400 font-semibold' : ''}`}
        >
          B2B Bulk
        </button>
        <button
          onClick={() => onSelectTab('techpack')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'techpack' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Tech Pack
        </button>
        <button
          onClick={() => onSelectTab('orders')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'orders' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Orders
        </button>
      </div>
    </header>
  );
};
