'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, ArrowRight, TrendingDown, Percent, Sparkles, ShieldCheck } from 'lucide-react';
import { LoanProductDto, LoanSimulationResultDto } from '@arthax/types';
import { apiFetchLoanProducts, apiSimulateLoan } from '@/lib/api';

interface LoanSimulatorInlineProps {
  onOpenApplicationWithParams: (params: { productId: string; principal: number; tenureMonths: number }) => void;
}

export const LoanSimulatorInline: React.FC<LoanSimulatorInlineProps> = ({
  onOpenApplicationWithParams,
}) => {
  const [products, setProducts] = useState<LoanProductDto[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('prod_nava_personal');
  const [principal, setPrincipal] = useState<number>(50000); // 50,000 ARTH
  const [tenureMonths, setTenureMonths] = useState<number>(24); // 24 months
  const [simulation, setSimulation] = useState<LoanSimulationResultDto | null>(null);

  useEffect(() => {
    apiFetchLoanProducts().then((data) => {
      setProducts(data);
      if (data.length > 0) {
        setSelectedProductId(data[0].id);
      }
    });
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Run simulation whenever params change
  useEffect(() => {
    if (!selectedProduct) return;
    const principalMinor = (BigInt(principal) * 100n).toString();
    apiSimulateLoan({
      productId: selectedProduct.id,
      principalMinor,
      tenureMonths,
    }).then(setSimulation);
  }, [selectedProduct, principal, tenureMonths]);

  const minPrincipal = selectedProduct ? Number(BigInt(selectedProduct.minPrincipalMinor) / 100n) : 10000;
  const maxPrincipal = selectedProduct ? Number(BigInt(selectedProduct.maxPrincipalMinor) / 100n) : 200000;
  const minTenure = selectedProduct?.minTenureMonths || 6;
  const maxTenure = selectedProduct?.maxTenureMonths || 60;

  // Formatting results
  const emiFormatted = simulation
    ? (Number(simulation.monthlyEmiMinor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const totalInterestFormatted = simulation
    ? (Number(simulation.totalInterestMinor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const totalRepaymentFormatted = simulation
    ? (Number(simulation.totalRepaymentMinor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const processingFeeFormatted = simulation
    ? (Number(simulation.processingFeeMinor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const principalRatio = simulation && Number(simulation.totalRepaymentMinor) > 0
    ? Math.round((principal * 100 / (Number(simulation.totalRepaymentMinor) / 100)) * 100) / 100
    : 0.85;

  return (
    <section className="bg-white rounded-3xl border border-[#74777F]/20 p-6 sm:p-8 lg:p-10 shadow-2xs space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#74777F]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF0E1] text-[#A8742A] text-xs font-mono font-bold tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL EMI SIMULATOR</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#121C28]">
            Interactive Reducing-Balance Credit Calculator
          </h2>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-1 font-sans">
            Adjust principal and tenure to preview exact monthly installment obligations and amortization breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#10B981]/15 text-[#065F46] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Statutory Cap: Max 50% DTI
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Product Picker */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F] mb-2">
              Select Loan Facility Scheme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {products.map((p) => {
                const isSelected = p.id === selectedProductId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProductId(p.id);
                      // Clamp principal and tenure within new product bounds
                      const pMin = Number(BigInt(p.minPrincipalMinor) / 100n);
                      const pMax = Number(BigInt(p.maxPrincipalMinor) / 100n);
                      setPrincipal((prev) => Math.max(pMin, Math.min(pMax, prev)));
                      setTenureMonths((prev) => Math.max(p.minTenureMonths, Math.min(p.maxTenureMonths, prev)));
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1E3A5F] bg-[#E5EFFF]/50 shadow-xs ring-1 ring-[#1E3A5F]'
                        : 'border-[#74777F]/20 hover:border-[#1E3A5F]/40 bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-[#121C28]">{p.name}</span>
                      <span className="font-mono text-xs font-bold text-[#A8742A]">{p.baseInterestRate}%</span>
                    </div>
                    <span className="text-[11px] text-[#5C574F] line-clamp-1 mt-1">{p.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Principal Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F]">
                Required Principal Amount
              </label>
              <div className="flex items-center gap-1 font-mono font-bold text-lg text-[#121C28]">
                <span>{principal.toLocaleString()}</span>
                <span className="text-xs text-[#A8742A]">ARTH</span>
              </div>
            </div>
            <input
              type="range"
              min={minPrincipal}
              max={maxPrincipal}
              step={1000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[#E6E8ED] accent-[#1E3A5F] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-[#74777F]">
              <span>Min: {minPrincipal.toLocaleString()} ARTH</span>
              <span>Max: {maxPrincipal.toLocaleString()} ARTH</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F]">
                Repayment Tenure (Months)
              </label>
              <div className="flex items-center gap-1 font-mono font-bold text-lg text-[#121C28]">
                <span>{tenureMonths}</span>
                <span className="text-xs text-[#74777F]">Months ({ (tenureMonths / 12).toFixed(1) } yrs)</span>
              </div>
            </div>
            <input
              type="range"
              min={minTenure}
              max={maxTenure}
              step={1}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[#E6E8ED] accent-[#1E3A5F] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-[#74777F]">
              <span>Min: {minTenure} Mos</span>
              <span>Max: {maxTenure} Mos</span>
            </div>
          </div>
        </div>

        {/* Results Card Column (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl border border-[#74777F]/20 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#74777F]/15">
              <span className="font-mono text-xs font-bold text-[#5C574F] uppercase tracking-wider">
                Simulated Quote
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#A8742A]/15 text-[#A8742A]">
                {selectedProduct?.baseInterestRate}% Reducing APY
              </span>
            </div>

            {/* Big EMI Highlight */}
            <div className="bg-white rounded-xl p-4 border border-[#74777F]/15 space-y-1">
              <span className="text-xs font-mono text-[#5C574F] uppercase tracking-wider block">
                Estimated Monthly EMI
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-3xl text-[#121C28]">{emiFormatted}</span>
                <span className="text-xs font-bold text-[#A8742A]">ARTH / mo</span>
              </div>
              <p className="text-[11px] text-[#74777F]">
                Fixed monthly equated installment across {tenureMonths} months.
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5C574F]">Total Principal:</span>
                <span className="font-mono font-bold text-[#121C28]">{principal.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C574F]">Total Accrued Interest:</span>
                <span className="font-mono font-bold text-[#A8742A]">{totalInterestFormatted} ARTH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C574F]">Processing Fee ({selectedProduct?.processingFeePercent}%):</span>
                <span className="font-mono text-[#5C574F]">{processingFeeFormatted} ARTH</span>
              </div>
              <div className="pt-2 border-t border-[#74777F]/10 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#121C28]">Total Repayment:</span>
                <span className="font-mono font-bold text-[#121C28]">{totalRepaymentFormatted} ARTH</span>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-1 pt-1">
              <div className="h-2 rounded-full bg-[#FAF0E1] overflow-hidden flex">
                <div
                  className="h-full bg-[#1E3A5F]"
                  style={{ width: `${Math.round(principalRatio * 100)}%` }}
                  title="Principal"
                />
                <div
                  className="h-full bg-[#A8742A]"
                  style={{ width: `${100 - Math.round(principalRatio * 100)}%` }}
                  title="Interest"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#74777F]">
                <span>Principal ({Math.round(principalRatio * 100)}%)</span>
                <span>Interest ({100 - Math.round(principalRatio * 100)}%)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedProduct) {
                onOpenApplicationWithParams({
                  productId: selectedProduct.id,
                  principal,
                  tenureMonths,
                });
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#A8742A] hover:bg-[#8F6122] text-white text-xs sm:text-sm font-bold transition shadow-md hover:shadow-lg cursor-pointer transform active:scale-98"
          >
            <span>Apply with These Terms</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
