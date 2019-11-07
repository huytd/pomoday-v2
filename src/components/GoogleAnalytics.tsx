import * as React from 'react';
import { gaConfig } from '../../analytics.config.js';
import { useScript } from '../helpers/hooks';

export const GoogleAnalytics = () => {
  if (gaConfig.gaEnabled) {
    const [loaded, error] = useScript(
      `https://www.googletagmanager.com/gtag/js?id=${gaConfig.gaId}`,
      false,
    );
    const initScript = `window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '${gaConfig.gaId}');`;
    const [sloaded, serror] = useScript(initScript, true);
    return loaded && !error && sloaded && !serror ? <></> : null;
  }
  return null;
};
