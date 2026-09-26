import React from 'react';
import { OrderRecord } from '../types/apparel';
import { CheckCircle2, Truck, Package, Clock, Printer, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: OrderRecord;
  onClose: () => void;
  onNewDesign: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onNewDesign,
}) => {
  const handlePrintReceipt = () => {
    window.print();
  };

  const steps = [
    { name: 'Order Confirmed', time: 'Just now', status: 'completed' },
    { name: 'Film RIP & Pre-Press', time: 'In progress', status: 'active' },
    { name: 'DTG / Screen Print Run', time: 'Queued', status: 'pending' },
    { name: 'QA & Seam Inspection', time: 'Pending', status: 'pending' },
    { name: 'Custom Tag & Polybag', time: 'Pending', status: 'pending' },
    { name: 'Dispatched & Shipping', time: `Est. ${order.estimatedDelivery}`, status: 'pending' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-neutral-900 via-emerald-950/40 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                PAYMENT CONFIRMED · ORDER {order.orderId}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Manufacturing Work Order Dispatched
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 text-sm">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Tracking Pipeline */}
          <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Live Factory Production Pipeline</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                Tracking #{order.trackingNumber} ({order.carrier})
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
              {steps.map((st, i) => (
                <div key={st.name} className="flex flex-col items-center text-center space-y-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border ${
                      st.status === 'completed'
                        ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                        : st.status === 'active'
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 animate-pulse'
                        : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                    }`}
                  >
                    {st.status === 'completed' ? '✓' : i + 1}
                  </div>
                  <div className="font-semibold text-white text-[10px] leading-tight">{st.name}</div>
                  <div className="text-[9px] text-neutral-400">{st.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
              <div className="font-bold text-white uppercase text-[11px]">Shipping Destination</div>
              <div className="text-neutral-300 space-y-0.5">
                <div className="font-semibold text-white">{order.shippingAddress.fullName}</div>
                {order.shippingAddress.companyName && <div>{order.shippingAddress.companyName}</div>}
                <div>{order.shippingAddress.addressLine1}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
                <div className="text-neutral-400 pt-1 text-[11px]">{order.shippingAddress.email} · {order.shippingAddress.phone}</div>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
              <div className="font-bold text-white uppercase text-[11px]">Fulfillment Summary</div>
              <div className="text-neutral-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Custom Items:</span>
                  <span className="font-mono text-white font-semibold">
                    {order.items.reduce((acc, i) => acc + i.totalQuantity, 0)} Units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Delivery Method:</span>
                  <span className="text-white">{order.shippingMethod.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment Reference:</span>
                  <span className="font-mono text-amber-400">{order.paymentReference}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-850 pt-1.5 font-bold text-sm text-white">
                  <span>Grand Total Paid:</span>
                  <span className="font-mono text-amber-400">${order.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items Preview */}
          <div className="space-y-2">
            <div className="font-bold text-white uppercase text-[11px]">Manufactured Line Items</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {order.items.map((it) => (
                <div key={it.id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center p-0.5 border border-neutral-800 shrink-0"
                      style={{ backgroundColor: it.color.hex }}
                    >
                      <img src={it.design.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{it.design.title}</div>
                      <div className="text-[11px] text-neutral-400">
                        {it.garment.name} · {it.color.name} · {it.placement}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">{it.totalQuantity} pcs</div>
                    <div className="text-[11px] font-mono text-amber-400">${it.totalPrice.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrintReceipt}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-300" />
            <span>Download Invoice / Work Order</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onNewDesign();
              }}
              className="px-5 py-2.5 bg-amber-400 text-neutral-950 hover:bg-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-400/20 w-full sm:w-auto justify-center"
            >
              <span>Design Another T-Shirt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
