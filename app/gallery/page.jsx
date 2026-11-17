import PageHeader from '@/components/layout/PageHeader';
import GallerySection, { galleryPhotos } from '@/components/sections/GallerySection';
import { getEvents } from '@/lib/events';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd, absoluteUrl } from '@/lib/seo';
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
  const photos = galleryPhotos(events);

  const galleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'INFINITUS Mathematics Event Gallery',
    description: 'Visual chronicle of mathematics competitions, workshops, and student celebrations.',
    url: absoluteUrl('/gallery'),
    image: photos.slice(0, 15).map((p) => absoluteUrl(p.src)),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={galleryJsonLd} />
      <PageHeader label={page.navLabel} title={COPY.gallery.heading} />
      <GallerySection events={events} />
    </>
  );
}
