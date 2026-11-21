import PageHeader from '@/components/layout/PageHeader';
import LiveHubView from '@/components/sections/LiveHubView';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = pageMetadata({
  title: COPY.pages.live.title,
  description: COPY.pages.live.description,
  path: '/live',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Live Symposium Hub', path: '/live' },
]);

export default function LivePage() {
  const page = pageById('live');

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHeader
        label={page?.navLabel || 'Live'}
        title="Symposium Live Hub"
        intro="Real-time operational tracking for INFINITUS National Mathematics Day 2026. Live rounds, campus venue maps, and finalist standings."
      />
      <LiveHubView />
    </>
  );
}
