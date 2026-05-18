'use client';

import React from 'react';
import { useScratchpad } from '@/hooks/useScratchpad';
import TabItem from './TabItem';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkspaceType } from '@/types/scratchpad';

const workspaceTypes: { type: WorkspaceType; label: string; desc: string }[] = [
  { type: 'env', label: 'ENV', desc: '.env variables' },
  { type: 'bash', label: 'Bash', desc: 'Shell commands' },
  { type: 'sql', label: 'SQL', desc: 'Database queries' },
  { type: 'json', label: 'JSON', desc: 'JSON data' },
  { type: 'notes', label: 'Notes', desc: 'Markdown notes' },
];

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, removeTab, addTab, renameTab } = useScratchpad();

  const openTabs = tabs.filter((t) => !t.isClosed);

  return (
    <div className="flex items-center border-b border-border bg-muted/10 overflow-x-auto">
      {openTabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onClick={() => setActiveTab(tab.id)}
          onClose={() => removeTab(tab.id)}
          onRename={(label) => renameTab(tab.id, label)}
        />
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none border-r border-border">
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {workspaceTypes.map(({ type, label, desc }) => (
            <DropdownMenuItem key={type} onClick={() => addTab(type)}>
              <div className="flex flex-col">
                <span className="font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
