'use client';

import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';

interface TaxLossSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaxLossSimulatorModal: React.FC<TaxLossSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedLossOffsets, setSelectedLossOffsets] = useState<{ [key: string]: boolean }>({
    KSHT: true,
    JALA: false,
  });

  if (!isOpen) return null;

  const currentRealizedGain = 32180.00;
  const currentTaxLiability = 4385.00; // STCG 15% / LTCG 10%

  const lossPositions = [
    { symbol: 'KSHT', name: 'Kshiti Infra Ports', unrealizedLoss: -2925.00, shares: 150 },
    { symbol: 'JALA', name: 'Jala Water Utilities', unrealizedLoss: -680.00, shares: 80 },
  ];

  const totalHarvestedLoss = lossPositions.reduce((acc, pos) => {
    return acc + (selectedLossOffsets[pos.symbol] ? Math.abs(pos.unrealizedLoss) : 0);
  }, 0);

  const adjustedTaxableGain = Math.max(0, currentRealizedGain - totalHarvestedLoss);
  const estimatedSavings = totalHarvestedLoss * 0.15; // 15% STCG rate
  const adjustedTaxLiability = Math.max(0, currentTaxLiability - estimatedSavings);

  const toggleOffset = (symbol: string) => {
    setSelectedLossOffsets(prev => ({ ...prev, [symbol]: !prev[symbol] }));
  };

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
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#173F35]">
                  Tax-Loss Harvesting Simulator
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#DCEEE8] text-[#173F35] font-mono text-[10px] font-bold">
                  SEC. 18-C
                </span>
              </div>
              <p className="text-xs text-[#717975] mt-0.5">
                Simulate realized capital loss offsets against current fiscal quarter taxable gains.
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

        {/* Current Standing Summary */}
        <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#173F35]/10 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#717975] uppercase">Current Realized Gains</span>
            <div className="font-bold text-[#1A1C18] text-sm">+{currentRealizedGain.toFixed(2)} ARTH</div>
          </div>
          <div>
            <span className="text-[10px] text-[#717975] uppercase">Current Tax Liability</span>
            <div className="font-bold text-[#A8742A] text-sm">{currentTaxLiability.toFixed(2)} ARTH</div>
          </div>
        </div>

        {/* Unrealized Losing Positions Selection */}
        <div className="space-y-2">
          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#173F35]">
            Select Unrealized Positions to Liquidate &amp; Offset
          </h4>
          <div className="space-y-2">
            {lossPositions.map((pos) => {
              const isChecked = !!selectedLossOffsets[pos.symbol];
              return (
                <div
                  key={pos.symbol}
                  onClick={() => toggleOffset(pos.symbol)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    isChecked
                      ? 'bg-[#DCEEE8]/40 border-[#2F7468]'
                      : 'bg-[#FAF8F5] border-[#173F35]/10 hover:border-[#173F35]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 text-[#173F35] rounded"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#173F35]">{pos.symbol}</span>
                      <span className="text-[11px] text-[#717975] ml-2">({pos.name})</span>
                      <div className="text-[10px] font-mono text-[#717975]">{pos.shares} Shares held</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-xs text-[#B94A43]">{pos.unrealizedLoss.toFixed(2)} ARTH</div>
                    <span className="text-[10px] text-[#2F7468]">Save ~{(Math.abs(pos.unrealizedLoss) * 0.15).toFixed(2)} ARTH</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projected Impact Box */}
        <div className="bg-[#112822] text-white p-4 rounded-xl border border-[#1C3E34] text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-[#82AA9D]">
            <span>TOTAL LOSS HARVESTED:</span>
            <span className="text-[#B94A43] font-bold">-{totalHarvestedLoss.toFixed(2)} ARTH</span>
          </div>
          <div className="flex items-center justify-between text-[#82AA9D]">
            <span>ADJUSTED TAXABLE GAINS:</span>
            <span className="text-white font-bold">{adjustedTaxableGain.toFixed(2)} ARTH</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#1C3E34] text-sm">
            <span className="text-[#10B981] font-bold">ESTIMATED TAX SAVINGS:</span>
            <span className="text-[#10B981] font-bold">+{estimatedSavings.toFixed(2)} ARTH</span>
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
            type="button"
            onClick={() => {
              alert(`Simulation confirmed! Tax savings of ${estimatedSavings.toFixed(2)} ARTH projected.`);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#173F35] hover:bg-[#0d2620] text-white text-xs font-bold transition shadow-xs"
          >
            Apply Simulation Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
