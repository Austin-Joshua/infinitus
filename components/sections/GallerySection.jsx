import { GALLERY } from '@/lib/data';
import GalleryGrid from '@/components/ui/GalleryGrid';

/** Event photos used on the Gallery page and the home-page strip. */
export function galleryPhotos(events) {
  // Bundled photos first, then any photos attached to events in Supabase
  const eventPhotos = events.flatMap((event) =>
    (event.images || []).map((src, i) => ({
      src,
      width: 1080,
      height: 1350,
      // TODO(owner): replace generic caption with short scene description for each event photograph
      caption: `${event.title} — photo ${i + 1}`,
      alt: `${event.title} event photograph ${i + 1}`,
    }))
  );
  return [...GALLERY, ...eventPhotos];
}

/** Body of the Gallery page. */
export default function GallerySection({ events }) {
  const photos = galleryPhotos(events);

  return (
    <section
      role="region"
      aria-label="Photo Gallery"
      tabIndex={-1}
      className="section !pt-2 sm:!pt-3 pb-28 sm:pb-36 min-h-[2600px] focus:outline-none"
    >
      <div className="container-x">
        <GalleryGrid photos={photos} />
      </div>
    </section>
  );
}
