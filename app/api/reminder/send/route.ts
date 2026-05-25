import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const now = new Date().toISOString();

  const { data: tasks, error } = await supabase
    .from('task')
    .select('id,title,task_date,remind_at,user_id')
    .lte('remind_at', now)
    .is('reminded_at', null)
    .neq('status', 'done');

  if (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Failed to fetch reminder tasks'
      },
      { status: 500 }
    );
  }

  console.log(tasks);

  return NextResponse.json({ count: tasks.length, tasks });
}
