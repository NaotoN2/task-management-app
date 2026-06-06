import { createClient as AdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = AdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

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

  let sentCount = 0;
  let failedCount = 0;

  for (const task of tasks) {
    const { error: resendError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'naoto2000x@gmail.com',
      subject: `【リマインド】${task.title}`,
      html: `<p>テスト</p>
           <p>タスク名: ${task.title}</p>
           <p>日付: ${task.task_date}</p>`
    });

    if (resendError) {
      console.error(`${task.id}：送信に失敗しました`, resendError);
      failedCount++;
      continue;
    }

    sentCount++;

    await supabase.from('task').update({ reminded_at: new Date().toISOString() }).eq('id', task.id);
  }

  return Response.json({
    success: true,
    targetCount: tasks.length,
    sentCount,
    failedCount,
  });
}
