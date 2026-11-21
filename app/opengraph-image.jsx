import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { COLLEGE_NAME } from '@/lib/site';

export const alt = 'INFINITUS — Mathematics Club of Rajalakshmi Institute of Technology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  let logoSrc = null;
  try {
    const logo = await readFile(path.join(process.cwd(), 'public/brand/infinitus-og.png'));
    logoSrc = `data:image/png;base64,${logo.toString('base64')}`;
  } catch {
    // Non-fatal
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          color: '#FFFFFF',
          backgroundColor: '#090A10',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(255, 107, 0, 0.28) 0%, rgba(9, 10, 16, 0) 55%), radial-gradient(circle at 15% 85%, rgba(0, 240, 255, 0.16) 0%, rgba(9, 10, 16, 0) 50%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Coordinate grid */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            opacity: 0.05,
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} width={64} height={64} alt="" style={{ borderRadius: 16 }} />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255, 107, 0, 0.2)',
                  border: '1.5px solid rgba(255, 107, 0, 0.5)',
                }}
              >
                <svg viewBox="0 0 48 24" width="40" height="20" fill="none" stroke="#FF6B00" strokeWidth="4">
                  <path d="M24 12 C28 6 36 6 40 9 C44 12 44 16 40 19 C36 22 28 18 24 12 C20 6 12 6 8 9 C4 12 4 16 8 19 C12 22 20 18 24 12 Z" />
                </svg>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: 2, color: '#FFFFFF' }}>
                INFINITUS
              </span>
              <span style={{ fontSize: 13, letterSpacing: 2, color: '#FF6B00', textTransform: 'uppercase', fontWeight: 700 }}>
                Mathematics Club
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 20px',
              borderRadius: 9999,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              fontSize: 14,
              color: '#9CA3AF',
              fontWeight: 600,
            }}
          >
            {COLLEGE_NAME}
          </div>
        </div>

        {/* Central Hero Block */}
        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10, margin: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                borderRadius: 9999,
                backgroundColor: 'rgba(255, 107, 0, 0.16)',
                border: '1.5px solid rgba(255, 107, 0, 0.45)',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: '#FF6B00',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B00', marginRight: 8, display: 'flex' }} />
              <span>OFFICIAL PORTAL</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: 9999,
                backgroundColor: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
                color: '#00F0FF',
              }}
            >
              44 Events | 6 Math Branches
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: 76, fontWeight: 900, letterSpacing: -2, lineHeight: 1, color: '#FFFFFF' }}>
            Where Logic Meets Innovation
          </div>

          <div style={{ display: 'flex', fontSize: 24, marginTop: 18, color: '#C8CBD6', maxWidth: 900, lineHeight: 1.4 }}>
            Empowering curious minds through mathematical olympiads, computational hackathons, and creative problem solving.
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: 20,
            width: '100%',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: '#9CA3AF' }}>
            <span>Chennai, Tamil Nadu</span>
            <span style={{ color: '#FF6B00' }}>|</span>
            <span style={{ color: '#FF6B00' }}>@infinitus_club.rit</span>
          </div>

          <div style={{ display: 'flex', fontSize: 16, fontWeight: 700, color: '#FF6B00' }}>
            <span>infinitus-rit.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
