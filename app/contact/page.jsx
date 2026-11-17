import PageHeader from '@/components/layout/PageHeader';
import ContactSection from '@/components/sections/ContactSection';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: COPY.pages.contact.title,
  description: COPY.pages.contact.description,
  path: '/contact',
});

export default function ContactPage() {
  const page = pageById('contact');
  return (
    <>
      <PageHeader label={page.navLabel} title={COPY.contact.heading} intro={COPY.contact.intro} />
      <ContactSection />
    </>
  );
}
