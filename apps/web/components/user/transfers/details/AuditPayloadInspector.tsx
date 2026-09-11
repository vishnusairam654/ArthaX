'use client';

import React, { useState } from 'react';
import { Code, Eye, EyeOff, Copy, Check, Router } from 'lucide-react';

const RAW_XML = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>ARTHAX-CLS-20250524-890124</MsgId>
      <CreDtTm>2025-05-24T14:18:12.890Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
        <ClrSys>
          <Prtry>ARTHAX-CLS-RTGS</Prtry>
        </ClrSys>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <EndToEndId>SETU-EQ-2025-0814</EndToEndId>
        <TxId>TX-CLS-20250524-890124</TxId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="ARTH">5000.00</IntrBkSttlmAmt>
      <IntrBkSttlmDt>2025-05-24</IntrBkSttlmDt>
      <Dbtr>
        <Nm>Ananya Sharma</Nm>
        <Id>
          <OrgId>
            <Othr>
              <Id>GOV-IN-8491-904</Id>
            </Othr>
          </OrgId>
        </Id>
      </Dbtr>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>NAVACLSIN01</BICFI>
          <Nm>NAVA Commercial Bank</Nm>
        </FinInstnId>
      </DbtrAgt>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>SETUCLRSIN03</BICFI>
          <Nm>SETU Central Settlement</Nm>
        </FinInstnId>
      </CdtrAgt>
      <Cdtr>
        <Nm>NSE Sovereign Custody</Nm>
      </Cdtr>
      <RmtInf>
        <Ustrd>DvP Tranche Settlement - NILA Systems 250 Units</Ustrd>
      </RmtInf>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`;

export const AuditPayloadInspector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_XML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-2xl bg-white border border-[#74777F]/20 p-6 md:p-8 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#74777F]/15">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-[#022448]" />
            <h3 className="font-serif font-semibold text-lg text-[#022448] tracking-tight">
              Audit Payload &amp; Network Telemetry
            </h3>
          </div>
          <p className="font-sans text-xs text-[#43474E]">
            Direct cryptographically sealed ISO 20022 packet inspection and inter-node latency telemetry.
          </p>
        </div>

        {/* Telemetry Pills & Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8F9FF] border border-[#74777F]/15 font-mono text-xs text-[#74777F]">
            <Router className="w-4 h-4 text-[#022448]" />
            <span>
              Node Latency: <strong className="text-[#022448]">12ms</strong> (IN-MUMBAI → SETU-NODE)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E5EFFF] hover:bg-[#D9E3F4] text-[#022448] font-sans font-semibold text-xs transition-colors cursor-pointer border border-[#74777F]/15"
          >
            {isOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isOpen ? 'Hide Raw XML' : 'Inspect Raw pacs.008 XML'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Container */}
      {isOpen && (
        <div className="rounded-xl bg-[#022448] text-white p-5 font-mono text-xs overflow-x-auto relative animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span className="ml-2 font-mono text-[11px] text-[#C8DFDB]">
                pacs.008.001.08_TX890124_FINAL.xml
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[#C8DFDB] hover:text-white transition-colors text-xs font-mono cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Raw XML'}</span>
            </button>
          </div>

          <pre className="text-[#C8DFDB] text-xs leading-relaxed whitespace-pre font-mono">
            {RAW_XML}
          </pre>
        </div>
      )}
    </section>
  );
};
