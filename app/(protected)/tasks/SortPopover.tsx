'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { isSortValue, SORT_VALUES, type SortValue } from './constants';

export default function SortPopover() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSort = searchParams.get('sort');

  const currentSort: SortValue = isSortValue(rawSort) ? rawSort : SORT_VALUES.DEFAULT;

  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState<SortValue>(currentSort);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md border px-4 py-2 text-sm cursor-pointer"
      >
        並び替え
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border bg-white pt-2 px-4 pb-4 shadow-lg">
          <div className="flex justify-end mb-2">
            <button type="button" onClick={() => setIsOpen(false)} className="text-sm cursor-pointer">
              閉じる
            </button>
          </div>
          <div className="mb-4">
            <div className="text-sm flex justify-center">
              <select
                value={sort}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isSortValue(value)) {
                    setSort(value);
                  }
                }}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value={SORT_VALUES.DEFAULT}>追加順</option>
                <option value={SORT_VALUES.DUE_ASC}>期限が近い順</option>
                <option value={SORT_VALUES.DUE_DESC}>期限が遠い順</option>
                <option value={SORT_VALUES.PRIORITY_DESC}>重要度が高い順</option>
                <option value={SORT_VALUES.PRIORITY_ASC}>重要度が低い順</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('sort', sort);
                router.push(`/tasks?${params.toString()}`);
                setIsOpen(false);
              }}
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white cursor-pointer"
            >
              並べ替える
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
