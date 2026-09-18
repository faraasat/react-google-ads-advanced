import React, { FC } from "react";

import { IReactGoogleAdsAdvanced } from "./types";

import "./style.css";

const adClass = "gg-ads-c";

const GoogleAd: React.FC<IReactGoogleAdsAdvanced> = (props) => {
  // Destructure props
  const {
    slot,
    clientId,
    adFormat = "auto",
    adFullWidthResponsive = "true",
    className,
    style,
    ...rest
  } = props;

  React.useEffect(() => {
    // Attempt to load ads
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  // Render the ad container
  return (
    <ins
      {...rest}
      className={`${adClass} adsbygoogle ${className ? className : ""}`}
      style={{ ...style }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={adFormat}
      data-full-width-responsive={adFullWidthResponsive}
    ></ins>
  );
};

const GoogleAdsObserver: FC<{}> = () => {
  React.useEffect(() => {
    const handleInsChange = (insEl: HTMLElement) => {
      const adStatus = insEl.getAttribute("data-adsbygoogle-status");
      const adFill = insEl.getAttribute("data-ad-status");

      if (adStatus !== "done") return;

      // `data-ad-status` is AdSense's own verdict, so trust it when present.
      // The DOM-shape fallback only applies when AdSense set no status at all:
      // a filled slot renders a cross-origin iframe whose childNodes are empty
      // from this document, so treating "no grandchildren" as unfilled used to
      // collapse perfectly good ads.
      const isUnfilled =
        adFill === "unfilled" ||
        (adFill === null &&
          (insEl.childNodes.length === 0 || !insEl.querySelector("iframe")));

      if (isUnfilled) {
        insEl.style.setProperty("display", "none", "important");
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Handle attribute changes
        if (
          mutation.type === "attributes" &&
          mutation.target instanceof HTMLElement &&
          mutation.target.tagName === "INS"
        ) {
          handleInsChange(mutation.target);
        }
      }
    });

    // Observe the entire body for changes in the subtree
    observer.observe(document.body, {
      childList: true, // when elements are added/removed
      subtree: true, // watch entire body
      attributeFilter: ["data-ad-status"], // only these attrs
    });

    // Cleanup when unmounted
    return () => observer.disconnect();
  }, []);

  return <></>;
};

export { GoogleAd, GoogleAdsObserver };
