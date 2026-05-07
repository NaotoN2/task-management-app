'use client';

import { useState } from 'react';
import { isTaskPriority, isTaskStatus, PRIORITY_VALUES, STATUS_VALUES } from './constants';
import { useRouter, useSearchParams } from 'next/navigation';
import type { TaskPriority, TaskStatus } from '@/app/types/task';

export default function FilterPopover() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get('status');
  const priorityParam = searchParams.get('priority');

  const [isOpen, setIsOpen] = useState(false);
  const [statuses, setStatuses] = useState<TaskStatus[]>(
    statusParam ? statusParam.split(',').filter(isTaskStatus) : []
  );
  const [priorities, setPriorities] = useState<TaskPriority[]>(
    priorityParam ? priorityParam.split(',').filter(isTaskPriority) : []
  );

  function toggleStatus(value: TaskStatus) {
    setStatuses((prev) => (prev.includes(value) ? prev.filter((status) => status !== value) : [...prev, value]));
  }
  function togglePriority(value: TaskPriority) {
    setPriorities((prev) => (prev.includes(value) ? prev.filter((priority) => priority !== value) : [...prev, value]));
  }

  function setFilter() {
    const params = new URLSearchParams(searchParams.toString());

    if (statuses.length > 0) {
      params.set('status', statuses.join(','));
    } else {
      params.delete('status');
    }

    if (priorities.length > 0) {
      params.set('priority', priorities.join(','));
    } else {
      params.delete('priority');
    }

    router.push(`/tasks?${params.toString()}`);
    setIsOpen(false);
  }

  function handleClear() {
    const params = new URLSearchParams(searchParams.toString());

    setStatuses([]);
    setPriorities([]);
    params.delete('status');
    params.delete('priority');

    router.push(`/tasks?${params.toString()}`);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md border px-4 py-2 text-sm cursor-pointer"
      >
        フィルタ
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border bg-white pt-2 px-4 pb-4 shadow-lg">
          <div className="flex justify-end mb-2">
            <button type="button" onClick={() => setIsOpen(false)} className="text-sm cursor-pointer">
              閉じる
            </button>
          </div>
          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold">進行状況</p>

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={statuses.includes(STATUS_VALUES.TODO)}
                  onChange={() => toggleStatus(STATUS_VALUES.TODO)}
                />
                未着手
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={statuses.includes(STATUS_VALUES.IN_PROGRESS)}
                  onChange={() => toggleStatus(STATUS_VALUES.IN_PROGRESS)}
                />
                進行中
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={statuses.includes(STATUS_VALUES.DONE)}
                  onChange={() => toggleStatus(STATUS_VALUES.DONE)}
                />
                完了
              </label>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold">重要度</p>

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={priorities.includes(PRIORITY_VALUES.HIGH)}
                  onChange={() => togglePriority(PRIORITY_VALUES.HIGH)}
                />
                高
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={priorities.includes(PRIORITY_VALUES.MEDIUM)}
                  onChange={() => togglePriority(PRIORITY_VALUES.MEDIUM)}
                />
                中
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={priorities.includes(PRIORITY_VALUES.LOW)}
                  onChange={() => togglePriority(PRIORITY_VALUES.LOW)}
                />
                低
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border px-3 py-1.5 text-sm cursor-pointer"
            >
              解除
            </button>
            <button
              type="button"
              onClick={setFilter}
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white cursor-pointer"
            >
              適用
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
