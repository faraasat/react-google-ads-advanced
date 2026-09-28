import React from "react";

export interface IReactGoogleAdsAdvanced
  extends Omit<
    React.DetailedHTMLProps<
      React.InsHTMLAttributes<HTMLModElement>,
      HTMLModElement
    >,
    "children"
  > {
  /** Google AdSense ad slot id. */
  slot: string;
  /** Google AdSense publisher id (`ca-pub-…`). */
  clientId: string;
  /** Maps to `data-ad-format`. Default `"auto"`. */
  adFormat?: string;
  /** Maps to `data-full-width-responsive`. Default `"true"`. */
  adFullWidthResponsive?: string;
  /** Maps to `data-ad-layout`, for in-feed/in-article units. */
  adLayout?: string;
  /** Maps to `data-ad-layout-key`. */
  adLayoutKey?: string;
  /** Extra class name for the ad container. */
  className?: string;
  /** Inline styles for the ad container. */
  style?: React.CSSProperties;

  /**
   * Reserve this height before the ad loads, to stop the page jumping when it
   * arrives. Accepts a number (px) or any CSS length.
   *
   * Unreserved ad slots are one of the most common causes of Cumulative
   * Layout Shift, so this defaults to `250` rather than `0`.
   */
  minHeight?: number | string;

  /**
   * Only request the ad once the slot is near the viewport.
   *
   * `true` uses a 200px margin; pass a number for your own margin in px.
   * Default `false`, because lazy slots below the fold earn less.
   */
  lazy?: boolean | number;

  /**
   * Hide the slot when AdSense reports it unfilled, so no blank gap is left.
   * Default `true`.
   */
  collapseOnUnfilled?: boolean;

  /**
   * Rendered in place of the ad when the slot comes back unfilled — house
   * promos, a newsletter nudge, anything. Implies `collapseOnUnfilled`.
   */
  fallback?: React.ReactNode;

  /** Accessible label for the slot. Default `"Advertisement"`. */
  label?: string;

  /** Change this value to request a fresh ad into the same slot. */
  refreshKey?: string | number;

  /** Fired once AdSense fills the slot. */
  onFilled?: () => void;
  /** Fired once AdSense reports the slot unfilled. */
  onUnfilled?: () => void;
}

export interface AdSenseScriptProps {
  /** Google AdSense publisher id (`ca-pub-…`). */
  clientId: string;
  /**
   * Skip injecting the script — useful when consent has not been granted yet.
   * Default `true`.
   */
  enabled?: boolean;
}

/** Status reported by AdSense for a slot. */
export type AdStatus = "idle" | "filled" | "unfilled";

declare global {
  interface Window {
    adsbygoogle: unknown[] & { push: (params: object) => number };
  }
}
