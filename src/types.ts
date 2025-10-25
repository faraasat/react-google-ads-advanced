import React from "react";

export interface IReactGoogleAdsAdvanced
  extends React.DetailedHTMLProps<
    React.InsHTMLAttributes<HTMLModElement>,
    HTMLModElement
  > {
  // Google AdSense Ad Slot ID
  slot: string;
  // Google AdSense Publisher ID
  clientId: string;
  // Ad format
  adFormat?: string;
  // Full width responsive ad setting
  adFullWidthResponsive?: string;
  // Additional class name for styling
  className?: string;
  // Inline styles for the ad container
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    // @ts-ignore
    adsbygoogle: any;
  }
}
