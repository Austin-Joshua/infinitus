import { COPY, SITE, SOCIAL } from '@/lib/site';
import Reveal from '@/components/ui/Reveal';

function ContactRow({ href, label, value, external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className="card card-hover group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl p-5 sm:p-6 mb-3.5 transition-all duration-300 hover:shadow-md"
    >
      <div>
        <span className="block font-mono text-xs uppercase tracking-widest text-muted">{label}</span>
        <span className="mt-1 block break-all font-heading text-lg font-bold text-fg transition-colors group-hover:text-accent sm:text-2xl">
          {value}
        </span>
      </div>
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fg/5 text-muted transition-all duration-300 group-hover:bg-accent group-hover:text-white"
      >
        ↗
      </span>
    </a>
  );
}

/** Body of the Contact page. */
export default function ContactSection() {
  const { contact } = COPY;

  return (
    <section className="section !pt-4 sm:!pt-6">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <ContactRow href={`mailto:${SITE.contactEmail}`} label="Email" value={SITE.contactEmail} />
          <ContactRow href={SOCIAL.instagram} label="Instagram" value={SOCIAL.instagramHandle} external />
          <ContactRow href={SOCIAL.queriesForm} label="Google Form" value={contact.formTitle} external />
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col gap-8">
          <div className="card p-7 sm:p-8">
            <p className="font-heading text-xl font-semibold text-fg">{contact.formTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{contact.formBody}</p>
            <a href={SOCIAL.queriesForm} target="_blank" rel="noreferrer noopener" className="btn-primary mt-6 w-full">
              {contact.formCta} <span aria-hidden="true" className="nudge">→</span>
            </a>
          </div>
          <address className="not-italic text-sm leading-relaxed text-muted">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Find us</p>
            <p className="mt-3 font-medium text-fg">{contact.orgLine}</p>
            {contact.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
        </Reveal>
      </div>
    </section>
  );
}
