import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  if (body.type === 'user.created') {
    const { id, username, email_addresses } = body.data;

    const email = email_addresses?.[0]?.email_address || null; 

    const { error } = await supabaseAdmin.from('profiles').insert([
      {
        id,
        username, 
        email,     
        onboarded: false,
      },
    ]);

    if (error) {
      console.error('[Clerk Webhook] Supabase insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  }

  return NextResponse.json({ status: 'ignored' });
}
