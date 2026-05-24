import { useEffect } from 'react';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap';

export const useGoogleFonts = () => {
  useEffect(() => {
    const existing = document.querySelector(
      `link[href="${FONTS_HREF}"]`,
    ) as HTMLLinkElement | null;
    if (existing) return;
    const link = document.createElement('link');
    link.href = FONTS_HREF;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);
};
