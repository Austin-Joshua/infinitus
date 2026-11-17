import AboutUs from '@/components/sections/AboutUs';
import { COPY } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = pageMetadata({
  title: COPY.pages.about.title,
  description: COPY.pages.about.description,
  path: '/about',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <AboutUs />
    </>
  );
}
