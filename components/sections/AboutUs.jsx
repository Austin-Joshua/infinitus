import { COPY, SOCIAL } from '@/lib/site';
import Reveal, { Stagger, StaggerItem } from '@/components/ui/Reveal';
import SplitText from '@/components/ui/SplitText';
import Journey from '@/components/sections/Journey';

/** Body of the About page: mission statement, what we do, and the timeline. */
export default function AboutUs() {
  const { about } = COPY;

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-24 sm:pb-16 sm:pt-32">
        <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0" />
        <div className="container-x relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <h1 className="font-heading text-3xl font-bold leading-[1.15] text-fg sm:text-4xl lg:text-5xl tracking-tight">
            <SplitText text={about.statement} onView stagger={0.03} />{' '}
            <SplitText text={about.statementAccent} onView delay={0.3} className="italic text-accent" />
          </h1>
          <Reveal delay={0.2} className="space-y-4 self-end text-sm sm:text-base leading-relaxed text-muted">
            <p className="text-fg/90 font-medium">{about.body}</p>
            <p>{about.bodySecondary}</p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-bg-2/30 !py-14 sm:!py-20">
        <div className="container-x">
          <Reveal className="flex items-baseline justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">Club Pillars</p>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl mt-1.5">What we do</h2>
            </div>
            <span className="font-mono text-xs text-muted">{about.pillars.length} programmes</span>
          </Reveal>

          <Stagger as="ol" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {about.pillars.map((pillar) => (
              <StaggerItem as="li" key={pillar.title} className="card card-hover group relative p-6 sm:p-7 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <span className="inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <h3 className="mt-4 font-heading text-xl font-bold text-fg transition-colors group-hover:text-accent">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">{pillar.body}</p>
                {pillar.title.includes('Podcast') && (
                  <a
                    href={SOCIAL.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    Listen on Instagram <span aria-hidden="true">↗</span>
                  </a>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Journey heading={about.journeyHeading} steps={about.journey} />
    </>
  );
}
