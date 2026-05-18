export type WorkspaceType = 'env' | 'bash' | 'sql' | 'json' | 'notes';

export interface Tab {
  id: string;
  label: string;
  type: WorkspaceType;
  content: string;
  createdAt: number;
  updatedAt: number;
  isClosed?: boolean;
}

export interface ScratchpadState {
  tabs: Tab[];
  activeTabId: string | null;
}
