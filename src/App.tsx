import React, { useState, useEffect } from 'react';
import {
  GarmentConfig,
  GarmentColor,
  ArtworkDesign,
  PrintPlacement,
  PrintSettings,
  CartItem,
  OrderRecord,
  SizeBreakdown,
  CustomTextLayer,
} from './types/apparel';
import {
  GARMENTS,
  GARMENT_COLORS,
  SAMPLE_ARTWORKS,
  calculateCustomItemPrice,
} from './data/apparelPresets';
import { Header } from './components/Header';
import { GarmentCanvas } from './components/GarmentCanvas';
import { ModelMockupViewer } from './components/ModelMockupViewer';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { ExportModal } from './components/ExportModal';
import { TechPackView } from './components/TechPackView';
import { B2BWholesalePanel } from './components/B2BWholesalePanel';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrdersTrackerView } from './components/OrdersTrackerView';
import { TextEditorControl } from './components/TextEditorControl';
import {
  Sparkles,
  Layers,
  Palette,
  Eye,
  Download,
  Building2,
  ShoppingBag,
  Sliders,
  Check,
  RotateCw,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<'studio' | 'models' | 'b2b' | 'techpack' | 'orders'>('studio');
  const [isB2BMode, setIsB2BMode] = useState<boolean>(false);

  // Customization State
  const [currentGarment, setCurrentGarment] = useState<GarmentConfig>(GARMENTS[0]);
  const [currentColor, setCurrentColor] = useState<GarmentColor>(GARMENT_COLORS[0]);
  const [currentDesign, setCurrentDesign] = useState<ArtworkDesign>(SAMPLE_ARTWORKS[0]);
  const [currentPlacement, setCurrentPlacement] = useState<PrintPlacement>('front_center');
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    scale: 100,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    opacity: 0.95,
    blendMode: 'multiply',
    printMethod: 'dtg',
    graphicShape: 'fluid',
    featherEdges: true,
    removeBackground: true,
    textLayer: {
      enabled: true,
      text: 'SHANKAR RUNWAY',
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 28,
      color: '#FFFFFF',
      letterSpacing: 4,
      lineHeight: 1.2,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textTransform: 'uppercase',
      position: 'above_image',
      textEffect: 'none',
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
    },
  });

  // B2C Single Size & Qty State
  const [selectedB2CSize, setSelectedB2CSize] = useState<string>('L');
  const [b2cQuantity, setB2cQuantity] = useState<number>(1);
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Modals
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Order & Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initial sample customized cart item so user can immediately experience cart/checkout
    return [
      {
        id: 'sample_cart_1',
        design: SAMPLE_ARTWORKS[1],
        garment: GARMENTS[0],
        color: GARMENT_COLORS[0],
        placement: 'front_center',
        printSettings: {
          scale: 100,
          offsetX: 0,
          offsetY: 0,
          rotation: 0,
          opacity: 0.95,
          blendMode: 'multiply',
          printMethod: 'dtg',
          graphicShape: 'fluid',
          featherEdges: true,
          removeBackground: true,
        },
        isB2B: false,
        sizeBreakdown: { L: 1 },
        totalQuantity: 1,
        unitPrice: 28.0,
        totalPrice: 28.0,
      },
    ];
  });

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Automatically update view side if placement changes
  useEffect(() => {
    if (currentPlacement.startsWith('back_')) {
      setViewSide('back');
    } else {
      setViewSide('front');
    }
  }, [currentPlacement]);

  const handleUpdatePrintSettings = (updates: Partial<PrintSettings>) => {
    setPrintSettings((prev) => ({ ...prev, ...updates }));
  };

  // Add B2C Item to Cart
  const handleAddB2CToCart = () => {
    const pricing = calculateCustomItemPrice(
      currentGarment,
      b2cQuantity,
      printSettings.printMethod
    );

    const newItem: CartItem = {
      id: `cart_${Date.now()}`,
      design: currentDesign,
      garment: currentGarment,
      color: currentColor,
      placement: currentPlacement,
      printSettings: { ...printSettings },
      isB2B: false,
      sizeBreakdown: { [selectedB2CSize]: b2cQuantity },
      totalQuantity: b2cQuantity,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
    };

    setCartItems((prev) => [newItem, ...prev]);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2500);
  };

  // Add B2B Batch to Cart
  const handleAddB2BBatchToCart = (sizeBreakdown: SizeBreakdown, customNeckLabel: any) => {
    const totalQty = Object.values(sizeBreakdown).reduce((a, b) => a + (b || 0), 0);
    if (totalQty <= 0) return;

    const pricing = calculateCustomItemPrice(
      currentGarment,
      totalQty,
      printSettings.printMethod,
      customNeckLabel?.enabled
    );

    const newItem: CartItem = {
      id: `cart_b2b_${Date.now()}`,
      design: currentDesign,
      garment: currentGarment,
      color: currentColor,
      placement: currentPlacement,
      printSettings: { ...printSettings },
      isB2B: true,
      sizeBreakdown,
      totalQuantity: totalQty,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
      customNeckLabel,
    };

    setCartItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleOrderCompleted = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setConfirmedOrder(order);
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const b2cPricing = calculateCustomItemPrice(
    currentGarment,
    b2cQuantity,
    printSettings.printMethod
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={cartItems.reduce((acc, i) => acc + i.totalQuantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isB2BMode={isB2BMode}
        onToggleB2B={() => {
          const next = !isB2BMode;
          setIsB2BMode(next);
          if (next) setActiveTab('b2b');
          else setActiveTab('studio');
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* VIEW 1: Interactive Design Studio */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Stage: Canvas & Quick Access Toolbar (7 cols on desktop) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Garment Visualizer Canvas */}
              <GarmentCanvas
                garment={currentGarment}
                color={currentColor}
                design={currentDesign}
                placement={currentPlacement}
                printSettings={printSettings}
                onUpdateSettings={handleUpdatePrintSettings}
                viewSide={viewSide}
                onChangeViewSide={setViewSide}
              />

              {/* Floating Quick Action Stage Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAIGeneratorOpen(true)}
                  className="p-3 bg-neutral-900 border border-neutral-800 hover:border-amber-400 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all group shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>AI Image Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('models')}
                  className="p-3 bg-neutral-900 border border-neutral-800 hover:border-amber-400 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all group shadow-sm"
                >
                  <Eye className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>View on Models</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="p-3 bg-neutral-900 border border-neutral-800 hover:border-amber-400 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all group shadow-sm"
                >
                  <Download className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Export High-Res</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('techpack')}
                  className="p-3 bg-neutral-900 border border-neutral-800 hover:border-amber-400 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all group shadow-sm"
                >
                  <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Tech Pack Specs</span>
                </button>
              </div>
            </div>

            {/* Right Stage: Customization Controls Panel (5 cols on desktop) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Active Graphic Artwork */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Applied Artwork Design
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAIGeneratorOpen(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Change / Generate</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3.5 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div className="w-14 h-14 rounded-lg bg-neutral-900 p-1 flex items-center justify-center shrink-0 border border-neutral-800 overflow-hidden">
                    <img
                      src={currentDesign.imageUrl}
                      alt={currentDesign.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-white truncate">{currentDesign.title}</div>
                    <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{currentDesign.style}</div>
                    <div className="text-[10px] text-amber-400/90 font-mono mt-0.5 capitalize">
                      Engine: {currentDesign.engine} · Print-Ready
                    </div>
                  </div>
                </div>

                {/* Print Placement Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Print Placement
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'front_center', label: 'Center Front Chest' },
                      { id: 'front_chest_left', label: 'Left Chest Pocket' },
                      { id: 'back_oversized', label: 'Oversized Back' },
                      { id: 'back_center', label: 'Standard Back' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setCurrentPlacement(p.id as PrintPlacement)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          currentPlacement === p.id
                            ? 'bg-amber-400/10 border-amber-400 text-white font-semibold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Custom Text & Typography Customizer */}
              {printSettings.textLayer && (
                <TextEditorControl
                  textLayer={printSettings.textLayer}
                  onChange={(updated) =>
                    setPrintSettings((prev) => ({
                      ...prev,
                      textLayer: {
                        ...prev.textLayer!,
                        ...updated,
                      },
                    }))
                  }
                />
              )}

              {/* Card 3: Garment Model & Color Swatches */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Garment Silhouette & Color
                  </h3>
                </div>

                {/* Garment Selector */}
                <div className="space-y-2">
                  {GARMENTS.map((g) => {
                    const isSelected = currentGarment.id === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setCurrentGarment(g)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400'
                            : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{g.name}</div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            {g.weightGsm} GSM · {g.composition.split(',')[0]}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-semibold text-white">
                            ${g.basePrice.toFixed(2)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Color Swatches with Pantone references */}
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium">Selected Color:</span>
                    <span className="text-white font-semibold">
                      {currentColor.name} <span className="text-neutral-500 font-mono text-[10px]">({currentColor.pantone})</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {GARMENT_COLORS.map((col) => {
                      const isActive = currentColor.id === col.id;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setCurrentColor(col)}
                          title={`${col.name} (${col.pantone})`}
                          className={`aspect-square rounded-xl relative transition-all border ${
                            isActive
                              ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                              : 'border-neutral-800 hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                        >
                          {isActive && (
                            <span
                              className={`absolute inset-0 flex items-center justify-center font-bold text-xs ${
                                col.textColor === 'light' ? 'text-white' : 'text-neutral-950'
                              }`}
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card 3: Size, Pricing & Add to Cart Module */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Select Size & Run
                  </div>
                  <button
                    onClick={() => setActiveTab('b2b')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Need Bulk (10+ pcs)?</span>
                  </button>
                </div>

                {/* Sizing Chips */}
                <div className="flex flex-wrap gap-2">
                  {currentGarment.availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedB2CSize(sz)}
                      className={`min-w-10 py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                        selectedB2CSize === sz
                          ? 'bg-amber-400 text-neutral-950 border-amber-400 font-extrabold shadow-sm'
                          : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Quantity & Unit Pricing Row */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Qty:</span>
                    <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setB2cQuantity(Math.max(1, b2cQuantity - 1))}
                        className="px-2.5 py-1 text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-white">{b2cQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setB2cQuantity(b2cQuantity + 1)}
                        className="px-2.5 py-1 text-neutral-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-neutral-400 text-[11px] block">Unit Price: ${b2cPricing.unitPrice.toFixed(2)}</span>
                    <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                      ${b2cPricing.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <button
                  type="button"
                  onClick={handleAddB2CToCart}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  {isAddedToast ? (
                    <>
                      <Check className="w-4 h-4 text-neutral-950" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Custom T-Shirt to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Photorealistic Model Runway Mockups */}
        {activeTab === 'models' && (
          <ModelMockupViewer
            design={currentDesign}
            color={currentColor}
            garment={currentGarment}
            printSettings={printSettings}
            onProceedToCheckout={() => {
              handleAddB2CToCart();
              setIsCartOpen(true);
            }}
          />
        )}

        {/* VIEW 3: B2B Wholesale & Manufacturing Spec Panel */}
        {activeTab === 'b2b' && (
          <B2BWholesalePanel
            garment={currentGarment}
            color={currentColor}
            design={currentDesign}
            printSettings={printSettings}
            onUpdatePrintSettings={handleUpdatePrintSettings}
            onAddWholesaleBatchToCart={handleAddB2BBatchToCart}
          />
        )}

        {/* VIEW 4: Manufacturing Tech Pack Specs */}
        {activeTab === 'techpack' && (
          <TechPackView
            design={currentDesign}
            garment={currentGarment}
            color={currentColor}
            placement={currentPlacement}
            printSettings={printSettings}
            onBackToStudio={() => setActiveTab('studio')}
          />
        )}

        {/* VIEW 5: Order Lookup & Tracking */}
        {activeTab === 'orders' && (
          <OrdersTrackerView
            orders={orders}
            onSelectOrder={(ord) => setConfirmedOrder(ord)}
            onBackToStudio={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* AI Generator Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onSelectArtwork={(art) => {
          setCurrentDesign(art);
          setIsAIGeneratorOpen(false);
        }}
        currentDesign={currentDesign}
      />

      {/* High Resolution Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        design={currentDesign}
        garment={currentGarment}
        color={currentColor}
        placement={currentPlacement}
        printSettings={printSettings}
        onOpenTechPack={() => setActiveTab('techpack')}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={(id, qty) => {
          setCartItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, totalQuantity: qty } : i))
          );
        }}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Confirmed Order & Manufacturing Pipeline Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onNewDesign={() => {
            setConfirmedOrder(null);
            setActiveTab('studio');
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-8 px-6 mt-16 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-300" style={{ fontFamily: "'Syne', sans-serif" }}>
              SHANKAR APPAREL
            </span>
            <span>·</span>
            <span>Industrial T-Shirt Manufacturing & Custom Design Studio</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Combed Cotton</span>
            <span>·</span>
            <span>ISO 9001 Certified Factory</span>
            <span>·</span>
            <span>Direct-to-Garment & Plastisol Screen Print</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
