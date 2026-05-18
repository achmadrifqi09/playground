'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Tab } from '@/types/scratchpad';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
  onRename: (label: string) => void;
}

const TabItem = React.memo(function TabItem({ tab, isActive, onClick, onClose, onRename }: TabItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(tab.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() && value !== tab.label) {
      onRename(value.trim());
    } else {
      setValue(tab.label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(tab.label);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer transition-colors h-10',
        isActive
          ? 'bg-background border-b-2 border-b-primary text-foreground'
          : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
      onClick={onClick}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium bg-transparent outline-none border-b border-primary w-24"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="text-sm font-medium">{tab.label}</span>
      )}
      <button
        className="p-0.5 rounded-full hover:bg-muted-foreground/20 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
});

export default TabItem;
