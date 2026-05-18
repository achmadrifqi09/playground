import { openDB, IDBPDatabase } from 'idb';
import type { Tab } from '@/types/scratchpad';

const DB_NAME = 'playground-scratchpad';
const DB_VERSION = 1;
const STORE_NAME = 'tabs';

export async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveTabs(tabs: Tab[]): Promise<void> {
  const db = await initDB();
  await db.put(STORE_NAME, tabs, 'current_tabs');
}

export async function loadTabs(): Promise<Tab[]> {
  const db = await initDB();
  const tabs = await db.get(STORE_NAME, 'current_tabs');
  return tabs || [];
}

export async function clearAllTabs(): Promise<void> {
  const db = await initDB();
  await db.delete(STORE_NAME, 'current_tabs');
}
