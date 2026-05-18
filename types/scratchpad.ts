export type WorkspaceType = 'env' | 'bash' | 'sql' | 'json' | 'notes';

export interface Tab {
  id: string; // UUID v4
  label: string; // Nama tab, bisa diedit
  type: WorkspaceType; // Tipe menentukan syntax highlighting
  content: string; // Isi editor
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  isClosed?: boolean; // Soft delete flag
}

export interface ScratchpadState {
  tabs: Tab[];
  activeTabId: string | null;
}
