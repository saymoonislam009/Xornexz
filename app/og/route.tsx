import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || "We Build What's Next";
  const subtitle = searchParams.get('subtitle') || 'Xornexz — Premium Technology Studio';
  const type = searchParams.get('type') || 'default'; // 'blog' | 'service' | 'portfolio' | 'default'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #05060A 0%, #0D0820 50%, #05060A 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 80px',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: '900',
                color: 'white',
              }}
            >
              X
            </div>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>Xornexz</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
            {type !== 'default' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: '100px',
                  padding: '6px 16px',
                  width: 'fit-content',
                }}
              >
                <span style={{ color: '#a78bfa', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {type === 'blog' ? 'Blog' : type === 'service' ? 'Service' : 'Portfolio'}
                </span>
              </div>
            )}
            <h1
              style={{
                fontSize: title.length > 50 ? '42px' : '56px',
                fontWeight: '900',
                color: 'white',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: '22px', color: 'rgba(156,163,175,1)', margin: 0, lineHeight: 1.4 }}>
              {subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', color: 'rgba(107,114,128,1)' }}>xornexz.com</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
