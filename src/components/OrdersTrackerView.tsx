import React, { useState } from 'react';
import { OrderRecord } from '../types/apparel';
import { Search, Package, Clock, CheckCircle2, Truck, ExternalLink, Printer } from 'lucide-react';

interface OrdersTrackerViewProps {
  orders: OrderRecord[];
  onSelectOrder: (order: OrderRecord) => void;
  onBackToStudio: () => void;
}

export const OrdersTrackerView: React.FC<OrdersTrackerViewProps> = ({
  orders,
  onSelectOrder,
  onBackToStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Order Lookup & Manufacturing Tracker
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Monitor real-time progress on factory screenprinting, quality assurance, and dispatched tracking
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/50 border border-neutral-800 rounded-2xl space-y-3">
          <Package className="w-10 h-10 text-neutral-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No active orders found</div>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Once you place an order in the Design Studio or B2B Wholesale panel, you can track factory fulfillment live here.
          </p>
          <button
            onClick={onBackToStudio}
            className="px-4 py-2 bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition-colors inline-block"
          >
            Create Your First Custom T-Shirt
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.orderId}
              className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 hover:border-neutral-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-400 text-sm">{ord.orderId}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-xs text-neutral-400">{ord.date}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-semibold uppercase">
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-400">Total: </span>
                  <span className="font-mono font-bold text-white text-sm tabular-nums">
                    ${ord.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items & Shipping row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 flex flex-wrap gap-3">
                  {ord.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center gap-2 p-2 bg-neutral-950 rounded-xl border border-neutral-800 text-xs"
                    >
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center p-0.5 shrink-0"
                        style={{ backgroundColor: it.color.hex }}
                      >
                        <img src={it.design.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <div className="font-semibold text-white truncate max-w-[140px]">{it.design.title}</div>
                        <div className="text-[10px] text-neutral-400">
                          {it.totalQuantity} pcs · {it.garment.name.split('Tee')[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sm:col-span-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onSelectOrder(ord)}
                    className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Tracking Timeline</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
