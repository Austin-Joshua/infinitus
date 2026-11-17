import PageHeader from '@/components/layout/PageHeader';
import MembersGrid from '@/components/sections/MembersGrid';
import { getMembers } from '@/lib/members';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: COPY.pages.team.title,
  description: COPY.pages.team.description,
  path: '/team',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Team', path: '/team' },
]);

export default async function TeamPage() {
  const members = await getMembers();
  const page = pageById('team');

  const teamJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'INFINITUS Core Team 2026–2027',
    description: 'Executive committee and student domain coordinators of INFINITUS Mathematics Club.',
    itemListElement: members.map((m, i) => ({
      '@type': 'Person',
      position: i + 1,
      name: m.name,
      jobTitle: m.role,
      worksFor: {
        '@type': 'Organization',
        name: 'INFINITUS',
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={teamJsonLd} />
      <PageHeader label={page.navLabel} title={COPY.members.heading} />
      <MembersGrid members={members} />
    </>
  );
}
