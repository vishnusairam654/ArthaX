'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { GovHeader } from '@/components/gov/GovHeader';
import { GovLanding } from '@/components/gov/GovLanding';
import { GovEmailStep } from '@/components/gov/GovEmailStep';
import { GovOtpStep } from '@/components/gov/GovOtpStep';
import { GovPasswordStep } from '@/components/gov/GovPasswordStep';
import { GovResultStep } from '@/components/gov/GovResultStep';
import { GovLoginStep } from '@/components/gov/GovLoginStep';
import { GovPassportPreviewCard } from '@/components/gov/GovPassportPreviewCard';
import { GovInvariantSection } from '@/components/gov/GovInvariantSection';
import { GovDualPasswordSection } from '@/components/gov/GovDualPasswordSection';
import { GovEcosystemSection } from '@/components/gov/GovEcosystemSection';
import { GovFaqSection } from '@/components/gov/GovFaqSection';
import { GovFooter } from '@/components/gov/GovFooter';
import { ShieldCheck, Sparkles, Fingerprint } from 'lucide-react';

export type GovStep = 'landing' | 'email' | 'otp' | 'password' | 'result' | 'login';

function generateGovId(): string {
  const a = Math.floor(1000 + Math.random() * 9000);
  const b = Math.floor(1000 + Math.random() * 9000);
  return `GOV-${a}-${b}`;
}

export default function GovPage() {
  const [step, setStep] = useState<GovStep>('landing');
  const [email, setEmail] = useState('citizen@arthax.gov');
  const [govId, setGovId] = useState('');

  // Creation flow handlers
  const handleCreateGovId = useCallback(() => {
    setStep('email');
  }, []);

  const handleSendOtp = useCallback((submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep('otp');
  }, []);

  const handleOtpVerified = useCallback(() => {
    setStep('password');
  }, []);

  const handlePasswordCreated = useCallback(() => {
    const newId = generateGovId();
    setGovId(newId);
    setStep('result');
  }, []);

  // Login flow handler
  const handleSignIn = useCallback(() => {
    setStep('login');
  }, []);

  const handleLoginSuccess = useCallback(
    (loginGovId: string, loginEmail: string) => {
      setGovId(loginGovId);
      setEmail(loginEmail);
      setStep('result');
    },
    []
  );

  // Back handlers
  const handleBackToLanding = useCallback(() => {
    setStep('landing');
  }, []);

  const handleBackToEmail = useCallback(() => {
    setStep('email');
  }, []);

  const handleBackToOtp = useCallback(() => {
    setStep('otp');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F2EFE7] text-[#262320] selection:bg-[#C8DFDB] selection:text-[#1E3A5F]">
      
      {/* 1. Global Sovereign Floating Header */}
      <GovHeader connectedGovId={govId || null} />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        
        {/* Atmosphere & Sovereign Watermark */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#3368A0]/15 via-[#66A3BF]/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#C8DFDB]/35 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -left-20 w-[450px] h-[450px] bg-[#E9D9BE]/30 rounded-full blur-3xl" />
        </div>

        {/* 2. Hero Section & Main Terminal Deck */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Hero Titles */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A5F]/5 border border-[#1E3A5F]/15 text-[#1E3A5F] text-xs font-mono mb-4 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#287A55]" />
              <span className="font-semibold">ARTHAX STATE IDENTITY AUTHORITY</span>
              <span className="text-[#1E3A5F]/40">•</span>
              <span>TREATY 409-C</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#1E3A5F] tracking-tight leading-[1.1] mb-4">
              Government Identity Gateway
            </h1>

            <p className="text-sm sm:text-base text-[#5C574F] leading-relaxed max-w-2xl mx-auto">
              The cryptographic root authority for all ARTHAX sovereign citizens. Verify your email, receive your immutable GOV&nbsp;ID, and unlock unified cross-portal ledger access.
            </p>
          </div>

          {/* 3. Two-Column Interactive Issuance Terminal & Live Passport Plaque */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Form Terminal (7 Cols) */}
            <div className="lg:col-span-7">
              <div 
                className="rounded-[32px] bg-white/95 border border-[#3368A0]/20 p-6 sm:p-9 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                style={{
                  boxShadow: '0 20px 40px -15px rgba(30, 58, 95, 0.08), 0 0 0 1px rgba(51, 104, 160, 0.08)',
                }}
              >
                {/* Top Terminal Accent Hairline */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{
                    background:
                      'linear-gradient(90deg, #1E3A5F 0%, #3368A0 40%, #A8742A 70%, #1E3A5F 100%)',
                  }}
                />

                {/* Step Routing */}
                {step === 'landing' && (
                  <GovLanding
                    onCreateGovId={handleCreateGovId}
                    onSignIn={handleSignIn}
                  />
                )}

                {step === 'email' && (
                  <GovEmailStep
                    onSendOtp={handleSendOtp}
                    onBack={handleBackToLanding}
                  />
                )}

                {step === 'otp' && (
                  <GovOtpStep
                    email={email}
                    onVerify={handleOtpVerified}
                    onBack={handleBackToEmail}
                  />
                )}

                {step === 'password' && (
                  <GovPasswordStep
                    onCreatePassword={handlePasswordCreated}
                    onBack={handleBackToOtp}
                  />
                )}

                {step === 'result' && (
                  <GovResultStep govId={govId} email={email} />
                )}

                {step === 'login' && (
                  <GovLoginStep
                    onBack={handleBackToLanding}
                    onLoginSuccess={handleLoginSuccess}
                  />
                )}
              </div>
            </div>

            {/* Right Column: Dynamic Sovereign Passport Credential Plaque (5 Cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <GovPassportPreviewCard
                email={email}
                govId={govId}
                currentStep={step}
              />
            </div>

          </div>
        </div>

        {/* 4. The 1:1:1 Invariant Architecture Section */}
        <div className="mt-20">
          <GovInvariantSection />
        </div>

        {/* 5. Dual-Password Isolation Protocol Section */}
        <GovDualPasswordSection />

        {/* 6. Unlocked Portal Nodes Ecosystem Section */}
        <GovEcosystemSection />

        {/* 7. Frequently Asked Inquiries Section */}
        <GovFaqSection />

      </main>

      {/* 8. Global Institutional Footer */}
      <GovFooter />

    </div>
  );
}
