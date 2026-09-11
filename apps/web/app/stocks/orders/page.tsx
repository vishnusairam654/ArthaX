'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Hourglass, 
  CheckCircle2, 
  RotateCw, 
  TrendingUp, 
  FileText, 
  Filter, 
  Download, 
  Search, 
  ShieldCheck, 
  Eye,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_BLOTTER_ORDERS, TradeBlotterOrder, LISTED_COMPANIES } from '@/components/stocks/StockData';
import { ExecutionInspectorModal } from '@/components/stocks/orders/ExecutionInspectorModal';

export default function OrdersAndBlotterPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'working' | 'cleared' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<TradeBlotterOrder | null>(SAMPLE_BLOTTER_ORDERS[0]);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  const filteredOrders = SAMPLE_BLOTTER_ORDERS.filter((ord) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'working') return ord.status === 'Working' || ord.status === 'Pending CLS';
    if (activeTab === 'cleared') return ord.status === 'DvP Cleared';
    if (activeTab === 'cancelled') return ord.status === 'Cancelled';
    return true;
  });

  const handleInspect = (order: TradeBlotterOrder) => {
    setSelectedOrder(order);
    setIsInspectorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. MACRO ORDER PERFORMANCE METRIC CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-[#173F35]/12 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#22695D]"></div>
          <div>
            <div className="flex items-center justify-between text-[#717975] text-xs uppercase font-semibold">
              <span>Orders Pending Execution</span>
              <div className="w-8 h-8 rounded-lg bg-[#DCEEE8] text-[#173F35] flex items-center justify-center">
                <Hourglass className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-[#173F35]">3</span>
              <span className="text-xs font-medium text-[#717975]">Working Orders</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#173F35]/10 flex items-center justify-between text-xs font-mono">
            <span className="text-[#717975]">Committed Collateral</span>
            <span className="font-bold text-[#173F35]">42,850.00 ARTH</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-[#173F35]/12 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]"></div>
          <div>
            <div className="flex items-center justify-between text-[#717975] text-xs uppercase font-semibold">
              <span>DvP Cleared (Today)</span>
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-[#173F35]">14</span>
              <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                100% FINALIZED
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#173F35]/10 flex items-center justify-between text-xs font-mono">
            <span className="text-[#717975]">Turnover Settled</span>
            <span className="font-bold text-[#1A1C18]">128,400.00 ARTH</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-[#173F35]/12 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F7468]"></div>
          <div>
            <div className="flex items-center justify-between text-[#717975] text-xs uppercase font-semibold">
              <span>CLS Settlement Queue</span>
              <div className="w-8 h-8 rounded-lg bg-[#2F7468]/15 text-[#2F7468] flex items-center justify-center">
                <RotateCw className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-[#173F35]">1 Batch</span>
              <span className="text-xs font-medium text-[#717975]">Hardware Enclave</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#173F35]/10 flex items-center justify-between text-xs font-mono">
            <span className="text-[#717975]">Next State Finality</span>
            <span className="font-bold text-[#2F7468]">&lt; 4.2s</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 border border-[#173F35]/12 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#A8742A]"></div>
          <div>
            <div className="flex items-center justify-between text-[#717975] text-xs uppercase font-semibold">
              <span>Realized Slippage</span>
              <div className="w-8 h-8 rounded-lg bg-[#A8742A]/15 text-[#A8742A] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-[#10B981]">-0.012%</span>
              <span className="text-xs font-semibold text-[#10B981]">Optimal</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#173F35]/10 flex items-center justify-between text-xs font-mono">
            <span className="text-[#717975]">Guild Tolerance</span>
            <span className="font-semibold text-[#1A1C18]">±0.050%</span>
          </div>
        </div>
      </section>

      {/* 2. ORDERS BLOTTER & EXECUTION INSPECTOR SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS: Order Blotter Table */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#173F35]/12 shadow-xs overflow-hidden">
            {/* Blotter Filter Ribbon */}
            <div className="p-4 border-b border-[#173F35]/10 bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-white border border-[#173F35]/10 rounded-xl">
                {[
                  { id: 'all', label: 'All Orders (18)' },
                  { id: 'working', label: 'Open / Working (3)' },
                  { id: 'cleared', label: 'DvP Cleared (14)' },
                  { id: 'cancelled', label: 'Cancelled (1)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-[#173F35] text-white shadow-xs'
                        : 'text-[#717975] hover:text-[#173F35]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Export & Range */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('Exporting blotter records to XBRL payload...')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#173F35]/15 hover:bg-[#FAF8F5] text-[#173F35] text-xs font-bold shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export XBRL</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#FAF8F5] text-[#717975] font-mono font-bold border-b border-[#173F35]/10 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Order ID &amp; Time</th>
                    <th className="py-3 px-4">Instrument</th>
                    <th className="py-3 px-4">Side / Type</th>
                    <th className="py-3 px-4 text-right">Fill / Qty</th>
                    <th className="py-3 px-4 text-right">Price (ARTH)</th>
                    <th className="py-3 px-4 text-right">Value (ARTH)</th>
                    <th className="py-3 px-4 text-center">Settlement</th>
                    <th className="py-3 px-4 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#173F35]/10 font-mono">
                  {filteredOrders.map((ord) => {
                    const comp = LISTED_COMPANIES[ord.symbol];
                    const isSelected = selectedOrder?.id === ord.id;
                    const fillPercent = Math.round((ord.qtyFilled / ord.qtyTotal) * 100);

                    return (
                      <tr
                        key={ord.id}
                        onClick={() => setSelectedOrder(ord)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#DCEEE8]/40 ring-1 ring-[#2F7468]/30' : 'hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-[#173F35]">{ord.id}</div>
                          <div className="text-[10px] text-[#717975]">{ord.timestamp}</div>
                        </td>

                        <td className="py-3.5 px-4 font-sans">
                          <div className="flex items-center gap-2">
                            {comp && (
                              <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-[#173F35]/10 flex items-center justify-center shrink-0">
                                <Image
                                  src={comp.logo}
                                  alt={ord.symbol}
                                  width={22}
                                  height={22}
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-[#1A1C18] leading-tight">{ord.companyName}</div>
                              <div className="text-[10px] font-mono text-[#717975]">{ord.symbol} • {ord.isin}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.side === 'BUY'
                                ? 'bg-[#287A55]/10 text-[#287A55] border border-[#287A55]/20'
                                : 'bg-[#B94A43]/10 text-[#B94A43] border border-[#B94A43]/20'
                            }`}>
                              {ord.side}
                            </span>
                            <span className="text-[#717975] text-[11px]">{ord.orderType}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="font-bold text-[#1A1C18]">{ord.qtyFilled} / {ord.qtyTotal}</div>
                          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden ml-auto mt-1">
                            <div
                              className="h-full bg-[#10B981]"
                              style={{ width: `${fillPercent}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-[#1A1C18]">
                          {ord.limitPrice.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-[#A8742A]">
                          {ord.executedValue.toLocaleString('en-US')}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            ord.status === 'DvP Cleared'
                              ? 'bg-[#10B981]/15 text-[#10B981]'
                              : ord.status === 'Working'
                              ? 'bg-[#A8742A]/15 text-[#A8742A]'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{ord.status}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-sans">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInspect(ord);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#DCEEE8] text-[#173F35] font-bold border border-[#173F35]/15 text-xs transition"
                          >
                            Audit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3.5 bg-[#FAF8F5] border-t border-[#173F35]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#717975]">
              <div className="flex items-center gap-2">
                <span>Displaying <strong>1–6</strong> of <strong>18</strong> records</span>
                <span>•</span>
                <span className="font-mono text-[#173F35] font-semibold">Audit Hash: SHA256-DVP-98a1</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="px-2 py-1 font-bold text-[#173F35]">Page 1 of 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: Persistent Execution Inspector Preview */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedOrder && (
            <div className="bg-white rounded-2xl p-5 border border-[#173F35]/12 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#173F35]/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#173F35]" />
                  <h3 className="font-serif font-bold text-base text-[#173F35]">Execution Inspector</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#DCEEE8] text-[#173F35] font-mono text-[10px] font-bold">
                  {selectedOrder.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-dashed border-[#173F35]/10">
                  <span className="text-[#717975]">Order ID:</span>
                  <span className="font-bold text-[#173F35]">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#173F35]/10">
                  <span className="text-[#717975]">Instrument:</span>
                  <span className="font-bold text-[#1A1C18]">{selectedOrder.companyName} ({selectedOrder.symbol})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#173F35]/10">
                  <span className="text-[#717975]">Execution Timestamp:</span>
                  <span className="text-[#1A1C18]">{selectedOrder.timestamp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#173F35]/10">
                  <span className="text-[#717975]">Settlement Rail:</span>
                  <span className="text-[#10B981] font-bold">{selectedOrder.settlementRail}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#173F35]/10">
                  <span className="text-[#717975]">Executed Consideration:</span>
                  <span className="font-bold text-[#A8742A] text-sm">{selectedOrder.executedValue.toLocaleString('en-US')} ARTH</span>
                </div>
              </div>

              {/* Cryptographic Proof Mini Block */}
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10 text-xs font-mono space-y-1">
                <span className="text-[10px] text-[#717975] uppercase">Merkle Proof Seal</span>
                <div className="text-[11px] text-[#2F7468] break-all font-semibold">
                  {selectedOrder.auditHash}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleInspect(selectedOrder)}
                className="w-full py-2.5 rounded-xl bg-[#173F35] hover:bg-[#0d2620] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <span>Open Full Audit Receipt Modal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Execution Inspector Modal */}
      <ExecutionInspectorModal
        isOpen={isInspectorOpen}
        order={selectedOrder}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
}
