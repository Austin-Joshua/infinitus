import { COPY, SOCIAL } from '@/lib/site';
import Reveal, { Stagger, StaggerItem } from '@/components/ui/Reveal';
import SplitText from '@/components/ui/SplitText';
import Journey from '@/components/sections/Journey';

/** Body of the About page: mission statement, what we do, and the timeline. */
export default function AboutUs() {
  const { about } = COPY;

  return (
    <>
      <section className="section !py-16 sm:!py-24">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <h2 className="font-heading text-2xl font-medium leading-[1.25] text-fg sm:text-4xl lg:text-5xl">
            <SplitText text={about.statement} onView stagger={0.03} />{' '}
            <SplitText text={about.statementAccent} onView delay={0.3} className="italic text-accent" />
          </h2>
          <Reveal delay={0.2} className="space-y-4 self-end text-sm sm:text-base leading-relaxed text-muted">
            <p>{about.bodySecondary}</p>
            <p>{about.focus}</p>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-fg/15 bg-bg-2/50 !py-16 sm:!py-24">
        <div className="container-x">
          <Reveal className="flex items-baseline justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">Club Pillars</p>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl mt-1.5">What we do</h2>
            </div>
            <span className="font-mono text-xs text-muted">{about.pillars.length} programmes</span>
          </Reveal>

          <Stagger as="ol" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {about.pillars.map((pillar) => (
              <StaggerItem as="li" key={pillar.title} className="card card-hover group relative p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <span className="inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <h3 className="mt-4 font-heading text-xl font-bold text-fg transition-colors group-hover:text-accent">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted">{pillar.body}</p>
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
