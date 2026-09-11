'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Lock, 
  Fingerprint, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface AtomicTradingDockProps {
  symbol: string;
  defaultPrice?: number;
  isMasked: boolean;
}

export const AtomicTradingDock: React.FC<AtomicTradingDockProps> = ({
  symbol,
  defaultPrice = 260.06,
  isMasked,
}) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState<number>(defaultPrice);
  const [quantity, setQuantity] = useState<number>(100);

  // Authorization Modal state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [financialPin, setFinancialPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tradeExecuted, setTradeExecuted] = useState<boolean>(false);

  const availableBalance = 38450.00;
  const netConsideration = Number((price * quantity).toFixed(2));

  const handleQuickAllocation = (percent: number) => {
    if (side === 'buy') {
      const budget = (availableBalance * percent) / 100;
      const calculatedQty = Math.max(1, Math.floor(budget / price));
      setQuantity(calculatedQty);
    } else {
      setQuantity(Math.floor(500 * (percent / 100)));
    }
  };

  const handleOpenAuth = () => {
    setPinError('');
    setTradeExecuted(false);
    setIsAuthOpen(true);
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (financialPin.length < 4) {
      setPinError('Financial Password must be at least 4 digits');
      return;
    }

    setIsSubmitting(true);
    setPinError('');

    setTimeout(() => {
      setIsSubmitting(false);
      setTradeExecuted(true);
    }, 1200);
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl border-2 border-[#1E3A5F]/20 shadow-xs p-5 flex flex-col gap-4 sticky top-36">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#74777F]/15">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#A8742A]" />
            <span className="font-serif text-base font-bold uppercase tracking-wider text-[#022448]">
              Atomic Trading Dock
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#287A55]/10 text-[#287A55] border border-[#287A55]/20">
            DvP Sub-12ms
          </span>
        </div>

        {/* Buy / Sell Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 text-xs font-bold font-sans">
          <button
            type="button"
            onClick={() => setSide('buy')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              side === 'buy'
                ? 'bg-[#287A55] text-white shadow-2xs'
                : 'text-[#5C574F] hover:text-[#121C28]'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>BUY {symbol.toUpperCase()}</span>
          </button>
          <button
            type="button"
            onClick={() => setSide('sell')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              side === 'sell'
                ? 'bg-[#B5482E] text-white shadow-2xs'
                : 'text-[#5C574F] hover:text-[#121C28]'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>SELL {symbol.toUpperCase()}</span>
          </button>
        </div>

        {/* Account Balance Strip */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#F8F9FF] rounded-xl border border-[#74777F]/10 text-xs">
          <div className="flex flex-col">
            <span className="text-[#5C574F] text-[10px] uppercase font-mono">NAVA Sovereign Payroll</span>
            <div className="text-[#121C28] font-bold">
              Available:{' '}
              <AnimatedMaskedValue
                value="38,450.00"
                isMasked={isMasked}
                maskString="••••••"
                className="font-mono text-xs font-bold text-[#022448]"
                suffix={<span className="ml-1 text-[10px] text-[#5C574F]">ARTH</span>}
              />
            </div>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#E5EFFF] text-[#1E3A5F]">
            #ARTH-9021-001
          </span>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          {/* Price */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#5C574F] font-sans">
              <span className="font-medium">Execution Limit Price</span>
              <span className="font-mono text-[11px]">Spot: {defaultPrice} ARTH</span>
            </div>
            <div className="flex items-center bg-[#F8F9FF] border border-[#74777F]/20 rounded-xl overflow-hidden p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setPrice((p) => Number(Math.max(1, p - 0.5).toFixed(2)))}
                className="w-8 h-8 rounded-lg bg-white text-[#121C28] hover:bg-[#E5EFFF] font-bold flex items-center justify-center text-sm border border-[#74777F]/10 cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                step="0.05"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-transparent border-none outline-hidden font-mono font-bold text-center text-sm text-[#121C28]"
              />
              <button
                type="button"
                onClick={() => setPrice((p) => Number((p + 0.5).toFixed(2)))}
                className="w-8 h-8 rounded-lg bg-white text-[#121C28] hover:bg-[#E5EFFF] font-bold flex items-center justify-center text-sm border border-[#74777F]/10 cursor-pointer"
              >
                +
              </button>
              <span className="pr-3 text-xs font-bold text-[#A8742A] font-mono">ARTH</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#5C574F] font-sans">
              <span className="font-medium">Contract Quantity</span>
              <span className="font-mono text-[11px]">Max Capacity: 147 Units</span>
            </div>
            <div className="flex items-center bg-[#F8F9FF] border border-[#74777F]/20 rounded-xl overflow-hidden p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 10))}
                className="w-8 h-8 rounded-lg bg-white text-[#121C28] hover:bg-[#E5EFFF] font-bold flex items-center justify-center text-sm border border-[#74777F]/10 cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full bg-transparent border-none outline-hidden font-mono font-bold text-center text-sm text-[#121C28]"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 10)}
                className="w-8 h-8 rounded-lg bg-white text-[#121C28] hover:bg-[#E5EFFF] font-bold flex items-center justify-center text-sm border border-[#74777F]/10 cursor-pointer"
              >
                +
              </button>
              <span className="pr-3 text-xs font-bold text-[#5C574F] font-mono">UNITS</span>
            </div>
          </div>

          {/* Quick Allocation Chips */}
          <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold font-mono">
            {[0.25, 0.50, 0.75, 1.0].map((pct, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAllocation(pct)}
                className="py-1 rounded-lg bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#5C574F] border border-[#74777F]/15 text-center transition-all cursor-pointer"
              >
                {pct === 1.0 ? 'MAX' : `${pct * 100}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Consideration Breakdown */}
        <div className="p-3.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex flex-col gap-1 text-xs">
          <div className="flex justify-between text-[#5C574F]">
            <span>Gross Consideration:</span>
            <span className="font-mono font-semibold text-[#121C28]">{netConsideration.toLocaleString('en-US')} ARTH</span>
          </div>
          <div className="flex justify-between text-[#5C574F]">
            <span>SETU DvP Clearing Fee:</span>
            <span className="font-mono text-[#287A55] font-bold">0.00 ARTH (Waived)</span>
          </div>
          <div className="flex justify-between text-[#5C574F]">
            <span>Target Finality:</span>
            <span className="font-mono text-[#287A55] font-semibold">&lt; 8.24 ms</span>
          </div>
          <div className="w-full h-px bg-[#74777F]/15 my-1" />
          <div className="flex justify-between text-[#121C28] font-bold text-sm">
            <span>Net Consideration:</span>
            <span className="font-mono text-[#022448] font-bold text-base">
              {netConsideration.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
            </span>
          </div>
        </div>

        {/* Security Enclave Status */}
        <div className="flex items-center justify-between px-1 text-xs text-[#5C574F]">
          <div className="flex items-center gap-1.5">
            <Fingerprint className="w-4 h-4 text-[#287A55]" />
            <span>Hardware Enclave Key</span>
          </div>
          <span className="text-[#287A55] font-bold flex items-center gap-1 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#287A55]"></span>
            VERIFIED
          </span>
        </div>

        {/* Large Execution Button */}
        <button
          type="button"
          onClick={handleOpenAuth}
          className={`w-full py-3.5 rounded-xl text-white font-serif text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            side === 'buy' ? 'bg-[#022448] hover:bg-[#1E3A5F]' : 'bg-[#B5482E] hover:bg-[#92331C]'
          }`}
        >
          <Lock className="w-4 h-4 text-[#A8742A]" />
          <span>
            EXECUTE ATOMIC {side.toUpperCase()} ({quantity} UNITS)
          </span>
        </button>

        {/* Merkle Root Seal */}
        <div className="text-center font-mono text-[10px] text-[#74777F]">
          Merkle Root: 0x8f2a...c041e • Block #28,102,510
        </div>
      </div>

      {/* Step-Up Financial Authorization Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#74777F]/20 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#74777F]/15 bg-[#F8F9FF]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1E3A5F]" />
                <h3 className="font-serif text-base text-[#022448] font-bold">
                  {tradeExecuted ? 'DvP Settlement Complete' : 'Authorize Atomic Trade'}
                </h3>
              </div>
              <button
                onClick={() => setIsAuthOpen(false)}
                className="p-1 rounded-full text-[#74777F] hover:bg-[#E5EFFF] hover:text-[#121C28]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!tradeExecuted ? (
                <form onSubmit={handleExecuteTrade} className="space-y-4">
                  <div className="p-3.5 bg-[#E5EFFF] rounded-xl border border-[#74777F]/20 text-xs space-y-1">
                    <div className="font-semibold text-[#121C28]">
                      Atomic Delivery-versus-Payment Execution
                    </div>
                    <p className="text-[#43474E] leading-relaxed">
                      You are committing <strong className="font-mono">{netConsideration.toLocaleString('en-US')} ARTH</strong> to {side} {quantity} units of {symbol.toUpperCase()}. Requires isolated Financial PIN.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider block">
                      Enter Financial Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#74777F] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        autoComplete="off"
                        value={financialPin}
                        onChange={(e) => setFinancialPin(e.target.value)}
                        placeholder="Enter Financial PIN"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#74777F]/30 bg-[#F8F9FF] font-mono text-sm tracking-widest focus:outline-hidden focus:border-[#1E3A5F]"
                        required
                      />
                    </div>
                    {pinError && (
                      <p className="text-xs text-[#B5482E] flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {pinError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAuthOpen(false)}
                      className="flex-1 py-2 bg-[#F2F3FA] text-[#5C574F] font-medium text-xs rounded-full border border-[#74777F]/20 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 bg-[#022448] text-white font-medium text-xs rounded-full shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Clearing via DvP...' : 'Confirm Execution'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#287A55] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-bold text-[#022448]">
                      Trade Settled via SETU Node
                    </h4>
                    <p className="font-sans text-xs text-[#5C574F]">
                      DvP finality confirmed in 6.4ms. Certificate added to depository vault.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAuthOpen(false)}
                    className="px-6 py-2 bg-[#022448] text-white font-medium text-xs rounded-full shadow-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
