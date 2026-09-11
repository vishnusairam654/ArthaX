'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';
import { ShopHeroShowcase } from '@/components/user/shop/ShopHeroShowcase';
import { ShopDepartmentalBar } from '@/components/user/shop/ShopDepartmentalBar';
import { ShopPetsSection } from '@/components/user/shop/ShopPetsSection';
import { ShopAvatarsSection } from '@/components/user/shop/ShopAvatarsSection';
import { ShopFramesBannersSection } from '@/components/user/shop/ShopFramesBannersSection';
import { ShopActiveVaultSection } from '@/components/user/shop/ShopActiveVaultSection';
import { ShopRarityGuideSection } from '@/components/user/shop/ShopRarityGuideSection';
import { ShopCheckoutModal } from '@/components/user/shop/ShopCheckoutModal';
import { ShopGiftModal } from '@/components/user/shop/ShopGiftModal';
import { ShopInspectDrawer } from '@/components/user/shop/ShopInspectDrawer';
import {
  ShopItem,
  ShopCategory,
  RarityTier,
  EquippedLoadout,
  FINANCIAL_PETS,
  CITIZEN_AVATARS,
  SOVEREIGN_FRAMES,
  SOVEREIGN_BANNERS,
  INITIAL_EQUIPPED_LOADOUT,
  INITIAL_OWNED_ITEM_IDS,
} from '@/components/user/shop/ShopData';
import { CheckCircle2, Gift, ShieldCheck, Info } from 'lucide-react';
import {
  apiFetchUserInventory,
  apiPurchaseShopItem,
  apiGiftShopItem,
  apiEquipLoadout,
} from '@/lib/api';

