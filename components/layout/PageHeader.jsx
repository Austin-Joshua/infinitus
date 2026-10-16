'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SplitText from '@/components/ui/SplitText';
import { EASE, introDelay } from '@/lib/motion';

/**
 * Opening band for inner pages: clean breadcrumb, headline that animates in, and descriptive intro.
 */
export default function PageHeader({ label, title, intro, children }) {
  const ref = useRef(null);
  const [start] = useState(introDelay);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <header ref={ref} className="relative overflow-hidden pb-6 pt-24 sm:pb-10 sm:pt-32">
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0" />

      <motion.div style={{ opacity: contentOpacity }} className="container-x relative">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SplitText
            as="h1"
            text={title}
            className="font-heading text-3xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-4xl lg:text-5xl"
          />
          {(intro || children) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: start + 0.25, ease: EASE.out }}
              className="max-w-xl"
            >
              {intro && <p className="lede !text-sm sm:!text-base">{intro}</p>}
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>
    </header>
  );
}
