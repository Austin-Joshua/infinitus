'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

export default function Reveal({ children, className, delay = 0, y = 6, as = 'div' }) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      // Pre-triggers 250px before entering viewport so fast scroll never encounters blank content
      viewport={{ once: true, margin: '250px 0px 50px 0px' }}
      transition={{ duration: 0.16, delay: Math.min(delay, 0.03), ease: EASE.out }}
    >
      {children}
    </Component>
  );
}

/** A list whose items rise in swiftly once the list approaches viewport. */
export function Stagger({ children, className, as = 'div', stagger = 0.015 }) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '250px 0px 50px 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({ children, className, as = 'div', y = 6 }) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: EASE.out } },
      }}
    >
      {children}
    </Component>
  );
}

/** Uncovers its content swiftly like a sharp photographic print. */
export function ClipReveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 0.18, delay: Math.min(delay, 0.03), ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}
