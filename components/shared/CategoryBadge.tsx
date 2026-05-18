import { ToolCategory } from '@/types/tools';
import { cn } from '@/lib/utils/cn';

interface CategoryBadgeProps {
  category: ToolCategory;
}

const colors: Record<ToolCategory, string> = {
  workspace: 'bg-blue-500/10 text-blue-400',
  security: 'bg-green-500/10 text-green-400',
  crypto: 'bg-purple-500/10 text-purple-400',
  utility: 'bg-orange-500/10 text-orange-400',
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize', colors[category])}>
      {category}
    </span>
  );
}
