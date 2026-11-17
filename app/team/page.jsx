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
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHeader label={page.navLabel} title={COPY.members.heading} intro={COPY.members.subheading} />
      <MembersGrid members={members} />
    </>
  );
}
