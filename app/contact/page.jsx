import PageHeader from '@/components/layout/PageHeader';
import ContactSection from '@/components/sections/ContactSection';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = pageMetadata({
  title: COPY.pages.contact.title,
  description: COPY.pages.contact.description,
  path: '/contact',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]);

export default function ContactPage() {
  const page = pageById('contact');
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHeader label={page.navLabel} title={COPY.contact.heading} intro={COPY.contact.intro} />
      <ContactSection />
    </>
  );
}
