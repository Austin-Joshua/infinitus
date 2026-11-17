import Link from 'next/link';
import Lemniscate from '@/components/ui/Lemniscate';
import { COPY } from '@/lib/site';

export const metadata = {
  title: 'Page Not Found | INFINITUS RIT',
  description: 'The requested page could not be found on the INFINITUS website.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-24 sm:pt-28">
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">404 · lim x→∞</p>
          <h1 className="h-display mt-4">{COPY.notFound.heading}</h1>
          <p className="lede mt-4 max-w-md">{COPY.notFound.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link href="/" className="btn-primary text-xs sm:text-sm">
              <span aria-hidden="true">←</span> {COPY.notFound.cta}
            </Link>
            <Link href="/events" className="btn-ghost text-xs sm:text-sm">
              Explore events <span aria-hidden="true" className="nudge">→</span>
            </Link>
            <Link href="/contact" className="btn-ghost text-xs sm:text-sm">
              Contact us
            </Link>
          </div>
        </div>
        <div
          role="img"
          aria-label="Lemniscate curve tending to infinity"
          className="flex items-center justify-center max-w-md mx-auto lg:max-w-none w-full"
        >
          <Lemniscate axes dot draw className="w-full max-w-md" />
        </div>
      </div>
    </section>
  );
}
