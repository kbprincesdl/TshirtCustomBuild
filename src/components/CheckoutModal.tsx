import React, { useState } from 'react';
import {
  CartItem,
  ShippingAddress,
  ShippingMethod,
  OrderRecord,
} from '../types/apparel';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (order: OrderRecord) => void;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Ground Delivery',
    duration: '4 - 7 business days',
    price: 4.99,
    description: 'Reliable ground courier with live tracking number',
  },
  {
    id: 'express',
    name: 'Express Priority Air',
    duration: '2 - 3 business days',
    price: 14.99,
    description: 'Fast air express service via DHL / FedEx',
  },
  {
    id: 'freight',
    name: 'Commercial Freight Logistics',
    duration: '5 - 8 business days',
    price: 35.00,
    description: 'Palletized bulk dispatch for B2B wholesale orders',
  },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  const [currentStep, setCurrentStep] = useState<'address' | 'shipping' | 'payment'>('address');
  const [isProcessing, setIsProcessing] = useState(false);

  // Address State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Alex Vance',
    companyName: 'Apex Creative Studio',
    email: 'alex@apexcreative.io',
    phone: '+1 (555) 234-5678',
    addressLine1: '742 Evergreen Terrace',
    addressLine2: 'Suite 400',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States',
  });

  // Shipping Method
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(SHIPPING_METHODS[0]);

  // Payment State
  const [paymentType, setPaymentType] = useState<'card' | 'apple_pay' | 'google_pay' | 'b2b_po'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [poNumber, setPoNumber] = useState('PO-2026-9041');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalUnits = items.reduce((acc, i) => acc + i.totalQuantity, 0);
  const effectiveShippingPrice = subtotal > 150 && selectedShipping.id === 'standard' ? 0 : selectedShipping.price;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const grandTotal = Math.round((subtotal + effectiveShippingPrice + tax) * 100) / 100;

  const handleNextFromAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.addressLine1 || !address.city || !address.postalCode) {
      alert('Please fill in all required shipping address fields.');
      return;
    }
    setCurrentStep('shipping');
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: OrderRecord = {
        orderId: `SHK-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        items: [...items],
        subtotal,
        shippingFee: effectiveShippingPrice,
        tax,
        discount: 0,
        grandTotal,
        shippingAddress: address,
        shippingMethod: selectedShipping,
        paymentMethod: paymentType,
        paymentReference: paymentType === 'b2b_po' ? poNumber : `TXN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        status: 'confirmed',
        trackingNumber: `1Z999999${Math.floor(10000000 + Math.random() * 90000000)}`,
        carrier: 'FedEx Express Freight',
        estimatedDelivery: 'Oct 3, 2026',
      };

      setIsProcessing(false);
      onOrderCompleted(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header with Step Tracker */}
        <div className="px-6 py-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-950/60">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Secure Checkout & Dispatch
            </h2>
            <p className="text-xs text-neutral-400">
              Complete shipping & billing information for factory fulfillment
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setCurrentStep('address')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                currentStep === 'address'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>1. Shipping</span>
            </button>
            <span className="text-neutral-600">→</span>
            <button
              onClick={() => setCurrentStep('shipping')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                currentStep === 'shipping'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>2. Delivery</span>
            </button>
            <span className="text-neutral-600">→</span>
            <button
              onClick={() => setCurrentStep('payment')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                currentStep === 'payment'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>3. Payment</span>
            </button>
          </div>

          <button onClick={onClose} className="hidden sm:block text-neutral-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          {/* Main Form Area (Left) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Address */}
            {currentStep === 'address' && (
              <form onSubmit={handleNextFromAddress} className="space-y-4">
                <div className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Customer & Shipping Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Company / Brand (Optional)</label>
                    <input
                      type="text"
                      value={address.companyName || ''}
                      onChange={(e) => setAddress({ ...address, companyName: e.target.value })}
                      placeholder="e.g. Acme Clothing Co."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Email Address (for tracking) *</label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Phone Number (Carrier updates) *</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="123 Industrial Way"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">State / Province *</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl flex items-center gap-2 transition-colors uppercase tracking-wider text-xs"
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Shipping Method */}
            {currentStep === 'shipping' && (
              <div className="space-y-4">
                <div className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Select Delivery Courier Method</span>
                </div>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => {
                    const isSelected = selectedShipping.id === method.id;
                    const isFree = subtotal > 150 && method.id === 'standard';
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedShipping(method)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400'
                            : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <span>{method.name}</span>
                            <span className="text-[10px] text-neutral-400 font-normal">({method.duration})</span>
                          </div>
                          <p className="text-[11px] text-neutral-400">{method.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-white">
                            {isFree ? <span className="text-emerald-400">FREE</span> : `$${method.price.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('address')}
                    className="px-4 py-2 text-neutral-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Address</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('payment')}
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl flex items-center gap-2 transition-colors uppercase tracking-wider text-xs"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <div className="space-y-4">
                <div className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Secure Payment Method</span>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setPaymentType('card')}
                    className={`py-2 text-center rounded-lg font-semibold transition-colors ${
                      paymentType === 'card' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('apple_pay')}
                    className={`py-2 text-center rounded-lg font-semibold transition-colors ${
                      paymentType === 'apple_pay' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    1-Click Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('b2b_po')}
                    className={`py-2 text-center rounded-lg font-semibold transition-colors ${
                      paymentType === 'b2b_po' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    B2B PO / Net-30
                  </button>
                </div>

                {paymentType === 'card' && (
                  <div className="space-y-3 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                    <div>
                      <label className="text-neutral-400 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-neutral-400 block mb-1">Expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 block mb-1">CVC Code</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentType === 'apple_pay' && (
                  <div className="p-6 bg-neutral-950 rounded-xl border border-neutral-800 text-center space-y-3">
                    <p className="text-neutral-300">
                      Express checkout with Apple Pay, Google Pay, or Link.
                    </p>
                    <div className="inline-block px-6 py-2.5 bg-white text-black font-bold rounded-xl text-xs">
                       Pay with Touch ID / Face ID
                    </div>
                  </div>
                )}

                {paymentType === 'b2b_po' && (
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                    <div>
                      <label className="text-neutral-400 block mb-1">Purchase Order (PO) Number</label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Invoice will be generated with Net-30 payment terms and dispatched along with factory bills of lading.
                    </p>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="px-4 py-2 text-neutral-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl flex items-center gap-2 transition-all uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authorizing & Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-neutral-950" />
                        <span>Authorize & Dispatch Order (${grandTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar (Right) */}
          <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4 h-fit">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-neutral-800 pb-2">
              Order Summary ({totalUnits} Units)
            </h3>

            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex gap-2.5 items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-8 h-8 rounded shrink-0 flex items-center justify-center p-0.5 border border-neutral-800"
                      style={{ backgroundColor: it.color.hex }}
                    >
                      <img src={it.design.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">{it.design.title}</div>
                      <div className="text-neutral-400 text-[10px]">{it.totalQuantity} pcs · {it.color.name}</div>
                    </div>
                  </div>
                  <div className="font-mono text-white font-medium shrink-0">
                    ${it.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-800 space-y-2 text-[11px]">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping ({selectedShipping.name.split(' ')[0]})</span>
                <span className="font-mono text-white">
                  {effectiveShippingPrice === 0 ? 'FREE' : `$${effectiveShippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Est. Sales Tax (8%)</span>
                <span className="font-mono text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                <span>Total Due</span>
                <span className="font-mono text-amber-400 text-base tabular-nums">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-900 rounded-lg text-[10px] text-neutral-400 space-y-1">
              <div className="font-semibold text-neutral-300">Shankar Quality Pledge:</div>
              <div>Direct automated RIP pre-press and factory inspection before dispatch.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
