import * as React from 'react';
import { useScript } from '../helpers/hooks';

export const GoogleAnalytics = () => {
  const trackable = parseInt(process.env.TRACKING) || 0;
  const gaId = process.env.GAID || '';
  if (trackable && gaId) {
    const [loaded, error] = useScript(
      `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
      false,
    );
    const initScript = `window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '${gaId}');`;
    const [sloaded, serror] = useScript(initScript, true);
    return loaded && !error && sloaded && !serror ? <></> : null;
  }
  return null;
};
