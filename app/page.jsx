import Hero from '@/components/sections/Hero';
import {
  CtaBand,
  HomeEvents,
  HomeExplore,
  HomeGallery,
  HomeInstagram,
  HomeTeam,
  KeywordMarquee,
} from '@/components/sections/home/HomeSections';
import { galleryPhotos } from '@/components/sections/GallerySection';
import { getMembers } from '@/lib/members';
import { getEvents } from '@/lib/events';
import { SITE, CLUB_NAME, COLLEGE_NAME } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = pageMetadata({
  title: `${CLUB_NAME} — Mathematics Club | ${COLLEGE_NAME}`,
  description:
    'Official website of INFINITUS, the Mathematics Club of Rajalakshmi Institute of Technology (RIT Chennai). Campus olympiads, SHINKA 2026, PiDoku, algorithm challenges, applied workshops, and competitive mathematics problem solving.',
  path: '/',
});

const homeBreadcrumbs = breadcrumbJsonLd([{ name: 'Home', path: '/' }]);

export const revalidate = 60;

/** Home: a tour of the club, with each section leading to its own page. */
export default async function Home() {
  const [members, events] = await Promise.all([getMembers(), getEvents()]);
  const pastEvents = events.filter((e) => e.status !== 'upcoming');

  const stats = [
    { value: pastEvents.length, label: 'Events hosted' },
    { value: members.length, label: 'Core members' },
    { value: new Set(members.map((m) => m.department).filter(Boolean)).size, label: 'Departments' },
  ];

  return (
    <>
      <JsonLd data={homeBreadcrumbs} />
      <Hero stats={stats} />
      <KeywordMarquee />
      <HomeExplore />
      <HomeEvents events={events} />
      <HomeTeam members={members} />
      <HomeGallery photos={galleryPhotos(events)} />
      <HomeInstagram />
      <CtaBand />
    </>
  );
}
