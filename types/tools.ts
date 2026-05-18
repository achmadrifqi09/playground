export type ToolCategory = 'workspace' | 'security' | 'crypto' | 'utility';

export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  href: string;
  icon: string;
  keywords: string[];
  quickActionLabel: string;
}
