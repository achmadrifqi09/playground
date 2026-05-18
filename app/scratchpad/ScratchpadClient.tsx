'use client';

import React, { useEffect } from 'react';
import { useScratchpad } from '@/hooks/useScratchpad';
import TabBar from '@/components/scratchpad/TabBar';
import ScratchpadEditor from '@/components/scratchpad/ScratchpadEditor';
import { Terminal, Plus, FileText, FileJson, File, Database, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { WorkspaceType } from '@/types/scratchpad';

const workspaceTypes: { type: WorkspaceType; label: string; desc: string }[] = [
  { type: 'env', label: 'ENV', desc: '.env variables' },
  { type: 'bash', label: 'Bash', desc: 'Shell commands' },
  { type: 'sql', label: 'SQL', desc: 'Database queries' },
  { type: 'json', label: 'JSON', desc: 'JSON data' },
  { type: 'notes', label: 'Notes', desc: 'Markdown notes' },
];

const iconMap: Record<WorkspaceType, React.ComponentType<{ className?: string }>> = {
  env: FileText,
  bash: Terminal,
  sql: Database,
  json: FileJson,
  notes: File,
};

export default function ScratchpadClient() {
  const { loadFromStorage, tabs, activeTabId, addTab, setActiveTab, reopenTab, deleteTab, isDirty, flushSave, isLoaded } = useScratchpad();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isLoaded && tabs.filter(t => !t.isClosed).length === 0) {
      addTab('env');
    }
  }, [isLoaded, tabs, addTab]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    return () => {
      flushSave();
    };
  }, [flushSave]);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const openTabs = tabs.filter((t) => !t.isClosed);
  const closedTabs = tabs.filter((t) => t.isClosed);

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {}
      <div className="w-64 border-r border-border bg-muted/10 flex flex-col">
        {}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explorer</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>New File</DropdownMenuLabel>
              {workspaceTypes.map(({ type, label }) => (
                <DropdownMenuItem key={type} onClick={() => addTab(type)}>
                  <div className="flex items-center gap-2">
                    {React.createElement(iconMap[type], { className: "h-4 w-4 text-muted-foreground" })}
                    <span>{label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {}
        <div className="flex-1 overflow-y-auto p-2">
          {}
          <div className="mb-4">
            <span className="text-xs font-medium text-muted-foreground px-2 mb-1 block">Open Editors</span>
            {openTabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "px-2 py-1.5 text-sm rounded-sm cursor-pointer flex items-center gap-2 transition-colors group",
                  tab.id === activeTabId
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {React.createElement(iconMap[tab.type], { className: "h-4 w-4 shrink-0" })}
                <span className="truncate flex-1">{tab.label}</span>
                <button
                  className="p-1 rounded-full hover:bg-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTab(tab.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {}
          {closedTabs.length > 0 && (
            <div>
              <span className="text-xs font-medium text-muted-foreground px-2 mb-1 block">Recently Saved</span>
              {closedTabs.map((tab) => (
                <div
                  key={tab.id}
                  className="px-2 py-1.5 text-sm rounded-sm cursor-pointer flex items-center gap-2 text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground transition-colors group"
                  onClick={() => reopenTab(tab.id)}
                >
                  {React.createElement(iconMap[tab.type], { className: "h-4 w-4 shrink-0" })}
                  <span className="truncate flex-1">{tab.label}</span>
                  <button
                    className="p-1 rounded-full hover:bg-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTab(tab.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      <div className="flex-1 flex flex-col overflow-hidden">
        {}
        <TabBar />

        {}
        <ScratchpadEditor />

        {}
        <div className="px-4 py-1 text-xs border-t border-border bg-muted/30 text-muted-foreground flex justify-between">
          <span>
            {activeTab ? `Tab: ${activeTab.label}` : 'No active tab'}
          </span>
          <span>
            {activeTab ? `Updated: ${new Date(activeTab.updatedAt).toLocaleTimeString()}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
