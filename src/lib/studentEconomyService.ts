import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, isCloudConnected } from './firebase';
import {
  EquippedItems,
  ShopCategory,
  ShopItem,
  StudentInventory,
  StudentProfile
} from '../types';
import { DEFAULT_EQUIPPED, DEFAULT_INVENTORY, SHOP_ITEMS } from './shopCatalog';
import {
  getActiveStudent,
  saveActiveStudentLocally,
  STUDENTS_COLLECTION
} from './studentCore';

export function getByteCoins(): number {
  const current = getActiveStudent();
  if (current && typeof current.byteCoins === 'number') {
    return current.byteCoins;
  }
  try {
    const saved = localStorage.getItem('arkedo_student_coins') ?? localStorage.getItem('arkedo_byte_coins');
    if (saved) return Number(saved);
  } catch {}
  return 100;
}

export async function addByteCoins(amount: number, _reason?: string): Promise<number> {
  const currentCoins = getByteCoins();
  const nextCoins = Math.max(0, currentCoins + amount);
  try {
    localStorage.setItem('arkedo_student_coins', String(nextCoins));
    localStorage.setItem('arkedo_byte_coins', String(nextCoins));
  } catch {}

  const current = getActiveStudent();
  if (current) {
    const updated: StudentProfile = {
      ...current,
      byteCoins: nextCoins,
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updated);
    if (isCloudConnected && db && current.id) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          byteCoins: nextCoins,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Update coins Firestore:', err);
      }
    }
  }
  return nextCoins;
}

export function getStudentInventory(): StudentInventory {
  const current = getActiveStudent();
  if (current?.inventory) {
    return current.inventory;
  }
  try {
    const saved = localStorage.getItem('arkedo_student_inventory');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_INVENTORY;
}

export function getEquippedItems(): EquippedItems {
  const current = getActiveStudent();
  if (current?.equipped) {
    return current.equipped;
  }
  try {
    const saved = localStorage.getItem('arkedo_equipped_items');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_EQUIPPED;
}

export async function buyShopItem(
  itemId: string
): Promise<{ success: boolean; error?: string; updatedCoins?: number; inventory?: StudentInventory }> {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, error: 'Obiectul nu a fost găsit în catalog.' };
  }

  const inventory = getStudentInventory();
  if (inventory.ownedItemIds.includes(itemId)) {
    return { success: false, error: 'Deții deja acest obiect în inventar!' };
  }

  const currentCoins = getByteCoins();
  if (currentCoins < item.price) {
    return { success: false, error: `Nu ai suficiente B-Coins! Îți lipsesc ${item.price - currentCoins} 🪙.` };
  }

  const updatedCoins = currentCoins - item.price;
  const updatedInventory: StudentInventory = {
    ...inventory,
    ownedItemIds: [...inventory.ownedItemIds, itemId]
  };

  try {
    localStorage.setItem('arkedo_student_coins', String(updatedCoins));
    localStorage.setItem('arkedo_byte_coins', String(updatedCoins));
    localStorage.setItem('arkedo_student_inventory', JSON.stringify(updatedInventory));
  } catch {}

  const current = getActiveStudent();
  if (current) {
    const updated: StudentProfile = {
      ...current,
      byteCoins: updatedCoins,
      inventory: updatedInventory,
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updated);
    if (isCloudConnected && db && current.id) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          byteCoins: updatedCoins,
          inventory: updatedInventory,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare update inventar Firestore:', err);
      }
    }
  }

  return { success: true, updatedCoins, inventory: updatedInventory };
}

export async function equipShopItem(
  category: ShopCategory,
  itemId: string
): Promise<{ success: boolean; equipped?: EquippedItems }> {
  const equipped = getEquippedItems();
  const updatedEquipped: EquippedItems = { ...equipped };

  if (category === 'arky_skin') {
    updatedEquipped.arkySkin = itemId.replace('skin_', '');
  } else if (category === 'theme') {
    updatedEquipped.theme = itemId.replace('theme_', '');
  } else if (category === 'title') {
    updatedEquipped.title = itemId === 'title_none' ? '' : itemId.replace('title_', '');
  } else if (category === 'avatar_frame') {
    updatedEquipped.avatarFrame = itemId.replace('frame_', '');
  }

  try {
    localStorage.setItem('arkedo_equipped_items', JSON.stringify(updatedEquipped));
  } catch {}

  const current = getActiveStudent();
  if (current) {
    const updated: StudentProfile = {
      ...current,
      equipped: updatedEquipped,
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updated);
    if (isCloudConnected && db && current.id) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          equipped: updatedEquipped,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare update echipare Firestore:', err);
      }
    }
  }

  return { success: true, equipped: updatedEquipped };
}

export async function openMysteryChest(): Promise<{
  success: boolean;
  item?: ShopItem;
  bonusCoins?: number;
  error?: string;
}> {
  const inventory = getStudentInventory();
  const unownedItems = SHOP_ITEMS.filter((i) => !inventory.ownedItemIds.includes(i.id) && i.price > 0);

  if (unownedItems.length > 0) {
    const randomItem = unownedItems[Math.floor(Math.random() * unownedItems.length)];
    const updatedInventory: StudentInventory = {
      ...inventory,
      ownedItemIds: [...inventory.ownedItemIds, randomItem.id],
      openedMysteryBoxes: (inventory.openedMysteryBoxes || 0) + 1
    };

    try {
      localStorage.setItem('arkedo_student_inventory', JSON.stringify(updatedInventory));
    } catch {}

    const current = getActiveStudent();
    if (current) {
      const updated: StudentProfile = {
        ...current,
        inventory: updatedInventory,
        lastActiveAt: new Date().toISOString()
      };
      saveActiveStudentLocally(updated);
      if (isCloudConnected && db && current.id) {
        try {
          await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
            inventory: updatedInventory,
            lastActiveAt: new Date().toISOString()
          });
        } catch {}
      }
    }

    return { success: true, item: randomItem };
  }

  const bonus = 100;
  await addByteCoins(bonus, 'Mystery Box Cashout');
  return { success: true, bonusCoins: bonus };
}

export async function awardTeacherCoins(studentDocId: string, amount: number): Promise<boolean> {
  if (isCloudConnected && db && studentDocId) {
    try {
      const ref = doc(db, STUDENTS_COLLECTION, studentDocId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const currentCoins = Number(data.byteCoins || 0);
        const newCoins = Math.max(0, currentCoins + amount);
        await updateDoc(ref, {
          byteCoins: newCoins,
          lastActiveAt: new Date().toISOString()
        });
        return true;
      }
    } catch (err) {
      console.warn('Eroare acordare monede profesor:', err);
    }
  }
  return false;
}
