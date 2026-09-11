'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  Lock, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Sparkles,
  Info
} from 'lucide-react';
import Image from 'next/image';
import { FdSchemeDto, FdSimulationResultDto, UserFdDto, FdRolloverInstruction } from '@arthax/types';
import { apiFetchFdSchemes, apiSimulateFdYield, apiBookFd } from '@/lib/api';

interface FdCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositCreated?: (deposit: UserFdDto) => void;
  defaultBankId?: string;
  defaultPrincipal?: number;
  defaultDays?: number;
}

const BANKS = [
  { id: 'samaya', name: 'SAMAYA Sovereign Bank', logo: '/assets/banks/samaya_bank.png' },
  { id: 'nava', name: 'NAVA Commercial Bank', logo: '/assets/banks/nava_bank.png' },
  { id: 'setu', name: 'SETU Interbank Core', logo: '/assets/banks/setu_bank.png' },
  { id: 'sthira', name: 'STHIRA Custody Bank', logo: '/assets/banks/sthira_bank.png' },
  { id: 'vayu', name: 'VAYU Settlement Node', logo: '/assets/banks/vayu_bank.png' },
];

const TENURES = [
  { days: 90, label: '90 Days' },
  { days: 180, label: '180 Days' },
  { days: 365, label: '365 Days (1 Yr)' },
  { days: 730, label: '730 Days (2 Yrs)' },
];

