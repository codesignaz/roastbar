import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';
import { SupportedLocale } from '@/lib/sloganService';

export async function GET() {
  const slogans = serverDb.getSlogans();
  return NextResponse.json(slogans, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.resetAll) {
      serverDb.resetAllSlogans();
      return NextResponse.json(serverDb.getSlogans());
    }

    if (body.resetLocale) {
      serverDb.resetLocaleSlogans(body.resetLocale as SupportedLocale);
      return NextResponse.json(serverDb.getSlogans());
    }

    if (body.all) {
      serverDb.saveAllSlogans(body.all);
      return NextResponse.json(serverDb.getSlogans());
    }

    if (body.locale && body.slogans) {
      serverDb.saveSlogansForLocale(body.locale as SupportedLocale, body.slogans);
      return NextResponse.json(serverDb.getSlogans());
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to save slogans' }, { status: 500 });
  }
}
