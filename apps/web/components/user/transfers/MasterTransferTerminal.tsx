'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ArrowRightLeft, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Layers, 
  Building2, 
  KeyRound, 
  Usb, 
  FileText, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';

export interface CounterpartyInfo {
  id: string;
  name: string;
  govId: string;
  node: string;
  accountRef: string;
  initials: string;
  isVerified: boolean;
}

const DEFAULT_COUNTERPARTIES: CounterpartyInfo[] = [
  {
    id: 'vikram',
    name: 'Vikram Malhotra',
    govId: '#9102-482-DL',
    node: 'Samaya Wealth Node',
    accountRef: 'arthax.samaya.cls.9102-482-dl.001',
    initials: 'VM',
    isVerified: true
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    govId: '#7731-902-KA',
    node: 'VAYU Instant Rail',
    accountRef: 'arthax.vayu.cls.7731-902-ka.001',
    initials: 'PN',
    isVerified: true
  },
  {
    id: 'nse',
    name: 'NSE Sovereign Custody',
    govId: '#SETU-CUST-8821',
    node: 'SETU Clearing Node',
    accountRef: 'arthax.setu.custody.8821.dvp',
    initials: 'NS',
    isVerified: true
  },
  {
    id: 'mumbai',
    name: 'Mumbai Corp',
    govId: '#MUN-CIVIC-009',
    node: 'Civic Ledger Node',
    accountRef: 'arthax.mumbai.civic.009',
    initials: 'MM',
    isVerified: true
  }
];

export interface SourceAccountOption {
  id: string;
  name: string;
  code: string;
  bank: string;
  balance: number;
  node: string;
  logo: string;
}

const SOURCE_ACCOUNTS: SourceAccountOption[] = [
  {
    id: 'nava-payroll',
    name: 'NAVA Sovereign Payroll',
    code: '#ARTH-9021-001',
    bank: 'NAVA Bank',
    balance: 142500.00,
    node: 'IN-MUMBAI-01',
    logo: '/assets/banks/nava_bank.png'
  },
  {
    id: 'samaya-wealth',
    name: 'Samaya Wealth Vault',
    code: '#ARTH-4412-001',
    bank: 'Samaya Bank',
    balance: 98200.00,
    node: 'IN-DELHI-02',
    logo: '/assets/banks/samaya_bank.png'
  },
  {
    id: 'setu-custody',
    name: 'SETU Demat Custody',
    code: '#ARTH-8831-001',
    bank: 'Setu Bank',
    balance: 45000.00,
    node: 'IN-MUMBAI-04',
    logo: '/assets/banks/setu_bank.png'
  },
  {
    id: 'sthira-reserve',
    name: 'Sthira Term Reserve',
    code: '#ARTH-1190-001',
    bank: 'Sthira Bank',
    balance: 250000.00,
    node: 'IN-BENGALURU-01',
    logo: '/assets/banks/sthira_bank.png'
  },
  {
    id: 'vayu-velocity',
    name: 'VAYU High-Velocity',
    code: '#ARTH-7740-001',
    bank: 'Vayu Bank',
    balance: 18450.00,
    node: 'IN-HYDERABAD-03',
    logo: '/assets/banks/vayu_bank.png'
  }
];

interface MasterTransferTerminalProps {
  isMasked: boolean;
  onSuccessfulTransfer?: (amount: number, recipient: string, txHash: string) => void;
  onOpenAuditReceipt?: (txHash: string) => void;
  selectedCounterpartyExternal?: CounterpartyInfo | null;
}

