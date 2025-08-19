import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type !== 'user.created') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const { id } = body.data || {};

    const { error } = await supabaseAdmin.from('profiles').upsert([
      {
        id,        
      },
    ], {
      onConflict: 'id',
    });

    if (error) {
      console.error('[Clerk Webhook] Supabase upsert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[Clerk Webhook] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
