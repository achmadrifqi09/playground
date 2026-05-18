import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Tab, WorkspaceType } from '@/types/scratchpad';
import { saveTabs, loadTabs } from '@/lib/storage/scratchpadStorage';

interface ScratchpadStore {
  tabs: Tab[];
  activeTabId: string | null;
  isDirty: boolean;
  isLoaded: boolean;
  addTab: (type: WorkspaceType) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  renameTab: (tabId: string, label: string) => void;
  clearTabContent: (tabId: string) => void;
  reopenTab: (tabId: string) => void;
  deleteTab: (tabId: string) => void;
  loadFromStorage: () => Promise<void>;
  flushSave: () => void;
}

let saveTimeout: NodeJS.Timeout | null = null;

const defaultContent: Record<WorkspaceType, string> = {
  env: '# .env file\nKEY=VALUE',
  bash: '#!/bin/bash\necho "Hello World"',
  sql: '-- SQL query\nSELECT * FROM users;',
  json: '{\n  "key": "value"\n}',
  notes: '# Notes\nWrite something here...',
};

const saveBackup = (tabs: Tab[]) => {
  if (typeof window !== 'undefined') {
    try {
      const str = JSON.stringify(tabs);
      if (str.length < 2 * 1024 * 1024) {
        localStorage.setItem('scratchpad_tabs_backup', str);
      }
    } catch (e) {
      console.warn('Failed to save backup to localStorage', e);
    }
  }
};

export const useScratchpadStore = create<ScratchpadStore>((set, get) => ({
  tabs: [],
  activeTabId: null,
  isDirty: false,
  isLoaded: false,

  addTab: (type: WorkspaceType) => {
    const newTab: Tab = {
      id: uuidv4(),
      label: `Untitled (${type})`,
      type,
      content: defaultContent[type],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => {
      const newTabs = [...state.tabs, newTab];
      saveTabs(newTabs);
      saveBackup(newTabs);
      return {
        tabs: newTabs,
        activeTabId: newTab.id,
      };
    });
  },

  removeTab: (tabId: string) => {
    set((state) => {
      const targetTab = state.tabs.find((t) => t.id === tabId);
      if (!targetTab) return state;

      const openTabs = state.tabs.filter((t) => !t.isClosed && t.id !== tabId);
      
      let newTabs;
      let newActiveTabId = state.activeTabId;

      if (openTabs.length === 0) {
        const newTab: Tab = {
          id: uuidv4(),
          label: `Untitled (${targetTab.type})`,
          type: targetTab.type,
          content: defaultContent[targetTab.type],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        newTabs = state.tabs.map((t) => t.id === tabId ? { ...t, isClosed: true } : t);
        newTabs.push(newTab);
        newActiveTabId = newTab.id;
      } else {
        newTabs = state.tabs.map((t) => t.id === tabId ? { ...t, isClosed: true } : t);
        
        if (state.activeTabId === tabId) {
          const index = state.tabs.filter((t) => !t.isClosed).findIndex((t) => t.id === tabId);
          const remainingOpenTabs = state.tabs.filter((t) => !t.isClosed && t.id !== tabId);
          newActiveTabId = remainingOpenTabs[Math.max(0, index - 1)].id;
        }
      }

      saveTabs(newTabs);
      saveBackup(newTabs);
      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    });
  },

  setActiveTab: (tabId: string) => set({ activeTabId: tabId }),

  updateTabContent: (tabId: string, content: string) => {
    set((state) => {
      const newTabs = state.tabs.map((t) =>
        t.id === tabId ? { ...t, content, updatedAt: Date.now() } : t
      );

      saveBackup(newTabs);

      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveTabs(newTabs);
        set({ isDirty: false });
      }, 500);

      return { tabs: newTabs, isDirty: true };
    });
  },

  renameTab: (tabId: string, label: string) => {
    set((state) => {
      const newTabs = state.tabs.map((t) =>
        t.id === tabId ? { ...t, label, updatedAt: Date.now() } : t
      );
      saveTabs(newTabs);
      saveBackup(newTabs);
      return { tabs: newTabs };
    });
  },

  clearTabContent: (tabId: string) => {
    set((state) => {
      const newTabs = state.tabs.map((t) =>
        t.id === tabId ? { ...t, content: '', updatedAt: Date.now() } : t
      );
      saveTabs(newTabs);
      saveBackup(newTabs);
      return { tabs: newTabs };
    });
  },

  reopenTab: (tabId: string) => {
    set((state) => {
      const newTabs = state.tabs.map((t) =>
        t.id === tabId ? { ...t, isClosed: false, updatedAt: Date.now() } : t
      );
      saveTabs(newTabs);
      saveBackup(newTabs);
      return { tabs: newTabs, activeTabId: tabId };
    });
  },

  deleteTab: (tabId: string) => {
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== tabId);
      
      let newActiveTabId = state.activeTabId;
      if (state.activeTabId === tabId) {
        const openTabs = newTabs.filter((t) => !t.isClosed);
        if (openTabs.length > 0) {
          newActiveTabId = openTabs[0].id;
        } else {
          newActiveTabId = null;
        }
      }

      saveTabs(newTabs);
      saveBackup(newTabs);
      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    });
  },

  loadFromStorage: async () => {
    if (get().isLoaded) return;
    
    let tabs = [];
    if (typeof window !== 'undefined') {
      const backup = localStorage.getItem('scratchpad_tabs_backup');
      if (backup) {
        try {
          tabs = JSON.parse(backup);
        } catch (e) {
          console.warn('Failed to parse backup from localStorage', e);
        }
      }
    }
    
    if (tabs.length === 0) {
      tabs = await loadTabs();
    } else {
      saveTabs(tabs);
    }
    
    set({
      tabs,
      activeTabId: tabs.length > 0 ? tabs[0].id : null,
      isLoaded: true,
    });
  },

  flushSave: () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
      saveTabs(get().tabs);
      set({ isDirty: false });
    }
  },
}));
