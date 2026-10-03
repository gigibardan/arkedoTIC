import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShopCategory,
  ShopItem,
  StudentInventory,
  EquippedItems,
} from '../../types';
import {
  SHOP_ITEMS,
  DEFAULT_EQUIPPED,
  DEFAULT_INVENTORY,
  getCollectorRank,
} from '../../lib/shopCatalog';
import {
  getByteCoins,
  buyShopItem,
  equipShopItem,
  getStudentInventory,
  getEquippedItems,
  openMysteryChest,
} from '../../lib/studentAuthService';
import {
  X,
  ShoppingBag,
  Sparkles,
  Trophy,
  Check,
  Lock,
  Package,
  Gift,
  Coins,
  Palette,
  Bot,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';

interface CyberShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentAvatar?: string;
  onCoinsUpdated?: (newCoins: number) => void;
}

type ModalTab = 'shop' | 'inventory' | 'chests';

export const CyberShopModal: React.FC<CyberShopModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Elev TIC',
  studentAvatar = '🎓',
  onCoinsUpdated,
}) => {
  const { lang } = useLanguage();
  const { equipped, updateEquippedItem } = useTheme();

  const [activeTab, setActiveTab] = useState<ModalTab>('shop');
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'all'>('all');
  const [coins, setCoins] = useState<number>(() => getByteCoins());
  const [inventory, setInventory] = useState<StudentInventory>(() => getStudentInventory());
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Chest opener state
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [chestReward, setChestReward] = useState<{ item?: ShopItem; bonusCoins?: number } | null>(null);

  // Refresh coins and inventory when opening
  useEffect(() => {
    if (isOpen) {
      const currentC = getByteCoins();
      setCoins(currentC);
      setInventory(getStudentInventory());
      setFeedbackMsg(null);
      setChestReward(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBuy = async (item: ShopItem) => {
    setFeedbackMsg(null);
    const res = await buyShopItem(item.id);
    if (res.success && res.updatedCoins !== undefined && res.inventory) {
      setCoins(res.updatedCoins);
      setInventory(res.inventory);
      onCoinsUpdated?.(res.updatedCoins);
      setFeedbackMsg({
        type: 'success',
        text: lang === 'en'
          ? `🎉 Purchased ${item.nameEn}! Equipped item or find it in your Backpack.`
          : `🎉 Ai cumpărat ${item.nameRo}! Îl poți echipa acum din Inventar.`,
      });
      // Automatically equip newly purchased cosmetic item
      updateEquippedItem(item.category, item.id);
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || (lang === 'en' ? 'Purchase failed.' : 'Achiziția a eșuat.'),
      });
    }
  };

  const handleEquip = async (item: ShopItem) => {
    setFeedbackMsg(null);
    updateEquippedItem(item.category, item.id);
    await equipShopItem(item.category, item.id);
    setFeedbackMsg({
      type: 'success',
      text: lang === 'en' ? `✓ Equipped ${item.nameEn}!` : `✓ Ai echipat ${item.nameRo}!`,
    });
  };

  const handleOpenChest = async () => {
    if (isOpeningChest) return;
    setIsOpeningChest(true);
    setChestReward(null);
    setFeedbackMsg(null);

    setTimeout(async () => {
      const res = await openMysteryChest();
      setIsOpeningChest(false);
      if (res.success) {
        setChestReward({ item: res.item, bonusCoins: res.bonusCoins });
        const updatedC = getByteCoins();
        setCoins(updatedC);
        setInventory(getStudentInventory());
        onCoinsUpdated?.(updatedC);
        if (res.item) {
          updateEquippedItem(res.item.category, res.item.id);
        }
      }
    }, 1200);
  };

  const isItemOwned = (itemId: string) => {
    return inventory.ownedItemIds.includes(itemId);
  };

  const isItemEquipped = (item: ShopItem) => {
    if (item.category === 'arky_skin') {
      return equipped.arkySkin === item.id.replace('skin_', '');
    }
    if (item.category === 'theme') {
      return equipped.theme === item.id.replace('theme_', '');
    }
    if (item.category === 'title') {
      return equipped.title === item.id.replace('title_', '');
    }
    if (item.category === 'avatar_frame') {
      return equipped.avatarFrame === item.id.replace('frame_', '');
    }
    return false;
  };

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const ownedItemsList = SHOP_ITEMS.filter((item) => inventory.ownedItemIds.includes(item.id));
  const collectorRank = getCollectorRank(inventory.ownedItemIds.length);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'epic':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'rare':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative">
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg text-2xl">
              🛍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/40">
                  ARKYEDU CYBER LAB
                </span>
                <span className={`text-xs font-mono font-bold ${collectorRank.color}`}>
                  {collectorRank.icon} {lang === 'en' ? collectorRank.nameEn : collectorRank.nameRo}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                {lang === 'en' ? 'Cyber Shop & Inventory' : 'Magazin Cyber & Inventar Elev'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Byte-Coins Badge */}
            <div className="flex items-center gap-2 bg-slate-950/90 border-2 border-amber-500/50 px-4 py-2 rounded-2xl shadow-inner font-mono">
              <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">B-Coins</div>
                <div className="text-base font-black text-amber-300">{coins} 🪙</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Închide Magazinul"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 border-b border-slate-800">
          <button
            onClick={() => {
              setActiveTab('shop');
              setFeedbackMsg(null);
            }}
            className={`py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'en' ? 'Cyber Shop' : 'Magazin Cyber'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('inventory');
              setFeedbackMsg(null);
            }}
            className={`py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>
              {lang === 'en' ? `Backpack (${ownedItemsList.length})` : `Inventar & Echipare (${ownedItemsList.length})`}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('chests');
              setFeedbackMsg(null);
            }}
            className={`py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'chests'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{lang === 'en' ? 'Mystery Chests' : 'Cufere Misterioase'}</span>
          </button>
        </div>

        {/* Feedback notification banner */}
        {feedbackMsg && (
          <div
            className={`mx-5 mt-4 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-slideDown ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500 text-rose-200'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* ==================== TAB 1: CYBER SHOP ==================== */}
        {activeTab === 'shop' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', labelRo: 'Toate Obiectele', labelEn: 'All Items', icon: '✨' },
                { id: 'arky_skin', labelRo: 'Garderoba Arky', labelEn: 'Arky Skins', icon: '🤖' },
                { id: 'theme', labelRo: 'Teme Interfață', labelEn: 'UI Themes', icon: '🎨' },
                { id: 'avatar_frame', labelRo: 'Rame Avatar', labelEn: 'Avatar Frames', icon: '👑' },
                { id: 'title', labelRo: 'Titluri Onorifice', labelEn: 'Honor Titles', icon: '🏷️' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === 'en' ? cat.labelEn : cat.labelRo}</span>
                </button>
              ))}
            </div>

            {/* Shop Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const owned = isItemOwned(item.id);
                const isEquipped = isItemEquipped(item);
                const canAfford = coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`bg-slate-950/80 border-2 rounded-2xl p-4 flex flex-col justify-between gap-3.5 transition group hover:-translate-y-0.5 ${
                      isEquipped
                        ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                        : owned
                        ? 'border-indigo-500/40'
                        : 'border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon & Rarity */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow group-hover:scale-105 transition-transform">
                          {item.icon}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getRarityBadge(
                              item.rarity
                            )}`}
                          >
                            {item.rarity}
                          </span>
                          {item.badgeLabel && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-pink-500/20 text-pink-300 border border-pink-500/40">
                              {item.badgeLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Name & Desc */}
                      <h4 className="text-sm font-black text-white font-heading">
                        {lang === 'en' ? item.nameEn : item.nameRo}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {lang === 'en' ? item.descEn : item.descRo}
                      </p>

                      {/* Required Module tag (if any) */}
                      {item.requiredModule && (
                        <div className="mt-2 text-[10px] text-amber-400 font-mono font-semibold flex items-center gap-1">
                          <span>🔒 Deblocabil după modulul: {item.requiredModule.toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="font-mono text-xs font-black text-amber-300 flex items-center gap-1">
                        {item.price === 0 ? (
                          <span className="text-emerald-400">GRATUIT</span>
                        ) : (
                          <>
                            <span>{item.price}</span>
                            <span>🪙</span>
                          </>
                        )}
                      </div>

                      {isEquipped ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Echipat</span>
                        </span>
                      ) : owned ? (
                        <button
                          onClick={() => handleEquip(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer active:scale-95"
                        >
                          Echipează
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md shadow-orange-500/20'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <span>{canAfford ? 'Cumpără' : 'B-Coins ?'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: INVENTORY & WARDROBE ==================== */}
        {activeTab === 'inventory' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col lg:flex-row gap-6">
            {/* Live Equipped Preview (Left - 5 cols) */}
            <div className="lg:w-72 bg-slate-950/90 border-2 border-indigo-500/30 rounded-3xl p-5 flex flex-col items-center justify-between gap-4 text-center shrink-0">
              <div className="w-full">
                <div className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider mb-3">
                  Previzualizare Profil & Arky
                </div>

                {/* Avatar with Equipped Frame */}
                <div className="relative inline-block mb-3">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-4xl shadow-xl transition-all ${
                      equipped.avatarFrame === 'fire'
                        ? 'ring-4 ring-amber-500 shadow-xl shadow-orange-500/50'
                        : equipped.avatarFrame === 'neon'
                        ? 'ring-4 ring-cyan-400 shadow-lg shadow-cyan-500/40'
                        : equipped.avatarFrame === 'gold'
                        ? 'ring-4 ring-amber-300 shadow-xl shadow-amber-400/60'
                        : equipped.avatarFrame === 'diamond'
                        ? 'ring-4 ring-sky-300 shadow-2xl shadow-cyan-400/80'
                        : equipped.avatarFrame === 'emerald'
                        ? 'ring-4 ring-emerald-400 shadow-lg shadow-emerald-500/40'
                        : ''
                    }`}
                  >
                    {studentAvatar}
                  </div>
                  {equipped.avatarFrame !== 'none' && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400/60 text-[9px] font-mono font-bold text-amber-300 whitespace-nowrap">
                      {equipped.avatarFrame.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="font-black text-white text-base font-heading">{studentName}</div>

                {/* Equipped Title */}
                {equipped.title ? (
                  <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                    🏷️ {SHOP_ITEMS.find((i) => i.id === `title_${equipped.title}`)?.nameRo || equipped.title}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-mono mt-1">Fără titlu echipat</div>
                )}
              </div>

              {/* Equipped Arky Costume Summary */}
              <div className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs font-mono">
                <div className="text-slate-400 text-[10px] mb-1">COSTUM MASCOTĂ ARKY:</div>
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>🤖</span>
                  <span>{SHOP_ITEMS.find((i) => i.id === `skin_${equipped.arkySkin}`)?.nameRo || 'Arky Clasic'}</span>
                </div>
                <div className="text-slate-400 text-[10px] mt-2 mb-1">TEMĂ ACTIVĂ:</div>
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <span>🎨</span>
                  <span>{SHOP_ITEMS.find((i) => i.id === `theme_${equipped.theme}`)?.nameRo || 'Cyber Slate'}</span>
                </div>
              </div>

              {/* Collector Stats */}
              <div className="w-full text-xs font-mono text-slate-400">
                Colecție: <strong className="text-white">{ownedItemsList.length} / {SHOP_ITEMS.length}</strong> obiecte
              </div>
            </div>

            {/* Owned Items Library (Right) */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-base font-black text-white font-heading">
                {lang === 'en' ? 'Your Backpack & Owned Cosmetics' : 'Rucsacul Tău & Obiecte Deținute'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ownedItemsList.map((item) => {
                  const isEquipped = isItemEquipped(item);
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border-2 bg-slate-950/70 flex items-center justify-between gap-3 ${
                        isEquipped ? 'border-emerald-500' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? item.nameEn : item.nameRo}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.category.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {isEquipped ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
                          ✓ Echipat
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEquip(item)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition cursor-pointer"
                        >
                          Echipează
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: MYSTERY CHESTS ==================== */}
        {activeTab === 'chests' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-center text-center gap-6">
            <div className="relative">
              <div
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 border-4 border-amber-300 flex items-center justify-center text-6xl sm:text-7xl shadow-2xl shadow-orange-500/40 cursor-pointer transition transform active:scale-95 ${
                  isOpeningChest ? 'animate-bounce scale-110' : 'hover:scale-105 animate-float'
                }`}
                onClick={handleOpenChest}
              >
                🎁
              </div>
            </div>

            <div className="max-w-md">
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                {lang === 'en' ? 'Open Mystery Chest of Knowledge' : 'Deschide Cufărul Misterios al Cunoașterii!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {lang === 'en'
                  ? 'Mystery chests drop rare Arky skins, animated frames, and bonus Byte-Coins! Every completed textbook module awards a free chest.'
                  : 'Cuferele pot conține accesorii rare pentru Arky, rame spectaculoase sau bonusuri generoase de B-Coins! Fiecare modul finalizat din manual deblochează cufere gratuite.'}
              </p>
            </div>

            {/* Opened reward display */}
            {chestReward && (
              <div className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-400/80 shadow-2xl animate-scaleUp max-w-sm w-full">
                <div className="text-xs font-mono text-amber-400 font-bold uppercase mb-1">
                  🎉 Recompensă Deblocată!
                </div>
                {chestReward.item ? (
                  <div className="flex items-center gap-3 justify-center mt-2">
                    <span className="text-3xl">{chestReward.item.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-black text-white font-heading">
                        {lang === 'en' ? chestReward.item.nameEn : chestReward.item.nameRo}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold">
                        {chestReward.item.rarity.toUpperCase()} • ECHIPAT AUTOMAT!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-lg font-black text-amber-300 font-mono mt-1">
                    +{chestReward.bonusCoins} 🪙 Byte-Coins!
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleOpenChest}
              disabled={isOpeningChest}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-black text-base transition flex items-center gap-2.5 shadow-xl shadow-orange-500/30 cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isOpeningChest ? 'Se deschide...' : 'Deschide Cufăr Gratuit!'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
