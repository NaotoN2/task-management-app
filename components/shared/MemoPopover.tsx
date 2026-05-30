'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NotebookText } from 'lucide-react';

type MemoPopoverProps = {
  memo: string;
  iconClass?: string;
};

export default function MemoPopover({ memo,iconClass }: MemoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="cursor-pointer items-center rounded  text-xs hover:bg-slate-100">
          <NotebookText className={iconClass ?? 'h-5 w-5'} strokeWidth={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" alignOffset={-30} className="w-48 text-sm">
        <p className="whitespace-pre-wrap">{memo}</p>
      </PopoverContent>
    </Popover>
  );
}
