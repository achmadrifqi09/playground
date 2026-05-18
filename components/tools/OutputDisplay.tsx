import { cn } from '@/lib/utils/cn';

interface OutputDisplayProps {
  value: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

export default function OutputDisplay({
  value,
  placeholder = 'Generated output will appear here...',
  multiline = false,
  className,
}: OutputDisplayProps) {
  const content = value || placeholder;
  const isPlaceholder = !value;

  if (multiline) {
    return (
      <textarea
        readOnly
        value={content}
        className={cn(
          'w-full min-h-[100px] font-mono text-sm bg-muted/50 border border-border rounded-md p-3 break-all resize-none focus:outline-none',
          isPlaceholder ? 'text-muted-foreground' : 'text-foreground',
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'w-full min-h-[48px] flex items-center font-mono text-sm bg-muted/50 border border-border rounded-md px-3 py-2 break-all',
        isPlaceholder ? 'text-muted-foreground' : 'text-foreground',
        className
      )}
    >
      {content}
    </div>
  );
}
