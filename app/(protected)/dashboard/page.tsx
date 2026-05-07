import { createClient } from '@/lib/supabase/server';
import { addTask, deleteTask,} from '../tasks/actions';


export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>ユーザー情報を取得できませんでした</div>;
  }

  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('user_id', user.id)
    .order('id', { ascending: true });

  if (error) {
    return <div>エラー：{error.message}</div>;
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <form action={addTask}>
        <input type="text" name="title" placeholder="タスク名を入力" />

        <select name="status" defaultValue="todo">
          <option value="todo">未着手</option>
          <option value="in_progress">進行中</option>
          <option value="done">完了済</option>
        </select>

        <select name="priority" defaultValue="medium">
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>

        <input type='date' name='due_date'></input>

        <button type="submit">追加</button>
      </form>

      <ul>
        {data.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span>

            <form action={deleteTask} style={{ display: 'inline', marginLeft: '8px' }}>
              <input type="hidden" name="taskId" value={task.id} />
              <button type="submit">削除</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
