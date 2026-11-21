import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { EVENTS } from '@/lib/data';
import { getEvent } from '@/lib/events';
import { formatEventDate } from '@/lib/format';
import { COLLEGE_NAME } from '@/lib/site';
import { OG_SIZE, OG_CONTENT_TYPE, getEventOgStaticParams } from '@/lib/ogHelper';

export const alt = 'INFINITUS Event Social Card';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getEventOgStaticParams();
}

export default async function EventOpengraphImage({ params }) {
  const resolved = await params;
  const id = decodeURIComponent(resolved?.id || '');
  const found = await getEvent(id);
  const event = found?.event || EVENTS.find((e) => e.id === id) || {
    id,
    title: 'INFINITUS Mathematical Event',
    eventType: 'Event',
    status: 'conducted',
  };

  const isUpcoming = event.status === 'upcoming';
  const rawDate = formatEventDate(event.eventDate || event.date, event.endDate);
  // Clean date and title of non-standard unicode symbols so Satori avoids dynamic font downloads
  const formattedDate = rawDate ? String(rawDate).replace(/[^\x20-\x7E]/g, ' ') : '';
  const cleanTitle = String(event.title || 'Mathematical Event').replace(/[^\x20-\x7E]/g, ' ');
  const cleanCategory = String(event.eventType || event.category || 'Mathematics').replace(/[^\x20-\x7E]/g, ' ');
  const cleanVenue = event.venue ? String(event.venue).replace(/[^\x20-\x7E]/g, ' ') : '';

  // Attempt to load club PNG logo
  let logoDataUri = null;
  try {
    const logoBuffer = await readFile(path.join(process.cwd(), 'public/brand/infinitus-og.png'));
    logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
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
          backgroundColor: '#090A10',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(255, 107, 0, 0.28) 0%, rgba(9, 10, 16, 0) 55%), radial-gradient(circle at 15% 85%, rgba(0, 240, 255, 0.16) 0%, rgba(9, 10, 16, 0) 50%)',
          padding: '48px 56px',
          fontFamily: 'sans-serif',
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        {/* Subtle coordinate grid lines */}
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

        {/* Left Column: Title & Metadata */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingRight: 40,
            zIndex: 10,
          }}
        >
          {/* Header Brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {logoDataUri ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoDataUri} width={44} height={44} alt="" style={{ borderRadius: 10 }} />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255, 107, 0, 0.2)',
                    border: '1px solid rgba(255, 107, 0, 0.5)',
                  }}
                >
                  <svg viewBox="0 0 48 24" width="32" height="16" fill="none" stroke="#FF6B00" strokeWidth="4">
                    <path d="M24 12 C28 6 36 6 40 9 C44 12 44 16 40 19 C36 22 28 18 24 12 C20 6 12 6 8 9 C4 12 4 16 8 19 C12 22 20 18 24 12 Z" />
                  </svg>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, color: '#FFFFFF' }}>
                  INFINITUS
                </span>
                <span style={{ fontSize: 11, letterSpacing: 1.5, color: '#FF6B00', textTransform: 'uppercase', fontWeight: 700 }}>
                  Mathematics Club
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: 9999,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                fontSize: 12,
                color: '#9CA3AF',
                fontWeight: 600,
              }}
            >
              RIT Chennai
            </div>
          </div>

          {/* Central Title & Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20, marginBottom: 20, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 14px',
                  borderRadius: 9999,
                  backgroundColor: isUpcoming ? 'rgba(0, 240, 255, 0.16)' : 'rgba(255, 107, 0, 0.16)',
                  border: `1.5px solid ${isUpcoming ? 'rgba(0, 240, 255, 0.5)' : 'rgba(255, 107, 0, 0.5)'}`,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: isUpcoming ? '#00F0FF' : '#FF6B00',
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: isUpcoming ? '#00F0FF' : '#FF6B00',
                    marginRight: 8,
                    display: 'flex',
                  }}
                />
                <span>{isUpcoming ? 'UPCOMING EVENT' : 'CONDUCTED ARCHIVE'}</span>
              </div>

              {cleanCategory ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px 12px',
                    borderRadius: 9999,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: '#E5E7EB',
                  }}
                >
                  {cleanCategory}
                </div>
              ) : null}
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: cleanTitle.length > 28 ? 44 : 54,
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: -1,
                color: '#FFFFFF',
                maxHeight: 130,
                overflow: 'hidden',
              }}
            >
              {cleanTitle}
            </div>

            {/* Date & Venue Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              {formattedDate ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, color: '#F3F4F6' }}>
                  <span style={{ color: '#FF6B00', fontWeight: 700, fontSize: 14 }}>DATE:</span>
                  <span style={{ fontWeight: 600 }}>{formattedDate}</span>
                </div>
              ) : null}
              {cleanVenue ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: '#9CA3AF' }}>
                  <span style={{ color: '#00F0FF', fontWeight: 700, fontSize: 14 }}>VENUE:</span>
                  <span>{cleanVenue}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: 16,
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', fontSize: 13, color: '#9CA3AF' }}>
              <span style={{ color: '#FF6B00', fontWeight: 700 }}>Where logic meets innovation</span>
            </div>
            <div style={{ display: 'flex', fontSize: 13, fontWeight: 700, color: '#FF6B00' }}>
              <span>infinitus-rit.vercel.app</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Mathematical Constellation & Card Frame */}
        <div
          style={{
            width: 380,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '100%',
              height: 480,
              borderRadius: 24,
              border: '2px solid rgba(255, 107, 0, 0.35)',
              backgroundColor: 'rgba(16, 20, 34, 0.85)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '36px 32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Geometric Concentric Rings */}
            <div
              style={{
                position: 'absolute',
                top: 50,
                right: -40,
                width: 220,
                height: 220,
                borderRadius: '50%',
                border: '1.5px dashed rgba(255, 107, 0, 0.25)',
                display: 'flex',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 80,
                right: -10,
                width: 160,
                height: 160,
                borderRadius: '50%',
                border: '1.5px solid rgba(0, 240, 255, 0.2)',
                display: 'flex',
              }}
            />

            {/* Top Emblem */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255, 107, 0, 0.15)',
                  border: '1.5px solid rgba(255, 107, 0, 0.6)',
                }}
              >
                <svg viewBox="0 0 48 24" width="36" height="18" fill="none" stroke="#FF6B00" strokeWidth="4">
                  <path d="M24 12 C28 6 36 6 40 9 C44 12 44 16 40 19 C36 22 28 18 24 12 C20 6 12 6 8 9 C4 12 4 16 8 19 C12 22 20 18 24 12 Z" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  Official Event
                </span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                  INFINITUS Series
                </span>
              </div>
            </div>

            {/* Middle Mathematical Concept Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                padding: '20px 18px',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', fontSize: 11, color: '#FF6B00', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                Mathematical Domain
              </div>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
                {cleanCategory || 'Mathematics & Logic'}
              </div>
              <div style={{ display: 'flex', fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                Algorithm Complexity • O(n log n)
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: 16,
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>
                {COLLEGE_NAME}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 11,
                  fontWeight: 800,
                  color: isUpcoming ? '#00F0FF' : '#FF6B00',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                {isUpcoming ? 'REGISTER NOW' : 'ARCHIVE'}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
