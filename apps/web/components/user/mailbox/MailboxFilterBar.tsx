'use client';

import React from 'react';
import { Search, CheckCheck, Download } from 'lucide-react';

interface MailboxFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onMarkAllRead: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Inbound', count: 18 },
  { id: 'central-bank', label: 'Central Bank & Regulatory', hasAlert: true },
  { id: 'statements', label: 'Bank Statements (6)' },
  { id: 'dvp', label: 'CLS & DvP Receipts (5)' },
  { id: 'security', label: 'Security & Enclave (4)' },
  { id: 'archived', label: 'Archived' },
];

export const MailboxFilterBar: React.FC<MailboxFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onMarkAllRead,
}) => {
  return (
    <div className="w-full bg-white py-3.5 px-4 sm:px-6 rounded-2xl border border-[#74777F]/20 shadow-2xs mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar font-sans text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#022448] text-white shadow-2xs'
                    : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-[#1E3A5F] text-white' : 'bg-[#E5EFFF] text-[#1E3A5F]'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
                {cat.hasAlert && <span className="w-2 h-2 rounded-full bg-[#BA1A1A]" />}
              </button>
            );
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notices, hashes, ISO IDs..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8F9FF] rounded-lg text-xs font-sans border border-[#74777F]/20 text-[#121C28] placeholder:text-[#74777F] focus:outline-hidden focus:border-[#1E3A5F]"
            />
          </div>

          <button
            type="button"
            onClick={onMarkAllRead}
            className="px-3 py-1.5 rounded-lg bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#1E3A5F] text-xs font-medium flex items-center gap-1 shrink-0 transition-colors border border-[#74777F]/15 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark Read</span>
          </button>

          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#1E3A5F] text-xs font-mono flex items-center gap-1 shrink-0 transition-colors border border-[#74777F]/15 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">.audit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
