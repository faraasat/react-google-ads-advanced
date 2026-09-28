import React from "react";

import {
  AdSenseScriptProps,
  AdStatus,
  IReactGoogleAdsAdvanced,
} from "./types";

import "./style.css";

const AD_CLASS = "gg-ads-c";
const SCRIPT_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

/**
 * Injects the AdSense script once per page.
 *
 * Optional — if you already load the script yourself, skip this. It exists so
 * the common case does not require hand-rolling a <Script> tag, and so the
 * injection can be gated on consent via `enabled`.
 */
export const AdSenseScript: React.FC<AdSenseScriptProps> = ({
  clientId,
  enabled = true,
}) => {
  React.useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const src = `${SCRIPT_SRC}?client=${encodeURIComponent(clientId)}`;
    if (document.querySelector(`script[src^="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    // Deliberately not removed on unmount: AdSense does not support being
    // torn down and re-added, and the script is page-global anyway.
  }, [clientId, enabled]);

  return null;
};

/** Reads the status AdSense has written onto a slot element. */
const readStatus = (el: HTMLElement): AdStatus => {
  if (el.getAttribute("data-adsbygoogle-status") !== "done") return "idle";

  const fill = el.getAttribute("data-ad-status");

  // `data-ad-status` is AdSense's own verdict, so trust it when present.
  // The DOM-shape fallback only applies when AdSense set no status at all: a
  // filled slot renders a cross-origin iframe whose childNodes are empty from
  // this document, so treating "no grandchildren" as unfilled would collapse
  // perfectly good ads.
  if (fill === "unfilled") return "unfilled";
  if (fill === "filled") return "filled";

  return el.childNodes.length === 0 || !el.querySelector("iframe")
    ? "unfilled"
    : "filled";
};

/**
 * A single AdSense slot.
 *
 * Reserves space up front, optionally defers the request until the slot nears
 * the viewport, and collapses (or swaps in a fallback) when AdSense has no ad
 * to serve.
 */
export const GoogleAd: React.FC<IReactGoogleAdsAdvanced> = ({
  slot,
  clientId,
  adFormat = "auto",
  adFullWidthResponsive = "true",
  adLayout,
  adLayoutKey,
  className,
  style,
  minHeight = 250,
  lazy = false,
  collapseOnUnfilled = true,
  fallback,
  label = "Advertisement",
  refreshKey,
  onFilled,
  onUnfilled,
  ...rest
}) => {
  const insRef = React.useRef<HTMLModElement>(null);
  const [status, setStatus] = React.useState<AdStatus>("idle");
  const [shouldRequest, setShouldRequest] = React.useState(!lazy);

  const callbacks = React.useRef({ onFilled, onUnfilled });
  callbacks.current = { onFilled, onUnfilled };

  // ── Lazy: wait until the slot is near the viewport ────────────────────────
  React.useEffect(() => {
    if (!lazy || shouldRequest) return;
    const el = insRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldRequest(true);
      return;
    }

    const margin = typeof lazy === "number" ? lazy : 200;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldRequest(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin}px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, shouldRequest]);

  // ── Request the ad ───────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!shouldRequest || typeof window === "undefined") return;

    setStatus("idle");
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("[react-google-ads-advanced] AdSense push failed", e);
    }
  }, [shouldRequest, refreshKey]);

  // ── Watch this slot's own status ─────────────────────────────────────────
  //
  // Observed per element rather than across document.body's whole subtree,
  // which is far cheaper on pages carrying several slots.
  React.useEffect(() => {
    const el = insRef.current;
    if (!el || typeof MutationObserver === "undefined") return;

    const sync = () => {
      const next = readStatus(el);
      setStatus((prev) => {
        if (prev === next) return prev;
        if (next === "filled") callbacks.current.onFilled?.();
        if (next === "unfilled") callbacks.current.onUnfilled?.();
        return next;
      });
    };

    const observer = new MutationObserver(sync);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-adsbygoogle-status", "data-ad-status"],
      childList: true,
      subtree: true,
    });

    sync();
    return () => observer.disconnect();
  }, [refreshKey]);

  const collapsed = status === "unfilled" && (collapseOnUnfilled || fallback);

  if (collapsed && fallback) return <>{fallback}</>;

  return (
    <ins
      {...rest}
      ref={insRef}
      className={`${AD_CLASS} adsbygoogle${className ? ` ${className}` : ""}`}
      aria-label={label}
      style={{
        // Reserve space until the outcome is known, so the page does not jump.
        ...(status === "idle" && minHeight
          ? { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }
          : {}),
        ...(collapsed ? { display: "none" } : {}),
        ...style,
      }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={adFormat}
      data-full-width-responsive={adFullWidthResponsive}
      {...(adLayout ? { "data-ad-layout": adLayout } : {})}
      {...(adLayoutKey ? { "data-ad-layout-key": adLayoutKey } : {})}
    />
  );
};

/**
 * Collapses unfilled AdSense slots anywhere on the page, including ones not
 * rendered by `GoogleAd`.
 *
 * `GoogleAd` manages itself, so you only need this for slots created outside
 * React.
 */
export const GoogleAdsObserver: React.FC<{ root?: HTMLElement | null }> = ({
  root,
}) => {
  React.useEffect(() => {
    if (typeof MutationObserver === "undefined" || typeof document === "undefined")
      return;

    const target = root ?? document.body;
    if (!target) return;

    const handle = (el: HTMLElement) => {
      if (readStatus(el) === "unfilled") {
        el.style.setProperty("display", "none", "important");
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          m.target instanceof HTMLElement &&
          m.target.tagName === "INS"
        ) {
          handle(m.target);
        }
      }
    });

    observer.observe(target, {
      subtree: true,
      attributeFilter: ["data-ad-status", "data-adsbygoogle-status"],
    });

    target.querySelectorAll<HTMLElement>("ins.adsbygoogle").forEach(handle);

    return () => observer.disconnect();
  }, [root]);

  return null;
};

export type {
  IReactGoogleAdsAdvanced,
  AdSenseScriptProps,
  AdStatus,
} from "./types";
