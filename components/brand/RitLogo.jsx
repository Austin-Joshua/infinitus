import Image from 'next/image';
import { RIT_LOGO } from '@/lib/branding';
import { COLLEGE_NAME } from '@/lib/site';

const SIZE_MAP = {
  xs: { light: RIT_LOGO.sm, dark: RIT_LOGO.whiteSm, width: 160, height: 36, className: 'h-5 w-auto' },
  nav: {
    light: RIT_LOGO.md,
    dark: RIT_LOGO.whiteMd,
    width: 220,
    height: 49,
    className: 'h-[25px] sm:h-[30px] lg:h-[32px] w-auto max-w-[125px] sm:max-w-[145px] lg:max-w-[155px]',
  },
  sm: { light: RIT_LOGO.sm, dark: RIT_LOGO.whiteSm, width: 160, height: 36, className: 'h-7 w-auto sm:h-8' },
  md: { light: RIT_LOGO.md, dark: RIT_LOGO.whiteMd, width: 220, height: 49, className: 'h-8 sm:h-9 w-auto' },
  lg: { light: RIT_LOGO.lg, dark: RIT_LOGO.whiteLg, width: 280, height: 63, className: 'h-10 sm:h-12 w-auto' },
};

/**
 * RIT wordmark. Both variants are rendered and CSS picks one, so the right logo
 * shows on first paint in either theme (official white logo on dark, colour on light).
 */
export default function RitLogo({ size = 'md', priority = false, className = '' }) {
  const config = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <span className={`inline-flex items-center ${className}`.trim()}>
      <Image
        src={config.light}
        alt={COLLEGE_NAME}
        width={config.width}
        height={config.height}
        priority={priority}
        className={`object-contain dark:hidden ${config.className}`}
      />
      <Image
        src={config.dark}
        alt={COLLEGE_NAME}
        width={config.width}
        height={config.height}
        priority={priority}
        className={`hidden object-contain dark:block ${config.className}`}
      />
    </span>
  );
}
