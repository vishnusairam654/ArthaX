'use client';

import React, { useState, useEffect } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { BanksExecutiveHeader } from '@/components/user/banks/BanksExecutiveHeader';
import { MemberBanksGrid } from '@/components/user/banks/MemberBanksGrid';
import { SelectedBankNodeDetail } from '@/components/user/banks/SelectedBankNodeDetail';
import { AccountInspectorPanel } from '@/components/user/banks/AccountInspectorPanel';
import { BankNodeModal } from '@/components/user/banks/BankNodeModal';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';
import { apiFetchUserAccounts } from '@/lib/api';
import { BankAccountDto } from '@arthax/types';

export default function MyBanksAndAccountsPage() {
  // Balance privacy mask state per Rule 15
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [selectedBank, setSelectedBank] = useState<string>('nava');
  const [selectedAccount, setSelectedAccount] = useState<string>('ARTH-9021-001');
  const [accounts, setAccounts] = useState<BankAccountDto[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('+ Link New Bank Node');

  const loadAccounts = async () => {
    try {
      const userAccounts = await apiFetchUserAccounts();
      if (userAccounts && userAccounts.length > 0) {
        setAccounts(userAccounts);
        const matching = userAccounts.find((a) => a.bankId.toLowerCase() === selectedBank.toLowerCase());
        if (matching) {
          setSelectedAccount(matching.accountNumber);
        }
      }
    } catch {
      // Handled via fallback
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [selectedBank]);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const handleOpenLinkModal = () => {
    setModalTitle('+ Link New Bank Node');
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setModalTitle('Open New Ledger Account');
    setIsModalOpen(true);
  };

  const handleSelectBank = (bankId: string) => {
    setSelectedBank(bankId);
    const matching = accounts.find((a) => a.bankId.toLowerCase() === bankId.toLowerCase());
    if (matching) {
      setSelectedAccount(matching.accountNumber);
    } else {
      if (bankId === 'nava') setSelectedAccount('ARTH-9021-001');
      else if (bankId === 'samaya') setSelectedAccount('ARTH-4412-001');
      else if (bankId === 'setu') setSelectedAccount('ARTH-8831-001');
      else if (bankId === 'sthira') setSelectedAccount('ARTH-1190-001');
      else if (bankId === 'vayu') setSelectedAccount('ARTH-7740-001');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header with Active Tab Highlight */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={handleToggleMask}
        activeTab="my-banks-and-accounts"
      />

      {/* 2. Main Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Executive Header & Aggregated Banking Liquidity Shelf */}
          <BanksExecutiveHeader 
            isMasked={isMasked}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenLinkModal={handleOpenLinkModal}
          />

          {/* Connected Member Banks Selector Bar */}
          <MemberBanksGrid 
            isMasked={isMasked}
            selectedBank={selectedBank}
            onSelectBank={handleSelectBank}
          />

          {/* Selected Bank Focus & Detailed Accounts Pane (8 cols + 4 cols) */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <SelectedBankNodeDetail 
              selectedBank={selectedBank}
              selectedAccount={selectedAccount}
              onSelectAccount={setSelectedAccount}
              isMasked={isMasked}
              onInspectLedger={(accId) => setSelectedAccount(accId)}
            />

            <AccountInspectorPanel 
              selectedAccount={selectedAccount}
              selectedBank={selectedBank}
              isMasked={isMasked}
            />
          </section>
        </div>
      </main>

      {/* 3. Interactive Bank Node Modal */}
      <BankNodeModal 
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAccounts}
      />

      {/* 4. Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
