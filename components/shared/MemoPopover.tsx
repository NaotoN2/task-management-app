'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

type MemoPopoverProps = {
  memo: string;
};

export default function MemoPopover({ memo }: MemoPopoverProps) {
  return (
    <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="cursor-pointer items-center rounded  text-xs hover:bg-slate-100"
            >
              📝
            </button>
          </PopoverTrigger>
      <PopoverContent className="w-48 text-sm">
        <p className="whitespace-pre-wrap">{memo}</p>
      </PopoverContent>
    </Popover>
  );
}