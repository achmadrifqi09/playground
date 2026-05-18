'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { useScratchpad } from '@/hooks/useScratchpad';
import { WorkspaceType } from '@/types/scratchpad';

const languageMap: Record<WorkspaceType, string> = {
  env: 'ini',
  bash: 'shell',
  sql: 'sql',
  json: 'json',
  notes: 'markdown',
};

const EDITOR_OPTIONS = {
  minimap: { enabled: false } as const,
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  lineNumbers: 'on' as const,
  wordWrap: 'on' as const,
  theme: 'vs-dark',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  overviewRulerLanes: 0,
  renderLineHighlight: 'line' as const,
  cursorBlinking: 'smooth' as const,
};

export default function ScratchpadEditor() {
  const { tabs, activeTabId, updateTabContent } = useScratchpad();
  
  const activeTab = tabs.find((t) => t.id === activeTabId);

  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        No active tab. Create one to start.
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-hidden">
      <Editor
        height="100%"
        language={languageMap[activeTab.type]}
        value={activeTab.content}
        onChange={(value) => updateTabContent(activeTab.id, value || '')}
        options={EDITOR_OPTIONS}
        theme="vs-dark"
      />
    </div>
  );
}
