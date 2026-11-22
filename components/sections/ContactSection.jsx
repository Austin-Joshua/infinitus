import { COPY, SITE, SOCIAL } from '@/lib/site';
import Reveal from '@/components/ui/Reveal';

/**
 * Reusable full-format action card with title, description, and direct action button.
 */
function ContactActionCard({
  badge,
  title,
  value,
  description,
  buttonLabel,
  href,
  external = false,
  primary = false,
}) {
  return (
    <div className="card card-hover group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 sm:p-8 transition-all duration-300">
      <div>
        {badge && (
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            {badge}
          </span>
        )}
        <h2 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-fg">
          {title}
        </h2>
        {value && (
          <p className="mt-1 font-mono text-sm sm:text-base font-semibold text-sunset-orange break-all">
            {value}
          </p>
        )}
        {description && (
          <p className="mt-2.5 text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6 pt-2">
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
            primary
              ? 'btn-primary w-full sm:w-auto'
              : 'border border-fg/15 bg-fg/5 text-fg hover:bg-fg/10 hover:border-fg/30 w-full sm:w-auto'
          }`}
        >
          {buttonLabel} <span aria-hidden="true" className="nudge">→</span>
        </a>
      </div>
    </div>
  );
}

/** Body of the Contact page. */
export default function ContactSection() {
  const { contact } = COPY;

  return (
    <section className="section !pt-2 sm:!pt-3 pb-16 sm:pb-24">
      <div className="container-x max-w-5xl">
        {/* Top Section: Recruitment & Query Forms */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* 1. Core Member Recruitment Form */}
            <ContactActionCard
              badge={contact.recruitmentBadge || 'Recruitment 2026–27'}
              title={contact.recruitmentTitle || 'Core Member Recruitment 2026–27'}
              description={contact.recruitmentBody}
              buttonLabel={contact.recruitmentCta || 'Apply for Core Team'}
              href={SOCIAL.recruitmentForm}
              external
              primary
            />

            {/* 2. Website & Club Queries Form */}
            <ContactActionCard
              badge={contact.queriesBadge || 'General Queries'}
              title={contact.formTitle}
              description={contact.formBody}
              buttonLabel={contact.formCta}
              href={SOCIAL.queriesForm}
              external
              primary
            />
          </div>
        </Reveal>

        {/* Find Us Section: Social & Direct Reachout Cards */}
        <div className="mt-12 sm:mt-16">
          <Reveal delay={0.1}>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {contact.findUsHeading || 'Find Us'}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-4 sm:mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* 3. Email Card */}
              <ContactActionCard
                badge={contact.emailBadge || 'Email'}
                title={contact.emailTitle || 'Email Us'}
                value={SITE.contactEmail}
                description={contact.emailBody}
                buttonLabel={contact.emailCta || 'Send Email'}
                href={`mailto:${SITE.contactEmail}`}
              />

              {/* 4. Instagram Card */}
              <ContactActionCard
                badge={contact.instagramBadge || 'Instagram'}
                title={contact.instagramTitle || 'Instagram'}
                value={SOCIAL.instagramHandle}
                description={contact.instagramBody}
                buttonLabel={contact.instagramCta || 'Follow on Instagram'}
                href={SOCIAL.instagram}
                external
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
