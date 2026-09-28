'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Settings,
  Shield,
  KeyRound,
  Users,
  Clock,
  Save,
  CheckCircle2,
  Lock,
  Building2,
  Bell,
  Sliders,
} from 'lucide-react';
import {
  MOCK_CENTRAL_BANK_SETTINGS,
  CentralBankSettingsData,
} from '@/components/central-bank/CentralBankMockData';

export default function CentralBankSettingsPage() {
  const [settings, setSettings] = useState<CentralBankSettingsData>(MOCK_CENTRAL_BANK_SETTINGS);
  const [sessionTimeout, setSessionTimeout] = useState(settings.sessionTimeoutMinutes);
  const [dualPassword, setDualPassword] = useState(settings.dualPasswordEnforced);
  const [stepUpRules, setStepUpRules] = useState(settings.stepUpAuthRequiredForRules);
  const [ipWhitelist, setIpWhitelist] = useState(settings.ipWhitelistEnforced);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings({
      ...settings,
      sessionTimeoutMinutes: sessionTimeout,
      dualPasswordEnforced: dualPassword,
      stepUpAuthRequiredForRules: stepUpRules,
      ipWhitelistEnforced: ipWhitelist,
    });
    setSavedNotice('Administrative preferences and quorum policies saved to central vault.');
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5">
            Bank info, security options, and role permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active</span>
          </span>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Sovereign Institutional Profile */}
        <div className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#946726]/10 pb-3">
            <Building2 className="w-4 h-4 text-[#946726]" />
            <h3 className="font-serif font-bold text-base text-[#2A2012]">
              Bank Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="block text-[#74777F] font-medium mb-1">
                Institution Name
              </label>
              <input
                type="text"
                disabled
                value={settings.institutionName}
                className="w-full p-2.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl font-mono text-[#2A2012] text-xs"
              />
            </div>

            <div>
              <label className="block text-[#74777F] font-medium mb-1">
                Charter ID
              </label>
              <input
                type="text"
                disabled
                value={settings.charterId}
                className="w-full p-2.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl font-mono text-[#2A2012] text-xs"
              />
            </div>

            <div>
              <label className="block text-[#74777F] font-medium mb-1">
                Governor
              </label>
              <input
                type="text"
                disabled
                value={settings.currentGovernor}
                className="w-full p-2.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl font-serif text-[#2A2012] text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[#74777F] font-medium mb-1">
                Deputy Governor
              </label>
              <input
                type="text"
                disabled
                value={settings.deputyGovernor}
                className="w-full p-2.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl font-serif text-[#2A2012] text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* 2. Governance Quorum & Security Policies */}
        <div className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#946726]/10 pb-3">
            <Lock className="w-4 h-4 text-[#946726]" />
            <h3 className="font-serif font-bold text-base text-[#2A2012]">
              Security Policies
            </h3>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#2A2012] font-bold mb-1">
                  Board Signers Required
                </label>
                <div className="p-3 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl font-mono">
                  <strong>5 of 7 Board Signers</strong>
                  <span className="text-[10px] text-[#74777F] block mt-0.5">
                    Required for circuit breaker and currency minting.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#2A2012] font-bold mb-1">
                  Session Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl font-mono outline-none cursor-pointer"
                >
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#946726]/10 cursor-pointer">
                <div>
                  <strong className="text-xs text-[#2A2012] block font-sans">
                    Require Dual Passwords
                  </strong>
                  <span className="text-[11px] text-[#5C574F]">
                    GOV password for login; Financial password for money actions.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={dualPassword}
                  onChange={(e) => setDualPassword(e.target.checked)}
                  className="w-4 h-4 text-[#946726] rounded focus:ring-[#946726]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#946726]/10 cursor-pointer">
                <div>
                  <strong className="text-xs text-[#2A2012] block font-sans">
                    Require Step-Up for Rule Changes
                  </strong>
                  <span className="text-[11px] text-[#5C574F]">
                    Requires secondary password before drafting rules.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={stepUpRules}
                  onChange={(e) => setStepUpRules(e.target.checked)}
                  className="w-4 h-4 text-[#946726] rounded focus:ring-[#946726]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#946726]/10 cursor-pointer">
                <div>
                  <strong className="text-xs text-[#2A2012] block font-sans">
                    Enforce IP Whitelist
                  </strong>
                  <span className="text-[11px] text-[#5C574F]">
                    Block admin logins from outside approved networks.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.checked)}
                  className="w-4 h-4 text-[#946726] rounded focus:ring-[#946726]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 3. Role-Based Access Permissions Matrix */}
        <div className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#946726]/10 pb-3">
            <Users className="w-4 h-4 text-[#946726]" />
            <h3 className="font-serif font-bold text-base text-[#2A2012]">
              Role Permissions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8F9FA] text-[10px] text-[#5C574F] uppercase border-b border-gray-200">
                <tr>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">View Data</th>
                  <th className="p-3 text-center">Supervise Banks</th>
                  <th className="p-3 text-center">Settlement Control</th>
                  <th className="p-3 text-center">Edit Rules</th>
                  <th className="p-3 text-center">Circuit Breaker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 font-bold text-[#2A2012]">Governor</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-emerald-700">✓ (Multi-Sig)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#2A2012]">Deputy Governor</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-gray-300">✗</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#2A2012]">Chief Financial Auditor</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-emerald-700">✓ (Read)</td>
                  <td className="p-3 text-center text-emerald-700">✓ (Read)</td>
                  <td className="p-3 text-center text-gray-300">✗</td>
                  <td className="p-3 text-center text-gray-300">✗</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#2A2012]">CLS Clearing Operator</td>
                  <td className="p-3 text-center text-emerald-700">✓</td>
                  <td className="p-3 text-center text-gray-300">✗</td>
                  <td className="p-3 text-center text-emerald-700">✓ (Queue)</td>
                  <td className="p-3 text-center text-gray-300">✗</td>
                  <td className="p-3 text-center text-gray-300">✗</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold shadow-md transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
