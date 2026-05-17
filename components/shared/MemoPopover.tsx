import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

type MemoPopoverProps = {
  memo: string;
};

export default function MemoPopover({ memo }: MemoPopoverProps) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="ml-1 inline-flex cursor-pointer items-center rounded px-1 text-xs hover:bg-slate-100"
            >
              📝
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>メモ</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-48 text-sm">
        <p className="whitespace-pre-wrap">{memo}</p>
      </PopoverContent>
    </Popover>
  );
}