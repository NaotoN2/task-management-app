'use client';

import type { Task, TaskListItem } from '@/app/types/task';
import { addTask, deleteTask, updateTask } from './actions';
import { useState } from 'react';

type TaskModalProps = {
  mode: 'create' | 'edit';
  onClose: () => void;
  task?: TaskListItem;
};

export default function TaskModal({ mode, onClose, task }: TaskModalProps) {
  const isEditMode = mode === 'edit';
  const today = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Tokyo'
  });

  const [isSpotTask, setIsSpotTask] = useState(task?.spot_task ?? false);
  const [status, setStatus] = useState<Task['status']>(task?.status ?? 'todo');
  const [taskDate, setTaskDate] = useState(task?.task_date ?? '');

  const isTodaySpotTask = isSpotTask && taskDate === today;
  const isNonTodaySpotTask = isSpotTask && !isTodaySpotTask;

  const statusOptions = isSpotTask
    ? isTodaySpotTask
      ? [
          { value: 'todo', label: '未着手' },
          { value: 'done', label: '完了' }
        ]
      : [{ value: 'todo', label: '未着手' }]
    : [
        { value: 'todo', label: '未着手' },
        { value: 'in_progress', label: '進行中' },
        { value: 'done', label: '完了' }
      ];

  async function handleSubmit(formData: FormData) {
    const result = isEditMode ? await updateTask(formData) : await addTask(formData);

    if (result?.success) {
      onClose();
    } else {
      alert(isEditMode ? 'エラー：タスクの更新に失敗しました' : 'エラー：タスクの追加に失敗しました');
    }
  }

  async function handleDelete(formData: FormData) {
    const ok = window.confirm('この項目を削除してよろしいですか？');

    if (!ok) {
      return;
    }

    const result = await deleteTask(formData);

    if (result?.success) {
      onClose();
    } else {
      alert('削除に失敗しました');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{isEditMode ? '項目を編集' : '新規項目を追加'}</h2>

          <button type="button" onClick={onClose} className="cursor-pointer text-2xl leading-none" aria-label="閉じる">
            閉じる
          </button>
        </div>

        <form id="task-form" className="space-y-4" action={handleSubmit}>
          {isEditMode && task ? <input type="hidden" name="taskId" value={task.id} /> : null}
          <div>
            <label className="mb-1 block text-sm font-medium">項目名</label>
            <input
              type="text"
              name="title"
              defaultValue={task?.title ?? ''}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">分類</label>

              <div className="pl-4 flex items-center gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="spot_task"
                    value="false"
                    checked={!isSpotTask}
                    onChange={() => setIsSpotTask(false)}
                  />
                  期限
                </label>

                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="spot_task"
                    value="true"
                    checked={isSpotTask}
                    onChange={() => {
                      setIsSpotTask(true);
                      setStatus('todo');
                    }}
                  />
                  スポット
                </label>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">期限</label>
              <input
                type="date"
                name="task_date"
                value={taskDate}
                onChange={(e) => {
                  setTaskDate(e.target.value);
                }}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">進行状況</label>

              <select
                name="status"
                value={isNonTodaySpotTask ? 'todo' : status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className="w-full rounded-md border px-3 py-2"
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">重要度</label>
              <select
                name="priority"
                defaultValue={task?.priority ?? 'medium'}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">メモ</label>
            <textarea
              name="memo"
              rows={4}
              defaultValue={task?.memo ?? ''}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </form>

        <div className="mt-6 flex items-center justify-between">
          {isEditMode && task ? (
            <form action={handleDelete}>
              <input type="hidden" name="taskId" value={task.id} />
              <button type="submit" className="cursor-pointer rounded-md border border-red-500 px-4 py-2 text-red-600">
                項目を削除
              </button>
            </form>
          ) : null}

          <button type="submit" form="task-form" className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white">
            {isEditMode ? '更新' : '追加'}
          </button>
        </div>
      </div>
    </div>
  );
}