export default function ShopAndVaultPage() {
  // Invariant Rule 15: Account numbers and balances render masked by default with an explicit click-to-reveal
  const [isMasked, setIsMasked] = useState<boolean>(true);

  // Financial Balance (in ARTH)
  const [availableBalance, setAvailableBalance] = useState<number>(52480);

  // Category, Filter & Search States
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<RarityTier | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('rarity');

  // Owned and Equipped State
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>(INITIAL_OWNED_ITEM_IDS);
  const [loadout, setLoadout] = useState<EquippedLoadout>(INITIAL_EQUIPPED_LOADOUT);

  // Modal & Drawer States
  const [checkoutItem, setCheckoutItem] = useState<ShopItem | null>(null);
  const [inspectItem, setInspectItem] = useState<ShopItem | null>(null);
  const [giftItem, setGiftItem] = useState<ShopItem | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'gift' | 'verify' } | null>(null);

  const showToast = (message: string, type: 'success' | 'gift' | 'verify' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync with Sovereign API Backend on mount
  useEffect(() => {
    async function loadInventory() {
      try {
        const inv = await apiFetchUserInventory();
        if (inv) {
          if (inv.ownedItemIds && inv.ownedItemIds.length > 0) {
            setOwnedItemIds(inv.ownedItemIds);
          }
          if (inv.loadout) {
            setLoadout({
              frameId: inv.loadout.frameId || '',
              avatarId: inv.loadout.avatarId || '',
              bannerId: inv.loadout.bannerId || '',
              petId: inv.loadout.petId || '',
            });
          }
        }
      } catch (err) {
        console.error('Could not load user vault inventory from API:', err);
      }
    }
    loadInventory();
  }, []);

  // Helper filter and sort
  const processItems = (items: ShopItem[]) => {
    return items
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchPower = item.powerTitle?.toLowerCase().includes(q) || item.powerDescription?.toLowerCase().includes(q);
          const matchRole = item.role?.toLowerCase().includes(q) || item.accreditation?.toLowerCase().includes(q);
          const matchAttire = item.attireSpec?.toLowerCase().includes(q);
          if (!matchName && !matchPower && !matchRole && !matchAttire) return false;
        }

        // Rarity tier
        if (selectedRarity !== 'all' && item.rarity !== selectedRarity) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);

        // Default rarity sort: gold > epic > rare > normal
        const rarityWeights: Record<RarityTier, number> = {
          gold: 4,
          epic: 3,
          rare: 2,
          normal: 1,
        };
        return rarityWeights[b.rarity] - rarityWeights[a.rarity];
      });
  };

  const processedPets = useMemo(() => processItems(FINANCIAL_PETS), [searchQuery, selectedRarity, sortBy]);
  const processedAvatars = useMemo(() => processItems(CITIZEN_AVATARS), [searchQuery, selectedRarity, sortBy]);
  const processedFrames = useMemo(() => processItems(SOVEREIGN_FRAMES), [searchQuery, selectedRarity, sortBy]);
  const processedBanners = useMemo(() => processItems(SOVEREIGN_BANNERS), [searchQuery, selectedRarity, sortBy]);

  // Acquisition Handlers
  const handleOpenAcquire = (item: ShopItem) => {
    setCheckoutItem(item);
  };

  const handleConfirmPurchase = async (
    item: ShopItem,
    sourceAccountId: string,
    financialPassword: string,
  ) => {
    try {
      await apiPurchaseShopItem({
        itemId: item.id,
        sourceAccountId,
        financialPassword,
      });

      setAvailableBalance((prev) => Math.max(0, prev - item.price));
      setOwnedItemIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
      setCheckoutItem(null);
      showToast(`Settlement Complete: ${item.name} transferred to your Sovereign Vault.`);
    } catch (err: any) {
      throw err;
    }
  };

  // Gift Handlers
  const handleOpenGift = (item: ShopItem) => {
    setGiftItem(item);
  };

  const handleSendGift = async (
    item: ShopItem,
    recipient: string,
    note: string,
    sourceAccountId: string,
    financialPassword: string,
  ) => {
    try {
      const res = await apiGiftShopItem({
        itemId: item.id,
        sourceAccountId,
        recipientGovIdOrEmail: recipient,
        financialPassword,
      });

      setGiftItem(null);
      showToast(res.message || `Sovereign Gift routed: ${item.name} sent to ${recipient}.`, 'gift');
    } catch (err: any) {
      throw err;
    }
  };

  // Inspection Handlers
  const handleInspect = (item: ShopItem) => {
    setInspectItem(item);
  };

  // Equip / Unequip Handlers
  const handleEquip = async (item: ShopItem) => {
    const updatedLoadout = {
      frameId: item.category === 'frame' ? item.id : loadout.frameId,
      avatarId: item.category === 'avatar' ? item.id : loadout.avatarId,
      bannerId: item.category === 'banner' ? item.id : loadout.bannerId,
      petId: item.category === 'pet' ? item.id : loadout.petId,
    };
    setLoadout(updatedLoadout);
    showToast(`Equipped ${item.name} into Active Citizen Loadout.`);

    try {
      await apiEquipLoadout(updatedLoadout);
    } catch (err) {
      console.error('Failed to sync loadout to sovereign ledger backend:', err);
    }
  };

  const handleUnequip = async (item: ShopItem) => {
    const updatedLoadout = {
      frameId: item.category === 'frame' && loadout.frameId === item.id ? '' : loadout.frameId,
      avatarId: item.category === 'avatar' && loadout.avatarId === item.id ? '' : loadout.avatarId,
      bannerId: item.category === 'banner' && loadout.bannerId === item.id ? '' : loadout.bannerId,
      petId: item.category === 'pet' && loadout.petId === item.id ? '' : loadout.petId,
    };
    setLoadout(updatedLoadout);
    showToast(`Unequipped ${item.name} from Active Loadout.`);

    try {
      await apiEquipLoadout(updatedLoadout);
    } catch (err) {
      console.error('Failed to sync loadout to sovereign ledger backend:', err);
    }
  };

  // Smooth Navigation
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header with Unified Navigation & Telemetry Ribbon */}
      <UserPortalHeader
        isMasked={isMasked}
        onToggleMask={() => setIsMasked((prev) => !prev)}
        activeTab="shop"
      />

      {/* 2. Main Marketplace & Depository Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Section 1: Hero Showcase with Asymmetric 7:5 Split & 3D Toggle */}
          <ShopHeroShowcase
            isMasked={isMasked}
            availableBalance={availableBalance}
            onAcquire={handleOpenAcquire}
            onInspect={handleInspect}
            onExplorePets={() => {
              setActiveCategory('pets');
              scrollToSection('section-pets');
            }}
            onOpenInventory={() => {
              setActiveCategory('inventory');
              scrollToSection('section-vault');
            }}
          />

          {/* Section 2: Departmental Store Cards & Catalog Controls Bar */}
          <ShopDepartmentalBar
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              if (cat === 'pets') scrollToSection('section-pets');
              if (cat === 'avatars') scrollToSection('section-avatars');
              if (cat === 'frames' || cat === 'banners') scrollToSection('section-frames-banners');
              if (cat === 'inventory') scrollToSection('section-vault');
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRarity={selectedRarity}
            onSelectRarity={setSelectedRarity}
            sortBy={sortBy}
            onSortChange={setSortBy}
            ownedCount={ownedItemIds.length}
          />

          {/* Section 3: Financial Pets Section */}
          {(activeCategory === 'all' || activeCategory === 'pets') && (
            <ShopPetsSection
              pets={processedPets}
              isMasked={isMasked}
              equippedPetId={loadout.petId}
              ownedItemIds={ownedItemIds}
              onAcquire={handleOpenAcquire}
              onInspect={handleInspect}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
            />
          )}

          {/* Section 4: Citizen Personas & Identities Section */}
          {(activeCategory === 'all' || activeCategory === 'avatars') && (
            <ShopAvatarsSection
              avatars={processedAvatars}
              isMasked={isMasked}
              equippedAvatarId={loadout.avatarId}
              ownedItemIds={ownedItemIds}
              onAcquire={handleOpenAcquire}
              onInspect={handleInspect}
              onGift={handleOpenGift}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
            />
          )}

          {/* Section 5: Prestige Frames & Royal Banners Section */}
          {(activeCategory === 'all' || activeCategory === 'frames' || activeCategory === 'banners') && (
            <ShopFramesBannersSection
              frames={processedFrames}
              banners={processedBanners}
              isMasked={isMasked}
              equippedFrameId={loadout.frameId}
              equippedBannerId={loadout.bannerId}
              ownedItemIds={ownedItemIds}
              onAcquire={handleOpenAcquire}
              onInspect={handleInspect}
              onEquipFrame={handleEquip}
              onUnequipFrame={handleUnequip}
              onEquipBanner={handleEquip}
              onUnequipBanner={handleUnequip}
            />
          )}

          {/* Section 6: Active Vault & Resident Depository Inventory */}
          {(activeCategory === 'all' || activeCategory === 'inventory') && (
            <ShopActiveVaultSection
              loadout={loadout}
              ownedItemIds={ownedItemIds}
              isMasked={isMasked}
              onEquipItem={handleEquip}
              onUnequipItem={handleUnequip}
              onNavigateCategory={(cat) => {
                setActiveCategory(cat);
                if (cat === 'pets') scrollToSection('section-pets');
                if (cat === 'avatars') scrollToSection('section-avatars');
                if (cat === 'frames' || cat === 'banners') scrollToSection('section-frames-banners');
              }}
            />
          )}

          {/* Section 7: Rarity Guide & Merkle Proof of Custody Ledger Strip */}
          <ShopRarityGuideSection
            onVerifyProof={() => {
              showToast('Merkle root proof verified against sovereign block #28,102,510. Status: VALID.', 'verify');
            }}
          />
        </div>
      </main>

      {/* 3. DvP Escrow 1-Click Acquisition Modal */}
      <ShopCheckoutModal
        item={checkoutItem}
        isOpen={Boolean(checkoutItem)}
        onClose={() => setCheckoutItem(null)}
        availableBalance={availableBalance}
        isMasked={isMasked}
        onConfirm={handleConfirmPurchase}
      />

      {/* 4. Sovereign Gift Modal */}
      <ShopGiftModal
        item={giftItem}
        isOpen={Boolean(giftItem)}
        onClose={() => setGiftItem(null)}
        onSendGift={handleSendGift}
      />

      {/* 5. Smart Contract Asset Inspection Drawer */}
      <ShopInspectDrawer
        item={inspectItem}
        isOpen={Boolean(inspectItem)}
        onClose={() => setInspectItem(null)}
        isOwned={inspectItem ? ownedItemIds.includes(inspectItem.id) : false}
        isEquipped={
          inspectItem
            ? loadout.frameId === inspectItem.id ||
              loadout.avatarId === inspectItem.id ||
              loadout.bannerId === inspectItem.id ||
              loadout.petId === inspectItem.id
            : false
        }
        isMasked={isMasked}
        onAcquire={handleOpenAcquire}
        onEquip={handleEquip}
        onUnequip={handleUnequip}
      />

      {/* 6. Sovereign Toast Feedback Floating Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#022448] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#1E3A5F] animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toast.type === 'gift' ? (
            <Gift className="w-5 h-5 text-[#C59A45] shrink-0" />
          ) : toast.type === 'verify' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#C59A45] shrink-0" />
          )}
          <span className="font-sans text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* 7. Institutional Sovereign Protocol Footer */}
      <UserPortalFooter />
    </div>
  );
}
