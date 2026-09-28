'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { BanksExecutiveHeader } from '@/components/user/banks/BanksExecutiveHeader';
import { MemberBanksGrid } from '@/components/user/banks/MemberBanksGrid';
import { SelectedBankNodeDetail } from '@/components/user/banks/SelectedBankNodeDetail';
import { AccountInspectorPanel } from '@/components/user/banks/AccountInspectorPanel';
import { BankNodeModal } from '@/components/user/banks/BankNodeModal';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';
import { apiFetchUserAccounts, subscribePortalDataInvalidation } from '@/lib/api';
import { BankAccountDto } from '@arthax/types';

export default function MyBanksAndAccountsPage() {
  // Balance privacy mask state per Rule 15
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [selectedBank, setSelectedBank] = useState<string>('nava');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [accounts, setAccounts] = useState<BankAccountDto[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('+ Link New Bank Node');
  const [modalDefaultBank, setModalDefaultBank] = useState<string>('nava');

  const loadAccounts = useCallback(async () => {
    try {
      const userAccounts = await apiFetchUserAccounts();
      if (Array.isArray(userAccounts) && userAccounts.length > 0) {
        setAccounts(userAccounts);

        // Check if current selectedBank has an account
        const matching = userAccounts.find(
          (a) => a.bankId?.toLowerCase() === selectedBank.toLowerCase(),
        );
        if (matching) {
          setSelectedAccount(matching.accountNumber);
        } else {
          // If selectedBank doesn't have an account, focus on the user's first active bank
          const first = userAccounts[0];
          if (first && first.bankId) {
            setSelectedBank(first.bankId.toLowerCase());
            setSelectedAccount(first.accountNumber);
          }
        }
      } else {
        setAccounts([]);
        setSelectedAccount('');
      }
    } catch {
      setAccounts([]);
      setSelectedAccount('');
    }
  }, [selectedBank]);

  useEffect(() => {
    loadAccounts();
    const unsub = subscribePortalDataInvalidation(loadAccounts);
    return () => unsub();
  }, [loadAccounts]);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const handleOpenLinkModal = () => {
    setModalDefaultBank(selectedBank);
    setModalTitle('+ Link New Bank Node');
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setModalDefaultBank(selectedBank);
    setModalTitle('Open New Ledger Account');
    setIsModalOpen(true);
  };

  const handleOpenCreateModalForBank = (bankId: string) => {
    setModalDefaultBank(bankId);
    setModalTitle(`Open New ${bankId.toUpperCase()} Account`);
    setIsModalOpen(true);
  };

  const handleSelectBank = (bankId: string) => {
    setSelectedBank(bankId);
    const matching = accounts.find((a) => a.bankId?.toLowerCase() === bankId.toLowerCase());
    if (matching) {
      setSelectedAccount(matching.accountNumber);
    } else {
      setSelectedAccount('');
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
            accounts={accounts}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenLinkModal={handleOpenLinkModal}
          />

          {/* Connected Member Banks Selector Bar */}
          <MemberBanksGrid 
            isMasked={isMasked}
            accounts={accounts}
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
              accounts={accounts}
              onOpenAccountModal={handleOpenCreateModalForBank}
            />

            <AccountInspectorPanel 
              selectedAccount={selectedAccount}
              selectedBank={selectedBank}
              accounts={accounts}
              isMasked={isMasked}
            />
          </section>
        </div>
      </main>

      {/* 3. Interactive Bank Node Modal */}
      <BankNodeModal 
        isOpen={isModalOpen}
        title={modalTitle}
        defaultBankId={modalDefaultBank}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAccounts}
      />

      {/* 4. Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
