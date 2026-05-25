import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const task = tasks[0];

  const { data, error: resendError } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'naoto2000x@gmail.com',
    subject: `【リマインド】${task.title}`,
    html: `<p>テスト</p>
           <p>タスク名: ${task.title}</p>
           <p>日付: ${task.task_date}</p>`
  });

  if (resendError) {
    console.error(resendError);

    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  console.log(tasks);

  return NextResponse.json({ count: tasks.length, tasks, email: data });
}
