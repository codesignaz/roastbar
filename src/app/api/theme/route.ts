import { NextResponse } from 'next/server';
import { getServerThemeId, saveServerTheme } from '@/lib/themeServer';
import { THEME_PRESETS } from '@/lib/themePresets';
import { serverDb } from '@/lib/serverDb';

export async function GET() {
  const themeId = getServerThemeId();
  return NextResponse.json(
    { themeId },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { themeId } = body;

    if (!themeId || typeof themeId !== 'string') {
      return NextResponse.json(
        { error: 'themeId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!THEME_PRESETS.some((p) => p.id === themeId)) {
      return NextResponse.json(
        { error: `Invalid themeId: ${themeId}` },
        { status: 400 }
      );
    }

    const saved = saveServerTheme(themeId);
    serverDb.setThemeId(themeId);
    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to persist theme on server' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      themeId,
      message: 'Theme successfully saved as default for all devices',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
