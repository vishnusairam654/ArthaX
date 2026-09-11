'use client';

import React from 'react';
import { Shield, CheckCircle2, Clock } from 'lucide-react';

export interface MailNoticeItem {
  id: string;
  category: 'central-bank' | 'statements' | 'dvp' | 'security' | 'archived';
  sender: string;
  senderBadge: string;
  tag: string;
  tagType: 'danger' | 'success' | 'secondary' | 'neutral';
  title: string;
  preview: string;
  timestamp: string;
  ref: string;
  isUnread: boolean;
}

interface DispatchFeedListProps {
  notices: MailNoticeItem[];
  selectedId: string;
  onSelectNotice: (id: string) => void;
}

export const DispatchFeedList: React.FC<DispatchFeedListProps> = ({
  notices,
  selectedId,
  onSelectNotice,
}) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between px-2 text-xs font-mono text-[#74777F] font-semibold uppercase tracking-wider">
        <span>Dispatch Feed ({notices.length} Unarchived)</span>
        <span className="text-[#1E3A5F]">Sort: Chronological</span>
      </div>

      <div className="space-y-2.5">
        {notices.map((notice) => {
          const isSelected = notice.id === selectedId;

          return (
            <button
              key={notice.id}
              type="button"
              onClick={() => onSelectNotice(notice.id)}
              className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer space-y-2 border ${
                isSelected
                  ? 'bg-[#E5EFFF] border-[#022448] shadow-md ring-2 ring-[#022448]/20'
                  : notice.isUnread
                  ? 'bg-white border-l-4 border-l-[#022448] border-[#74777F]/20 hover:bg-[#F8F9FF] shadow-2xs'
                  : 'bg-white/80 border-[#74777F]/15 hover:bg-[#F8F9FF] shadow-2xs opacity-90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notice.senderBadge === 'shield' ? (
                    <div className="w-6 h-6 rounded-full bg-[#E5EFFF] text-[#1E3A5F] flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                        isSelected
                          ? 'bg-[#022448] text-[#F9BB6A]'
                          : 'bg-[#1E3A5F] text-white'
                      }`}
                    >
                      {notice.senderBadge}
                    </span>
                  )}
                  <span className="font-serif text-xs font-semibold text-[#121C28]">
                    {notice.sender}
                  </span>
                </div>

                {notice.tagType === 'danger' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFDAD6] text-[#93000A] font-mono text-[10px] font-bold uppercase tracking-wide">
                    {notice.tag}
                  </span>
                )}
                {notice.tagType === 'success' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#C8DFDB] text-[#022448] font-mono text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    {notice.tag}
                  </span>
                )}
                {notice.tagType === 'secondary' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D9E3F4] text-[#1E3A5F] font-mono text-[10px] font-bold uppercase">
                    {notice.tag}
                  </span>
                )}
                {notice.tagType === 'neutral' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F2EFE7] text-[#43474E] font-mono text-[10px] font-medium uppercase">
                    {notice.tag}
                  </span>
                )}
              </div>

              <div
                className={`font-serif text-sm font-medium leading-snug ${
                  isSelected ? 'text-[#022448] font-semibold' : 'text-[#121C28]'
                }`}
              >
                {notice.title}
              </div>

              <p className="font-sans text-xs text-[#43474E] line-clamp-2 leading-relaxed">
                {notice.preview}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#74777F] pt-1 border-t border-[#74777F]/10">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {notice.timestamp}
                </span>
                <span className={isSelected ? 'text-[#022448] font-semibold' : 'text-[#74777F]'}>
                  {notice.ref}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
