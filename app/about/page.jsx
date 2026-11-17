import AboutUs from '@/components/sections/AboutUs';
import { COPY } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: COPY.pages.about.title,
  description: COPY.pages.about.description,
  path: '/about',
});

export default function AboutPage() {
  return <AboutUs />;
}
