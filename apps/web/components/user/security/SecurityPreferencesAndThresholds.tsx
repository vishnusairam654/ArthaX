'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  EyeOff, 
  BellRing, 
  Timer, 
  MapPin, 
  Check, 
  Save, 
  RotateCw,
  HelpCircle,
  Coins
} from 'lucide-react';

interface SecurityPreferencesAndThresholdsProps {
  onNotify: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SecurityPreferencesAndThresholds: React.FC<SecurityPreferencesAndThresholdsProps> = ({ onNotify }) => {
  const [transferThreshold, setTransferThreshold] = useState<number>(50000);
  const [defaultMasking, setDefaultMasking] = useState<boolean>(true);
  const [highValueAlerts, setHighValueAlerts] = useState<boolean>(true);
  const [autoLockTimeout, setAutoLockTimeout] = useState<string>('30');
  const [geoFencing, setGeoFencing] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onNotify('Security policy parameters updated and sealed in resident policy ledger.', 'success');
    }, 900);
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#022448]">
              Risk Thresholds &amp; Privacy Policies
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#EEF4FF] text-[#1E3A5F] border border-[#74777F]/20 font-semibold">
              Prudential Limits
            </span>
          </div>
          <p className="font-sans text-xs md:text-sm text-[#43474E]">
            Configure autonomous transaction limits, default balance obscuration, and domestic node geofencing.
          </p>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={isSaving}
          className="px-4 py-2 rounded-xl bg-[#1E3A5F] hover:bg-[#022448] text-white text-xs font-sans font-semibold transition flex items-center gap-1.5 shadow-xs shrink-0 disabled:opacity-60"
        >
          {isSaving ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Sealing Policy...' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Grid of Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item 1: Daily Outbound Transfer Ceiling */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#A8742A]/15 text-[#A8742A] flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#022448]">
                  Daily Outbound CLS Threshold
                </h4>
                <p className="font-sans text-xs text-[#74777F]">
                  Transactions above this limit require step-up biometric affirmation
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-[#1E3A5F] bg-[#EEF4FF] px-2.5 py-1 rounded-lg">
              {transferThreshold.toLocaleString('en-US')} ARTH
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={5000}
              max={250000}
              step={5000}
              value={transferThreshold}
              onChange={(e) => setTransferThreshold(Number(e.target.value))}
              className="w-full accent-[#1E3A5F] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-[#74777F]">
              <span>5,000 ARTH</span>
              <span>100,000 ARTH</span>
              <span>250,000 ARTH</span>
            </div>
          </div>
        </div>

        {/* Item 2: Default Balance Privacy (Rule 15) */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <div className="max-w-xs sm:max-w-sm">
              <h4 className="font-serif text-sm font-bold text-[#022448]">
                Default Balance Masking (Rule 15)
              </h4>
              <p className="font-sans text-xs text-[#74777F]">
                Obscure sovereign balances on portal initialization. Requires explicit click to reveal.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={defaultMasking}
              onChange={(e) => setDefaultMasking(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A5F]"></div>
          </label>
        </div>

        {/* Item 3: Real-Time High-Value DvP Settlement Alerts */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <div className="max-w-xs sm:max-w-sm">
              <h4 className="font-serif text-sm font-bold text-[#022448]">
                High-Value Settlement Alerts
              </h4>
              <p className="font-sans text-xs text-[#74777F]">
                Instant priority notice dispatched to Sovereign Mailbox and verified SMS on trades &gt; 10,000 ARTH.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={highValueAlerts}
              onChange={(e) => setHighValueAlerts(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A5F]"></div>
          </label>
        </div>

        {/* Item 4: Session Inactivity Timeout */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center">
              <Timer className="w-4 h-4" />
            </div>
            <div className="max-w-xs sm:max-w-sm">
              <h4 className="font-serif text-sm font-bold text-[#022448]">
                Session Inactivity Auto-Lock
              </h4>
              <p className="font-sans text-xs text-[#74777F]">
                Automatically locks the cockpit and requires GOV password upon idle duration.
              </p>
            </div>
          </div>

          <select
            value={autoLockTimeout}
            onChange={(e) => setAutoLockTimeout(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#74777F]/30 bg-[#F8F9FF] text-xs font-mono text-[#121C28] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
          >
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="240">4 Hours</option>
          </select>
        </div>

        {/* Item 5: Domestic Geofencing */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-xs flex items-center justify-between md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#022448]">
                Domestic Node Geofencing (IN Sovereign Boundary)
              </h4>
              <p className="font-sans text-xs text-[#74777F]">
                Drop non-domestic IP connections immediately unless accompanied by an authenticated travel passkey.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={geoFencing}
              onChange={(e) => setGeoFencing(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A5F]"></div>
          </label>
        </div>
      </div>
    </section>
  );
};
