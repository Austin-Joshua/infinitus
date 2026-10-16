import AboutUs from '@/components/sections/AboutUs';
import { COPY } from '@/lib/site';

export const metadata = {
  title: COPY.pages.about.title,
  description: COPY.pages.about.description,
};

export default function AboutPage() {
  return <AboutUs />;
}
