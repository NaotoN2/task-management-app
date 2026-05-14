'use client';

import { useState } from 'react';
import TaskModal from './TaskModal';
import type { TaskListItem } from '@/app/types/task';

type EditTaskButtonProps = {
  task: TaskListItem;
};

export default function EditTaskButton({ task }: EditTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="cursor-pointer">
        ✏
      </button>

      {isOpen && <TaskModal mode="edit" onClose={() => setIsOpen(false)} task={task} />}
    </>
  );
}