export const FdCalculatorModal: React.FC<FdCalculatorModalProps> = ({
  isOpen,
  onClose,
  onDepositCreated,
  defaultBankId = 'samaya',
  defaultPrincipal = 50000,
  defaultDays = 365,
}) => {
  const [schemes, setSchemes] = useState<FdSchemeDto[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>(defaultBankId);
  const [principal, setPrincipal] = useState<number>(defaultPrincipal);
  const [selectedDays, setSelectedDays] = useState<number>(defaultDays);
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [rolloverInstruction, setRolloverInstruction] = useState<FdRolloverInstruction>('PRINCIPAL_AND_INTEREST');

  // Simulation state
  const [simulation, setSimulation] = useState<FdSimulationResultDto | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Step flow: 'config' -> 'verify' -> 'success'
  const [step, setStep] = useState<'config' | 'verify' | 'success'>('config');
  const [financialPin, setFinancialPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookedDeposit, setBookedDeposit] = useState<UserFdDto | null>(null);

  // Fetch schemes on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      apiFetchFdSchemes().then((data) => {
        if (data && data.length > 0) {
          setSchemes(data);
        }
      });
    }
  }, [isOpen]);

  // Find the matching scheme for currently selected bank
  const currentBankSchemes = schemes.filter(
    (s) => s.bankId.toLowerCase() === selectedBankId.toLowerCase()
  );
  const activeScheme = currentBankSchemes[0] || schemes[0];

  // Re-simulate yield whenever principal, bank, or tenure changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsSimulating(true);

    const schemeId = activeScheme ? activeScheme.id : `scheme_${selectedBankId}_growth_365`;
    const principalMinor = Math.round(principal * 100);

    apiSimulateFdYield({
      schemeId,
      principalMinor,
      tenureDays: selectedDays,
    })
      .then((res) => {
        if (isMounted && res) {
          setSimulation(res);
        }
      })
      .catch(() => {
        // Handled by api fallback
      })
      .finally(() => {
        if (isMounted) setIsSimulating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedBankId, principal, selectedDays, activeScheme?.id]);

  if (!isOpen) return null;

  const currentBank = BANKS.find((b) => b.id === selectedBankId) || BANKS[0];

  const effectiveApy = simulation?.effectiveApy ?? (activeScheme ? activeScheme.baseApy : 7.25);
  const estimatedInterest = simulation
    ? Number(simulation.estimatedInterestMinor ?? simulation.interestPayoutMinor ?? 0) / 100
    : (principal * (effectiveApy / 100) * (selectedDays / 365));
  const maturityPayout = simulation
    ? Number(simulation.maturityPayoutMinor ?? simulation.maturityAmountMinor ?? 0) / 100
    : principal + estimatedInterest;

  const handleProceedToVerify = () => {
    setPinError('');
    setStep('verify');
  };

  const handleConfirmDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialPin || financialPin.length < 4) {
      setPinError('Financial Password must be at least 4 digits');
      return;
    }

    setIsSubmitting(true);
    setPinError('');

    try {
      const schemeId = activeScheme ? activeScheme.id : `scheme_${selectedBankId}_growth_365`;
      const idempotencyKey = `fd_book_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const deposit = await apiBookFd(
        {
          sourceAccountId: `acc_${selectedBankId}_primary`,
          schemeId,
          principalMinor: Math.round(principal * 100),
          tenureDays: selectedDays,
          financialPassword: financialPin,
          autoRenew,
          rolloverInstruction,
        },
        idempotencyKey,
      );

      if (deposit) {
        setBookedDeposit(deposit);
        setStep('success');
        if (onDepositCreated) {
          onDepositCreated(deposit);
        }
      } else {
        setPinError('Failed to authorize booking on Core Ledger.');
      }
    } catch (err: any) {
      setPinError(err.message || 'Authorization failed. Please check your Financial Password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('config');
    setFinancialPin('');
    setPinError('');
    setBookedDeposit(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl border border-[#74777F]/20 shadow-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#74777F]/15 bg-[#F8F9FF]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#E5EFFF] text-[#1E3A5F] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg text-[#022448] font-bold">
                {step === 'config' && 'Fixed Deposit Yield Engine & Booking'}
                {step === 'verify' && 'Step-Up Financial Authorization'}
                {step === 'success' && 'Deposit Certificate Issued'}
              </h2>
              <span className="font-mono text-[10px] text-[#5C574F] uppercase tracking-wider block">
                ISO 20022 Escrow Lock • Core Ledger Custody
              </span>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-[#74777F] hover:bg-[#E5EFFF] hover:text-[#121C28] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {step === 'config' && (
            <>
              {/* Principal Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider">
                    Principal Commitment (ARTH)
                  </label>
                  <div className="flex items-baseline gap-1 font-mono text-xl font-bold text-[#022448]">
                    <span>{principal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs text-[#5C574F] font-normal">ARTH</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={5000}
                  max={250000}
                  step={5000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-2 bg-[#E5EFFF] rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
                />

                <div className="flex justify-between font-mono text-[11px] text-[#74777F]">
                  <span>5,000 ARTH</span>
                  <span>100,000 ARTH</span>
                  <span>250,000 ARTH</span>
                </div>
              </div>

              {/* Chartered Bank Selector */}
              <div className="space-y-2.5">
                <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider block">
                  Select Chartered Depository Bank
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BANKS.map((b) => {
                    const isSelected = b.id === selectedBankId;
                    const matchingScheme = schemes.find((s) => s.bankId.toLowerCase() === b.id.toLowerCase());
                    const bankApy = matchingScheme ? matchingScheme.baseApy : 7.25;

                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBankId(b.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E5EFFF] border-[#1E3A5F] shadow-2xs'
                            : 'bg-[#F8F9FF] border-[#74777F]/20 hover:bg-[#EEF4FF]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white p-1 border border-[#74777F]/15 shrink-0 flex items-center justify-center">
                          <Image src={b.logo} alt={b.name} width={24} height={24} className="object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-sans text-xs font-semibold text-[#121C28] truncate">{b.name}</div>
                          <div className="font-mono text-[11px] text-[#287A55] font-medium">{bankApy}% Base APY</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tenure Selector */}
              <div className="space-y-2.5">
                <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider block">
                  Tenure Horizon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TENURES.map((t) => {
                    const isSelected = t.days === selectedDays;
                    return (
                      <button
                        key={t.days}
                        type="button"
                        onClick={() => setSelectedDays(t.days)}
                        className={`py-2 px-3 rounded-xl border text-center font-sans text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#022448] text-white border-[#022448] font-semibold shadow-xs'
                            : 'bg-[#F8F9FF] text-[#43474E] border-[#74777F]/20 hover:bg-[#E5EFFF]'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Yield Breakdown Summary Box */}
              <div className="p-4 bg-[#F8F9FF] rounded-xl border border-[#74777F]/20 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5C574F]">Effective Compound APY:</span>
                  <span className="font-serif text-base font-bold text-[#287A55] flex items-center gap-1.5">
                    {effectiveApy.toFixed(2)}%
                    {(simulation?.petBoosterApy ?? simulation?.petBonusApy ?? 0) > 0 && (
                      <span className="text-[11px] text-[#A8742A] font-mono font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" />
                        (+{(simulation?.petBoosterApy ?? simulation?.petBonusApy ?? 0).toFixed(2)}% Pet Booster)
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5C574F]">Compounding Schedule:</span>
                  <span className="font-mono text-xs font-semibold text-[#121C28]">
                    Quarterly [A = P(1 + r/4)^(4t)]
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5C574F]">Estimated Accrued Yield:</span>
                  <span className="font-mono font-bold text-[#287A55]">
                    +{estimatedInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARTH
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#74777F]/10">
                  <span className="font-semibold text-[#121C28]">Projected Payout at Maturity:</span>
                  <span className="font-mono text-base font-bold text-[#022448]">
                    {maturityPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARTH
                  </span>
                </div>

                {/* Auto renew toggle and options */}
                <div className="pt-2 border-t border-[#74777F]/10 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoRenew}
                      onChange={(e) => setAutoRenew(e.target.checked)}
                      className="w-4 h-4 rounded border-[#74777F]/40 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                    />
                    <span className="font-sans text-xs text-[#121C28] font-medium">
                      Enable Sovereign Auto-Renewal Mandate at maturity
                    </span>
                  </label>

                  {autoRenew && (
                    <div className="pl-6 flex items-center gap-4 text-xs font-sans text-[#5C574F]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="rollover"
                          value="PRINCIPAL_AND_INTEREST"
                          checked={rolloverInstruction === 'PRINCIPAL_AND_INTEREST'}
                          onChange={() => setRolloverInstruction('PRINCIPAL_AND_INTEREST')}
                          className="text-[#1E3A5F]"
                        />
                        <span>Compound (P + Interest)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="rollover"
                          value="PRINCIPAL_ONLY"
                          checked={rolloverInstruction === 'PRINCIPAL_ONLY'}
                          onChange={() => setRolloverInstruction('PRINCIPAL_ONLY')}
                          className="text-[#1E3A5F]"
                        />
                        <span>Principal Only (Payout Yield)</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleProceedToVerify}
                type="button"
                className="w-full py-3 bg-[#022448] hover:bg-[#1E3A5F] text-white font-medium text-xs rounded-full shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#A8742A]" />
                <span>Proceed to Enclave Step-Up Authorization</span>
              </button>
            </>
          )}

          {step === 'verify' && (
            <form onSubmit={handleConfirmDeposit} className="space-y-5">
              <div className="p-4 bg-[#E5EFFF] rounded-xl border border-[#74777F]/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#287A55] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-[#121C28]">Dual-Password Isolation Protocol (Rule 16 &amp; 17)</div>
                  <p className="text-[#43474E] leading-relaxed">
                    Locking sovereign term capital requires Financial Password step-up authorization. This password is never logged and verified against Argon2id enclave hashes.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider block">
                  Enter Financial Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#74777F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    autoComplete="off"
                    value={financialPin}
                    onChange={(e) => setFinancialPin(e.target.value)}
                    placeholder="Enter Financial Password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#74777F]/30 bg-[#F8F9FF] font-mono text-sm tracking-widest focus:outline-hidden focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F]"
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

              <div className="p-3 bg-[#F8F9FF] rounded-lg border border-[#74777F]/10 text-xs space-y-1">
                <div className="flex justify-between text-[#5C574F]">
                  <span>Locking Amount:</span>
                  <span className="font-mono font-bold text-[#121C28]">{principal.toLocaleString('en-US')} ARTH</span>
                </div>
                <div className="flex justify-between text-[#5C574F]">
                  <span>Chartered Bank:</span>
                  <span className="font-medium text-[#121C28]">{currentBank.name}</span>
                </div>
                <div className="flex justify-between text-[#5C574F]">
                  <span>Tenure Duration:</span>
                  <span className="font-medium text-[#121C28]">{selectedDays} Days</span>
                </div>
                <div className="flex justify-between text-[#5C574F]">
                  <span>Effective APY:</span>
                  <span className="font-mono font-bold text-[#287A55]">{effectiveApy.toFixed(2)}% APY</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('config')}
                  className="flex-1 py-2.5 bg-[#F2F3FA] hover:bg-[#E5EFFF] text-[#5C574F] font-medium text-xs rounded-full border border-[#74777F]/20 transition-all cursor-pointer"
                >
                  Back to Config
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#022448] hover:bg-[#1E3A5F] disabled:opacity-50 text-white font-medium text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Encrypting &amp; Booking...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#A8742A]" />
                      <span>Execute Sovereign Lock</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && bookedDeposit && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#287A55]/10 text-[#287A55] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#022448] font-bold">
                  Sovereign Fixed Deposit Successfully Booked
                </h3>
                <p className="font-sans text-xs text-[#5C574F] max-w-md mx-auto">
                  Your capital has been placed into ISO 20022 escrow with double-entry cryptographic certification on Core Ledger.
                </p>
              </div>

              <div className="p-4 bg-[#F8F9FF] rounded-xl border border-[#74777F]/20 text-xs font-mono space-y-1.5 max-w-md mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Certificate Code:</span>
                  <span className="text-[#1E3A5F] font-bold">#{bookedDeposit.depositNumber || bookedDeposit.certificateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Locked Principal:</span>
                  <span className="font-bold text-[#121C28]">
                    {(Number(bookedDeposit.principalMinor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Effective Yield:</span>
                  <span className="text-[#287A55] font-bold">{(bookedDeposit.effectiveApy ?? bookedDeposit.apy ?? 7.25).toFixed(2)}% APY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Maturity Payout:</span>
                  <span className="text-[#022448] font-bold">
                    {(Number(bookedDeposit.maturityPayoutMinor || bookedDeposit.maturityAmountMinor || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Certificate Hash:</span>
                  <span className="text-[#74777F]">{bookedDeposit.certificateHash?.slice(0, 16)}...</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                type="button"
                className="px-6 py-2.5 bg-[#022448] hover:bg-[#1E3A5F] text-white font-medium text-xs rounded-full shadow-xs transition-all cursor-pointer"
              >
                Done &amp; Return to Portfolio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
