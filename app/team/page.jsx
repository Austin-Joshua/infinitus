import PageHeader from '@/components/layout/PageHeader';
import MembersGrid from '@/components/sections/MembersGrid';
import { getMembers } from '@/lib/members';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: COPY.pages.team.title,
  description: COPY.pages.team.description,
  path: '/team',
});

export default async function TeamPage() {
  const members = await getMembers();
  const page = pageById('team');
  return (
    <>
      <PageHeader label={page.navLabel} title={COPY.members.heading} intro={COPY.members.subheading} />
      <MembersGrid members={members} />
    </>
  );
}
