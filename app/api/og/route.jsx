import { ImageResponse } from 'next/og';

/**
 * Dynamic Edge Open Graph image generator.
 * Generates custom 1200x630 social sharing cards on the Edge.
 * Query Parameters:
 *  - title: Main heading
 *  - category: Domain or category pill
 *  - date: Event date string
 *  - venue: Venue name or location
 *  - status: 'upcoming' | 'conducted'
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawTitle = searchParams.get('title') || 'INFINITUS Mathematics Club';
    const rawCategory = searchParams.get('category') || 'Mathematics & Algorithms';
    const rawDate = searchParams.get('date') || '';
    const rawVenue = searchParams.get('venue') || 'Rajalakshmi Institute of Technology';
    const status = searchParams.get('status') || 'upcoming';

    const title = String(rawTitle).replace(/[^\x20-\x7E]/g, ' ');
    const category = String(rawCategory).replace(/[^\x20-\x7E]/g, ' ');
    const date = String(rawDate).replace(/[^\x20-\x7E]/g, ' ');
    const venue = String(rawVenue).replace(/[^\x20-\x7E]/g, ' ');

    const isUpcoming = status === 'upcoming';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#090A10',
            backgroundImage:
              'radial-gradient(circle at 90% 10%, rgba(255, 107, 0, 0.22) 0%, rgba(9, 10, 16, 0) 60%), radial-gradient(circle at 10% 90%, rgba(0, 240, 255, 0.12) 0%, rgba(9, 10, 16, 0) 50%)',
            padding: '56px 64px',
            fontFamily: 'sans-serif',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          {/* Subtle math coordinate watermark grid */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255, 107, 0, 0.18)',
                  border: '1.5px solid rgba(255, 107, 0, 0.5)',
                }}
              >
                <svg viewBox="0 0 48 24" width="34" height="17" fill="none" stroke="#FF6B00" strokeWidth="4">
                  <path d="M24 12 C28 6 36 6 40 9 C44 12 44 16 40 19 C36 22 28 18 24 12 C20 6 12 6 8 9 C4 12 4 16 8 19 C12 22 20 18 24 12 Z" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, color: '#FFFFFF' }}>
                  INFINITUS
                </span>
                <span style={{ fontSize: 13, letterSpacing: 1.5, color: '#FF6B00', textTransform: 'uppercase' }}>
                  Mathematics Club
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: 9999,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                fontSize: 14,
                color: '#9CA3AF',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Rajalakshmi Institute of Technology
            </div>
          </div>

          {/* Central Title & Metadata */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              marginTop: 20,
              marginBottom: 20,
              width: '100%',
            }}
          >
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 16px',
                  borderRadius: 9999,
                  backgroundColor:
                    isUpcoming ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 107, 0, 0.15)',
                  border: `1.5px solid ${isUpcoming ? 'rgba(0, 240, 255, 0.45)' : 'rgba(255, 107, 0, 0.45)'}`,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 1.5,
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
                <span>{isUpcoming ? 'UPCOMING' : 'CONDUCTED'}</span>
              </div>

              {category ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 14px',
                    borderRadius: 9999,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: '#E5E7EB',
                  }}
                >
                  {category}
                </div>
              ) : null}
            </div>

            {/* Event / Page Title */}
            <div
              style={{
                display: 'flex',
                fontSize: title.length > 32 ? 50 : 62,
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: -1,
                color: '#FFFFFF',
                maxHeight: 140,
                overflow: 'hidden',
              }}
            >
              {title}
            </div>

            {/* Date and Venue Strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 20 }}>
              {date ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: '#F3F4F6' }}>
                  <span style={{ color: '#FF6B00', fontWeight: 700 }}>DATE:</span>
                  <span style={{ fontWeight: 600 }}>{date}</span>
                </div>
              ) : null}
              {venue ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: '#9CA3AF' }}>
                  <span style={{ color: '#00F0FF', fontWeight: 700 }}>VENUE:</span>
                  <span>{venue}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: 18,
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#9CA3AF' }}>
              <span style={{ color: '#FF6B00', fontWeight: 700 }}>Where logic meets innovation</span>
              <span>|</span>
              <span>Chennai, Tamil Nadu</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14,
                fontWeight: 700,
                color: '#FF6B00',
                letterSpacing: 0.5,
              }}
            >
              <span>infinitus-rit.vercel.app</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response(`Failed to generate OG image: ${error.message}`, { status: 500 });
  }
}
