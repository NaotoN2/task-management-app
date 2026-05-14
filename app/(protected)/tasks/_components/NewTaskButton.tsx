'use client';

import { useState } from 'react';
import TaskModal from './TaskModal';

export default function NewTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        新規追加
      </button>
      {isOpen && <TaskModal mode="create" onClose={() => setIsOpen(false)} />}
    </>
  );
}
