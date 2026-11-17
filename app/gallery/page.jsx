import PageHeader from '@/components/layout/PageHeader';
import GallerySection from '@/components/sections/GallerySection';
import { getEvents } from '@/lib/events';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: COPY.pages.gallery.title,
  description: COPY.pages.gallery.description,
  path: '/gallery',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
]);

export default async function GalleryPage() {
  const events = await getEvents();
  const page = pageById('gallery');
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHeader label={page.navLabel} title={COPY.gallery.heading} />
      <GallerySection events={events} />
    </>
  );
}
