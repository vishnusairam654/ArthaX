'use client';

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Hash, 
  CheckCircle2, 
  ArrowRight,
  Download
} from 'lucide-react';
import { TradeBlotterOrder } from '../StockData';

interface ExecutionInspectorModalProps {
  isOpen: boolean;
  order: TradeBlotterOrder | null;
  onClose: () => void;
}

export const ExecutionInspectorModal: React.FC<ExecutionInspectorModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl border border-[#173F35]/20 max-w-xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#173F35]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#173F35] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#173F35]">
                  Order Execution Inspector
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#DCEEE8] text-[#173F35] font-mono text-[10px] font-bold">
                  {order.status}
                </span>
              </div>
              <p className="text-xs font-mono text-[#717975] mt-0.5">
                {order.id} • Bilateral Title Lock Verified
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Key Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#173F35]/10 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#717975] uppercase">Instrument</span>
            <div className="font-bold text-[#1A1C18]">{order.symbol} ({order.side})</div>
          </div>
          <div>
            <span className="text-[10px] text-[#717975] uppercase">Fill / Qty</span>
            <div className="font-bold text-[#1A1C18]">{order.qtyFilled} / {order.qtyTotal} Shs</div>
          </div>
          <div>
            <span className="text-[10px] text-[#717975] uppercase">Executed Price</span>
            <div className="font-bold text-[#1A1C18]">{order.limitPrice.toFixed(2)} ARTH</div>
          </div>
          <div>
            <span className="text-[10px] text-[#717975] uppercase">Total Value</span>
            <div className="font-bold text-[#A8742A]">{order.executedValue.toLocaleString('en-US')} ARTH</div>
          </div>
        </div>

        {/* Lifecycle Execution Track */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#173F35]">
            DvP Clearing Lifecycle Progression
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#FAF8F5] border border-[#173F35]/10">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <div className="flex-1 font-mono">
                <span className="font-bold text-[#1A1C18]">1. Continuous Auction Match</span>
                <span className="text-[#717975] ml-2 text-[11px]">{order.timestamp}</span>
              </div>
              <span className="text-[10px] font-mono text-[#2F7468] font-semibold">SUCCESS</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#FAF8F5] border border-[#173F35]/10">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <div className="flex-1 font-mono">
                <span className="font-bold text-[#1A1C18]">2. Bilateral Title Lock in Escrow</span>
                <span className="text-[#717975] ml-2 text-[11px]">SETU Depository Enclave</span>
              </div>
              <span className="text-[10px] font-mono text-[#2F7468] font-semibold">T+0 LOCKED</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#FAF8F5] border border-[#173F35]/10">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <div className="flex-1 font-mono">
                <span className="font-bold text-[#1A1C18]">3. Simultaneous Cash / Equity Delivery</span>
                <span className="text-[#717975] ml-2 text-[11px]">{order.settlementRail}</span>
              </div>
              <span className="text-[10px] font-mono text-[#10B981] font-bold">FINALIZED</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Proof Block */}
        <div className="bg-[#112822] text-[#DCEEE8] p-4 rounded-xl border border-[#1C3E34] text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#82AA9D]">
            <span>STATUTORY MERKLE PROOF</span>
            <span>BLOCK #28,102,510</span>
          </div>
          <div className="text-[#10B981] break-all">
            {order.auditHash}
          </div>
          <div className="text-[10px] text-[#82AA9D] pt-1">
            ISIN: {order.isin} • Certified under Central Bank Monetary Directive VII
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#173F35]/10">
          <button
            type="button"
            onClick={() => alert(`Receipt downloaded for ${order.id}`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#DCEEE8] text-[#173F35] border border-[#173F35]/20 text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download XBRL Audit Receipt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#173F35] hover:bg-[#0d2620] text-white text-xs font-bold transition cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
