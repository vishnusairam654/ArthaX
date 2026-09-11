'use client';

import React, { useState } from 'react';
import { X, Layers, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LISTED_COMPANIES } from '../StockData';

interface CreateBasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (basketName: string) => void;
}

export const CreateBasketModal: React.FC<CreateBasketModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [basketName, setBasketName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['NILA', 'ARKA', 'VEDA']);
  const [minInvestment, setMinInvestment] = useState<number>(5000);

  if (!isOpen) return null;

  const handleToggleSymbol = (sym: string) => {
    if (selectedSymbols.includes(sym)) {
      if (selectedSymbols.length > 1) {
        setSelectedSymbols(selectedSymbols.filter(s => s !== sym));
      }
    } else {
      setSelectedSymbols([...selectedSymbols, sym]);
    }
  };

  const handleSaveBasket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!basketName.trim()) return;
    if (onCreated) onCreated(basketName);
    alert(`Thematic Basket "${basketName}" constructed and registered with Surveillance Node!`);
    onClose();
  };

  const equalWeight = Math.floor(100 / selectedSymbols.length);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl border border-[#173F35]/20 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#173F35]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#173F35] text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#173F35]">
                Construct Thematic Sovereign Basket
              </h3>
              <p className="text-xs text-[#717975] mt-0.5">
                Assemble a custom weighted equity basket for single-click DvP execution.
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

        <form onSubmit={handleSaveBasket} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1C18] mb-1">
              Basket Title
            </label>
            <input
              type="text"
              required
              value={basketName}
              onChange={(e) => setBasketName(e.target.value)}
              placeholder="e.g. Clean Tech &amp; Telemetry Alpha"
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#173F35]/15 focus:border-[#173F35] rounded-xl text-xs font-sans outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1C18] mb-1">
              Strategic Rationale
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Focused on satellite communications and green hydrogen"
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#173F35]/15 focus:border-[#173F35] rounded-xl text-xs font-sans outline-none"
            />
          </div>

          {/* Select Constituents */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1C18] mb-1.5">
              Constituent Equities ({selectedSymbols.length} Selected)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
              {Object.values(LISTED_COMPANIES).map((comp) => {
                const isSelected = selectedSymbols.includes(comp.symbol);
                return (
                  <button
                    key={comp.symbol}
                    type="button"
                    onClick={() => handleToggleSymbol(comp.symbol)}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-[#DCEEE8] border-[#2F7468] text-[#173F35] font-bold shadow-xs'
                        : 'bg-[#FAF8F5] border-[#173F35]/10 text-[#717975] hover:border-[#173F35]/30'
                    }`}
                  >
                    <span className="text-xs font-mono">{comp.symbol}</span>
                    <span className="text-[9px] font-sans truncate w-full">{comp.sector}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weighting breakdown preview */}
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10 text-xs font-mono space-y-1">
            <div className="flex justify-between text-[#717975] text-[11px]">
              <span>Prudential Weighting Allocation:</span>
              <span className="font-bold text-[#173F35]">Equal-Weighted (~{equalWeight}% each)</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex">
              {selectedSymbols.map((sym, idx) => (
                <div
                  key={sym}
                  className={`h-full ${
                    ['bg-[#287A55]', 'bg-[#2F7468]', 'bg-[#173F35]', 'bg-[#A8742A]', 'bg-[#66A3BF]'][idx % 5]
                  }`}
                  style={{ width: `${100 / selectedSymbols.length}%` }}
                />
              ))}
            </div>
          </div>

          {/* Min Investment */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1C18] mb-1">
              Minimum Ticket Size (ARTH)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1000"
                step="500"
                value={minInvestment}
                onChange={(e) => setMinInvestment(parseInt(e.target.value) || 1000)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#173F35]/15 focus:border-[#173F35] rounded-xl text-xs font-mono font-bold outline-none"
              />
              <span className="absolute right-3 top-2 text-xs font-mono text-[#A8742A] font-bold">
                ARTH
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#173F35]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#173F35] hover:bg-[#0d2620] text-white text-xs font-bold transition shadow-xs"
            >
              Deploy Custom Basket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