export const MasterTransferTerminal: React.FC<MasterTransferTerminalProps> = ({
  isMasked,
  onSuccessfulTransfer,
  onOpenAuditReceipt,
  selectedCounterpartyExternal
}) => {
  // Transfer Mode: 'dvp' | 'sweep' | 'cls' | 'mandate'
  const [transferMode, setTransferMode] = useState<'dvp' | 'sweep' | 'cls' | 'mandate'>('dvp');
  
  // Source Account selection
  const [selectedSourceAccount, setSelectedSourceAccount] = useState<SourceAccountOption>(SOURCE_ACCOUNTS[0]);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState<boolean>(false);

  // Recipient selection
  const [selectedRecipient, setSelectedRecipient] = useState<CounterpartyInfo>(DEFAULT_COUNTERPARTIES[0]);

  // Amount
  const [amountInput, setAmountInput] = useState<string>('12,500.00');
  
  // Delivery Mechanism: 'cls-immediate' | 'atomic-dvp'
  const [deliveryType, setDeliveryType] = useState<'cls-immediate' | 'atomic-dvp'>('atomic-dvp');

  // pacs.008 Purpose
  const [purposeRemittance, setPurposeRemittance] = useState<string>(
    'DvP Tranche Settlement - NILA Systems Equity Allocation'
  );

  // Financial PIN (Step-Up enclave auth, Rule 16 & 17)
  const [financialPin, setFinancialPin] = useState<string>('');
  
  // Lifecycle state: 'idle' | 'validating' | 'signing' | 'settling' | 'settled' | 'error'
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'validating' | 'signing' | 'settling' | 'settled' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [settledHash, setSettledHash] = useState<string>('');

  // Handle external counterparty selection changes
  React.useEffect(() => {
    if (selectedCounterpartyExternal) {
      setSelectedRecipient(selectedCounterpartyExternal);
    }
  }, [selectedCounterpartyExternal]);

  // Numerical helpers
  const parsedAmount = parseFloat(amountInput.replace(/,/g, '')) || 0;
  const singleTxLimit = 25000.00;

  const handleAddAmount = (addValue: number) => {
    const current = parseFloat(amountInput.replace(/,/g, '')) || 0;
    const nextVal = Math.min(singleTxLimit, current + addValue);
    setAmountInput(nextVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setErrorMessage('');
  };

  const handleSetMax = () => {
    setAmountInput(singleTxLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setErrorMessage('');
  };

  // Dispatch lifecycle execution
  const handleAuthorizeAndDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (parsedAmount <= 0) {
      setErrorMessage('Please enter a settlement quantum greater than 0 ARTH.');
      return;
    }

    if (parsedAmount > singleTxLimit) {
      setErrorMessage(`Settlement exceeds single transaction cap of ${singleTxLimit.toLocaleString('en-US')} ARTH.`);
      return;
    }

    if (parsedAmount > selectedSourceAccount.balance) {
      setErrorMessage('Insufficient reserves in the selected source vault.');
      return;
    }

    // Step-up verification check for high value (> 10,000 ARTH)
    if (parsedAmount >= 10000 && financialPin.length < 6) {
      setErrorMessage('Please enter your 6-digit Resident Financial PIN to authorize high-value clearance.');
      return;
    }

    // Begin multi-step deterministic ISO 20022 clearing sequence
    setDispatchStatus('validating');
    setStatusMessage('Validating KYC & Enclave Nonce via Sovereign Directory...');

    setTimeout(() => {
      setDispatchStatus('signing');
      setStatusMessage('FIPS 140-3 HSM Double-Signing DvP Execution Payload...');

      setTimeout(() => {
        setDispatchStatus('settling');
        setStatusMessage('Routing via Central Clearing Settlement (CLS) Node...');

        setTimeout(() => {
          const generatedHash = `tx.cls.20250524.${Math.floor(100000 + Math.random() * 900000)}`;
          setSettledHash(generatedHash);
          setDispatchStatus('settled');
          setStatusMessage(`Atomic DvP Cleared: ${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH to ${selectedRecipient.name}`);

          if (onSuccessfulTransfer) {
            onSuccessfulTransfer(parsedAmount, selectedRecipient.name, generatedHash);
          }

          setFinancialPin('');
        }, 1400);
      }, 1200);
    }, 900);
  };

  return (
    <div className="bg-white border border-[#74777F]/20 p-5 sm:p-7 rounded-3xl shadow-xs space-y-6">
      {/* Mode Selector Segmented Tabs */}
      <div className="space-y-2">
        <label className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold block">
          Transfer Mode Architecture
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl">
          <button 
            type="button"
            onClick={() => setTransferMode('dvp')}
            className={`px-3 py-2 rounded-xl font-sans text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              transferMode === 'dvp' 
                ? 'bg-[#022448] text-white shadow-xs' 
                : 'text-[#43474E] hover:text-[#022448] hover:bg-[#EEF4FF]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>Direct DvP</span>
          </button>

          <button 
            type="button"
            onClick={() => setTransferMode('sweep')}
            className={`px-3 py-2 rounded-xl font-sans text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              transferMode === 'sweep' 
                ? 'bg-[#022448] text-white shadow-xs' 
                : 'text-[#43474E] hover:text-[#022448] hover:bg-[#EEF4FF]'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Own Sweep</span>
          </button>

          <button 
            type="button"
            onClick={() => setTransferMode('cls')}
            className={`px-3 py-2 rounded-xl font-sans text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              transferMode === 'cls' 
                ? 'bg-[#022448] text-white shadow-xs' 
                : 'text-[#43474E] hover:text-[#022448] hover:bg-[#EEF4FF]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Inter-Bank CLS</span>
          </button>

          <button 
            type="button"
            onClick={() => setTransferMode('mandate')}
            className={`px-3 py-2 rounded-xl font-sans text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              transferMode === 'mandate' 
                ? 'bg-[#022448] text-white shadow-xs' 
                : 'text-[#43474E] hover:text-[#022448] hover:bg-[#EEF4FF]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mandate</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleAuthorizeAndDispatch} className="space-y-6">
        {/* Source Sovereign Vault Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold">
              Source Sovereign Vault
            </label>
            <span className="font-mono text-xs text-[#10B981] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              Primary Liquidity Tier
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAccountDropdownOpen((prev) => !prev)}
              className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#F8F9FF] hover:bg-[#EEF4FF] border border-[#74777F]/20 rounded-2xl gap-3 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#74777F]/15 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                  <Image 
                    src={selectedSourceAccount.logo} 
                    alt={selectedSourceAccount.bank} 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base text-[#022448] font-bold">
                      {selectedSourceAccount.name}
                    </span>
                    <span className="px-2 py-0.5 bg-[#dbe1ff] text-[#031847] rounded-full font-mono text-[10px] font-semibold">
                      {selectedSourceAccount.code}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#74777F] mt-0.5">
                    Node: {selectedSourceAccount.node} • Sovereign Clearance
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <div className="font-serif text-lg font-bold text-[#022448] tabular-nums">
                    <AnimatedMaskedValue 
                      value={selectedSourceAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} 
                      isMasked={isMasked} 
                      maskString="••••••••" 
                    />{' '}
                    <span className="font-sans text-xs text-[#74777F] font-normal">ARTH</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#74777F]">
                    Cleared Real-Time Reserves
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#74777F] transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Account Switcher Dropdown Menu */}
            {isAccountDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white border border-[#74777F]/25 rounded-2xl shadow-lg p-2 space-y-1">
                {SOURCE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      setSelectedSourceAccount(acc);
                      setIsAccountDropdownOpen(false);
                      setErrorMessage('');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left ${
                      selectedSourceAccount.id === acc.id ? 'bg-[#EEF4FF] border border-[#1E3A5F]/20' : 'hover:bg-[#F8F9FF]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#74777F]/15 flex items-center justify-center p-1 shrink-0">
                        <Image src={acc.logo} alt={acc.bank} width={22} height={22} className="object-contain" />
                      </div>
                      <div>
                        <div className="font-sans text-xs font-semibold text-[#022448]">{acc.name}</div>
                        <div className="font-mono text-[10px] text-[#74777F]">{acc.code} • {acc.node}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs font-bold text-[#022448]">
                      <AnimatedMaskedValue 
                        value={acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} 
                        isMasked={isMasked} 
                        maskString="••••••" 
                      /> ARTH
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Beneficiary / Recipient Entry */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold">
              Recipient Sovereign IBAN or GOV ID
            </label>
            <span className="font-mono text-xs text-[#43474E] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              ISO Enclave Directory
            </span>
          </div>

          <div className="p-4 bg-[#F8F9FF] border border-[#74777F]/20 rounded-2xl space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-xs">
                  {selectedRecipient.initials}
                </div>
                <div>
                  <div className="font-serif text-base text-[#022448] font-bold">
                    {selectedRecipient.name}
                  </div>
                  <div className="font-mono text-xs text-[#43474E]">
                    GOV ID: {selectedRecipient.govId} • {selectedRecipient.node}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 bg-[#A8F5BF]/60 text-[#002110] border border-[#10B981]/30 rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                Verified Citizen &amp; Enclave Key Found
              </span>
            </div>

            <div className="pt-2 border-t border-[#74777F]/15 font-mono text-xs text-[#43474E] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="truncate max-w-md text-[#74777F] text-[11px]">
                {selectedRecipient.accountRef}
              </span>
              <span className="text-[#1E3A5F] font-sans font-medium text-xs">
                Active Domestic Settlement Counterparty
              </span>
            </div>
          </div>

          {/* Quick Counterparty Channels Tray */}
          <div className="pt-1 space-y-1.5">
            <span className="font-sans text-[11px] text-[#74777F] block">
              Fast Counterparty Channels:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEFAULT_COUNTERPARTIES.map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => setSelectedRecipient(cp)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    selectedRecipient.id === cp.id
                      ? 'bg-[#EEF4FF] border-[#1E3A5F] shadow-xs'
                      : 'bg-white hover:bg-[#F8F9FF] border-[#74777F]/20'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#dbe1ff] text-[#031847] flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                    {cp.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans text-xs font-semibold text-[#022448] truncate">{cp.name}</div>
                    <div className="font-mono text-[10px] text-[#74777F] truncate">{cp.node}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transfer Amount & Units */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold">
              Settlement Quantum
            </label>
            <span className="font-mono text-xs text-[#74777F]">
              Sovereign Peg: 1 ARTH = 1 USD Equivalent
            </span>
          </div>

          <div className="p-4 sm:p-5 bg-[#F8F9FF] border border-[#74777F]/20 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-[#A8742A]">₳</span>
                <input
                  type="text"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    setErrorMessage('');
                  }}
                  className="font-serif text-3xl sm:text-4xl text-[#022448] font-bold tabular-nums bg-transparent border-b border-[#74777F]/30 focus:border-[#A8742A] focus:outline-none w-56 sm:w-64 tracking-tight"
                  placeholder="0.00"
                />
                <span className="font-sans text-lg font-bold text-[#74777F]">ARTH</span>
              </div>

              <div className="sm:text-right">
                <span className="px-2.5 py-1 bg-white border border-[#74777F]/20 text-[#43474E] rounded-md font-mono text-xs">
                  Single Tx Limit: 25,000.00 ARTH
                </span>
              </div>
            </div>

            {/* Quick Add Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAddAmount(500)}
                className="px-3 py-1 bg-white hover:bg-[#EEF4FF] border border-[#74777F]/20 text-[#022448] rounded-full font-mono text-xs font-medium transition shadow-xs"
              >
                +500 ARTH
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(1000)}
                className="px-3 py-1 bg-white hover:bg-[#EEF4FF] border border-[#74777F]/20 text-[#022448] rounded-full font-mono text-xs font-medium transition shadow-xs"
              >
                +1,000 ARTH
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(5000)}
                className="px-3 py-1 bg-white hover:bg-[#EEF4FF] border border-[#74777F]/20 text-[#022448] rounded-full font-mono text-xs font-medium transition shadow-xs"
              >
                +5,000 ARTH
              </button>
              <button
                type="button"
                onClick={handleSetMax}
                className="px-3.5 py-1 bg-[#dbe1ff] text-[#031847] hover:bg-[#c9d4ff] rounded-full font-mono text-xs font-bold transition shadow-xs"
              >
                Max Permitted (25,000 ARTH)
              </button>
            </div>
          </div>
        </div>

        {/* Settlement Type & pacs.008 Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Mechanism Toggle */}
          <div className="space-y-2">
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold block">
              Delivery Mechanism
            </label>
            <div className="space-y-2">
              <div 
                onClick={() => setDeliveryType('cls-immediate')}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                  deliveryType === 'cls-immediate' 
                    ? 'bg-[#EEF4FF] border-[#1E3A5F] shadow-xs' 
                    : 'bg-[#F8F9FF] border-[#74777F]/20 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#A8742A]" />
                  <div>
                    <div className="font-sans text-xs font-semibold text-[#022448]">Immediate CLS Delivery</div>
                    <div className="font-mono text-[10px] text-[#74777F]">Sub-380ms unconditional finality</div>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="delivery_mechanism" 
                  checked={deliveryType === 'cls-immediate'}
                  onChange={() => setDeliveryType('cls-immediate')}
                  className="accent-[#022448]" 
                />
              </div>

              <div 
                onClick={() => setDeliveryType('atomic-dvp')}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                  deliveryType === 'atomic-dvp' 
                    ? 'bg-[#EEF4FF] border-[#1E3A5F] shadow-xs' 
                    : 'bg-[#F8F9FF] border-[#74777F]/20 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#1E3A5F]" />
                  <div>
                    <div className="font-sans text-xs font-semibold text-[#022448]">Atomic DvP (Delivery vs Payment)</div>
                    <div className="font-mono text-[10px] text-[#74777F]">Conditional release upon asset transfer</div>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="delivery_mechanism" 
                  checked={deliveryType === 'atomic-dvp'}
                  onChange={() => setDeliveryType('atomic-dvp')}
                  className="accent-[#022448]" 
                />
              </div>
            </div>
          </div>

          {/* pacs.008 Purpose Remittance Tag */}
          <div className="space-y-2">
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold block">
              pacs.008 Remittance Tag / Purpose
            </label>
            <div className="p-3.5 bg-[#F8F9FF] border border-[#74777F]/20 rounded-2xl h-[106px] flex flex-col justify-between">
              <div>
                <input
                  type="text"
                  value={purposeRemittance}
                  onChange={(e) => setPurposeRemittance(e.target.value)}
                  className="w-full bg-transparent font-sans text-xs font-semibold text-[#022448] focus:outline-none"
                  placeholder="Enter institutional remittance purpose"
                />
                <div className="font-mono text-[10px] text-[#74777F] mt-1">
                  Registry Mandate: #SETU-EQ-2025-0814
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#10B981] font-mono text-[11px]">
                <Lock className="w-3.5 h-3.5" />
                <span>Audited &amp; Encrypted in pacs.008 block</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Fee & Escrow Breakdown */}
        <div className="p-4 bg-[#F8F9FF] border border-[#74777F]/20 rounded-2xl space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center text-[#43474E]">
            <span>Transfer Fee (Sovereign Resident Charter):</span>
            <span className="text-[#10B981] font-semibold">0.00 ARTH (Exempt)</span>
          </div>
          <div className="flex justify-between items-center text-[#43474E]">
            <span>Statutory Escrow Collateral Impact:</span>
            <span className="text-[#022448] font-bold">0.00 ARTH</span>
          </div>
          <div className="pt-2 border-t border-[#74777F]/15 flex justify-between items-center font-serif text-base sm:text-lg text-[#022448] font-bold">
            <span>Net Outflow Debited:</span>
            <span className="tabular-nums text-[#022448]">
              {parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARTH
            </span>
          </div>
        </div>

        {/* Step-Up High Value Authentication (>10,000 ARTH) strictly isolating Financial PIN (Rules 16 & 17) */}
        <div className="p-5 bg-[#FDF8F0] border border-[#DFB87A] rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A8742A]/15 text-[#A8742A] flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-serif text-sm sm:text-base text-[#361f00] font-bold flex items-center gap-2">
                <span>Dual-Pass Enclave Authentication</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#DFB87A] text-[#A8742A] font-mono text-[10px] font-semibold">
                  FIPS 140-3 HSM
                </span>
              </h3>
              <p className="font-sans text-xs text-[#533300]/80">
                Transfer requires step-up resident financial authorization. Enter citizen financial PIN. Values are zeroized in memory immediately after signature.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-[#DFB87A]/60">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold block mb-1">
                Resident Financial PIN (6-Digit)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  maxLength={6}
                  autoComplete="off"
                  value={financialPin}
                  onChange={(e) => {
                    setFinancialPin(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="••••••"
                  className="w-32 tracking-[0.4em] font-mono text-base text-[#361f00] bg-[#FDF8F0] border border-[#DFB87A] px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8742A] text-center"
                />
                <span className="font-mono text-xs text-[#74777F]">
                  {financialPin.length}/6 digits
                </span>
              </div>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#A8F5BF]/60 text-[#002110] border border-[#10B981]/30 rounded-full font-mono text-xs font-semibold shadow-xs">
                <Usb className="w-3.5 h-3.5 text-[#10B981]" />
                YubiKey FIPS 140-3 Paired
              </span>
              <div className="font-mono text-[10px] text-[#74777F]">
                Physical token confirmed via resident slot
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification per Rule 13 */}
        {errorMessage && (
          <div className="p-3.5 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl text-xs font-sans text-[#410002] flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary Authorize CTA Button */}
        <button
          type="submit"
          disabled={dispatchStatus === 'validating' || dispatchStatus === 'signing' || dispatchStatus === 'settling'}
          className="w-full h-12 rounded-full bg-[#022448] hover:bg-[#1E3A5F] active:scale-[0.99] text-white font-sans text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {dispatchStatus === 'validating' || dispatchStatus === 'signing' || dispatchStatus === 'settling' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#A8742A]" />
              <span>{statusMessage}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-[#A8742A]" />
              <span>Authorize &amp; Dispatch {parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH to {selectedRecipient.name}</span>
            </>
          )}
        </button>

        {/* Settled Broadcast Banner */}
        {dispatchStatus === 'settled' && (
          <div className="p-4 bg-[#A8F5BF]/40 border border-[#10B981]/60 rounded-2xl space-y-2 text-xs font-mono text-[#002110] animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-2 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ATOMIC DVP CLEARED &amp; COMMITTED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981] text-white text-[11px] font-bold">
                T+0 Finality
              </span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-[#002110]/80">
              <span>Receipt Hash: <strong>{settledHash}</strong></span>
              {onOpenAuditReceipt && (
                <button
                  type="button"
                  onClick={() => onOpenAuditReceipt(settledHash)}
                  className="text-[#1E3A5F] underline font-bold hover:text-[#022448]"
                >
                  View Live Audit Receipt →
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
