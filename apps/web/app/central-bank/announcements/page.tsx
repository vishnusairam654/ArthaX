'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Mail,
  Send,
  Building2,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  X,
  FileText,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import {
  MOCK_ANNOUNCEMENTS,
  OfficialAnnouncement,
  AnnouncementAudience,
  AnnouncementStatus,
} from '@/components/central-bank/CentralBankMockData';

export default function CentralBankAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<OfficialAnnouncement[]>(MOCK_ANNOUNCEMENTS);
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<OfficialAnnouncement | null>(null);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Composer Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<OfficialAnnouncement['category']>('Monetary Policy');
  const [newAudience, setNewAudience] = useState<AnnouncementAudience>('All Citizens (User Mailbox)');
  const [newPriority, setNewPriority] = useState<OfficialAnnouncement['priority']>('Normal');
  const [newSummary, setNewSummary] = useState('');
  const [newBody, setNewBody] = useState('');

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesAudience = audienceFilter === 'all' || ann.audience === audienceFilter;
    const matchesSearch =
      !searchQuery ||
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAudience && matchesSearch;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBody) return;

    const created: OfficialAnnouncement = {
      id: `ANN-2026-${(announcements.length + 42).toString().padStart(3, '0')}`,
      title: newTitle,
      category: newCategory,
      audience: newAudience,
      status: 'Published',
      publishedAt: '2026-09-08 17:30:00 (Just Now)',
      authorCouncil: 'Central Bank Executive Directorate',
      summary: newSummary || newTitle,
      fullBody: newBody,
      reachesCitizenMailbox: newAudience === 'All Citizens (User Mailbox)',
      priority: newPriority,
    };

    setAnnouncements([created, ...announcements]);
    setIsComposerOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewBody('');

    setDispatchNotice(
      `Official Announcement "${created.id}" broadcasted to ${created.audience}. ${
        created.reachesCitizenMailbox
          ? 'Synchronized with Citizen Mailboxes at /user/mailbox.'
          : 'Restricted administrative dispatch.'
      }`
    );
    setTimeout(() => setDispatchNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              OFFICIAL REGULATORY BROADCAST
            </span>
            <span className="text-[11px] text-emerald-700 font-mono font-bold">
              • CITIZEN MAILBOX INTERCONNECT
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Central Bank Announcements &amp; Gazettes
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Statutory bulletins, emergency notices, monetary policy adjustments, and targeted circulars. Public announcements automatically synchronize with citizen mailboxes at <code className="text-[#946726] font-mono font-bold">/user/mailbox</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsComposerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Broadcast Notice</span>
        </button>
      </div>

      {dispatchNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{dispatchNotice}</span>
        </div>
      )}

      {/* Target Audience Filter Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {[
            'all',
            'All Citizens (User Mailbox)',
            'Commercial Banks Only',
            'Exchange Participants',
            'Public Gazette',
          ].map((aud) => (
            <button
              key={aud}
              type="button"
              onClick={() => setAudienceFilter(aud)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                audienceFilter === aud
                  ? 'bg-[#946726] text-white shadow-xs'
                  : 'text-[#5C574F] hover:text-[#946726] bg-[#F6F8F7]'
              }`}
            >
              {aud === 'all'
                ? 'All Audiences'
                : aud === 'All Citizens (User Mailbox)'
                ? 'Citizen Mailbox'
                : aud}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bulletins, titles..."
            className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full md:w-64"
          />
        </div>
      </div>

      {/* Announcements Stream List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((item) => {
          const isEmergency = item.priority === 'Emergency';
          const isHigh = item.priority === 'High';
          const reachesMailbox = item.reachesCitizenMailbox;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs hover:border-[#946726]/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isEmergency
                  ? 'border-[#B5482E]/40'
                  : isHigh
                  ? 'border-amber-300'
                  : 'border-[#946726]/15'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                  <span className="font-bold text-[#946726]">{item.id}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#946726]/8 text-[#946726] font-bold">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold border ${
                      reachesMailbox
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-blue-50 text-[#946726] border-blue-200'
                    }`}
                  >
                    Target: {item.audience}
                  </span>
                  <span className="text-[#74777F]">• Published {item.publishedAt}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#2A2012]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5C574F] leading-relaxed max-w-3xl">
                  {item.summary}
                </p>

                <div className="flex items-center gap-4 text-[11px] font-mono text-[#74777F] pt-1">
                  <span>Origin: <strong className="text-[#2A2012] font-sans">{item.authorCouncil}</strong></span>
                  {reachesMailbox && (
                    <span className="text-purple-700 flex items-center gap-1 font-semibold">
                      <Mail className="w-3 h-3" />
                      Broadcast to /user/mailbox
                    </span>
                  )}
                </div>
              </div>

              <div className="self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedAnnouncement(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#946726]/10 hover:bg-[#946726] text-[#946726] hover:text-white transition text-xs font-bold cursor-pointer"
                >
                  Read Bulletin
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulletin Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  OFFICIAL GAZETTE DISPATCH
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {selectedAnnouncement.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans bg-[#FDFBF7] overflow-y-auto">
              <div>
                <h4 className="font-serif font-bold text-base text-[#2A2012]">
                  {selectedAnnouncement.title}
                </h4>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[#74777F] mt-1">
                  <span>{selectedAnnouncement.category}</span>
                  <span>•</span>
                  <span>Audience: {selectedAnnouncement.audience}</span>
                  <span>•</span>
                  <span>Date: {selectedAnnouncement.publishedAt}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 space-y-2 leading-relaxed text-xs text-[#262320] shadow-xs">
                <p>{selectedAnnouncement.fullBody}</p>
              </div>

              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#946726]/10 font-mono text-[11px] text-[#5C574F]">
                Issued by Authority of: <strong>{selectedAnnouncement.authorCouncil}</strong>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-4 py-2 rounded-xl bg-[#946726] text-white text-xs font-bold cursor-pointer"
                >
                  Close Bulletin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  OFFICIAL COMMUNICATIONS CONSOLE
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Compose Regulatory Announcement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4 text-xs font-sans bg-[#FDFBF7]">
              <div>
                <label className="block font-bold text-[#946726] mb-1">
                  Bulletin Title <span className="text-[#B5482E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Directive #26-43: Enhanced Liquidity Protocol"
                  className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#946726] mb-1">Target Audience</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none font-sans"
                  >
                    <option value="All Citizens (User Mailbox)">All Citizens (User Mailbox)</option>
                    <option value="Commercial Banks Only">Commercial Banks Only</option>
                    <option value="Exchange Participants">Exchange Participants</option>
                    <option value="Public Gazette">Public Gazette</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#946726] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none font-sans"
                  >
                    <option value="Monetary Policy">Monetary Policy</option>
                    <option value="Tax Directive">Tax Directive</option>
                    <option value="Emergency Notice">Emergency Notice</option>
                    <option value="Routine Update">Routine Update</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#946726] mb-1">Executive Summary</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Brief 1-sentence synopsis for mailbox headers..."
                  className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#946726] mb-1">
                  Full Regulatory Body Text <span className="text-[#B5482E]">*</span>
                </label>
                <textarea
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Official decree text, terms, and statutory enforcement dates..."
                  className="w-full h-28 p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-900 leading-snug">
                <strong>Citizen Mailbox Integration:</strong> Bulletins marked for citizens will immediately appear in citizen inboxes under <code>/user/mailbox</code> with statutory authentication badge.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 text-[#74777F] hover:text-[#262320]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#946726] hover:bg-[#2A2012] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Official Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
