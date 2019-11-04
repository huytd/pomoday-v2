import * as React from 'react';
import { gaConfig } from '../../analytics.config.js';

export const GoogleAnalytics = () => {
  if (gaConfig.gaEnabled) {
    const gtagUrl = `https://www.googletagmanager.com/gtag/js?id=${gaConfig.gaId}`;
    const initScript = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '${gaConfig.gaId}');
    `;
    return <>
      <script async src={gtagUrl}></script>
      <script dangerouslySetInnerHTML={{__html: initScript}}></script>
    </>;
  }
  return <></>;
};