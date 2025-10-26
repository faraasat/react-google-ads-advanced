import React, { FC } from "react";

import { IReactGoogleAdsAdvanced } from "./types";

import "./style.css";

const adClass = "gg-ads-c";

const GoogleAd: React.FC<IReactGoogleAdsAdvanced> = (props) => {
  const ref = React.useRef<HTMLModElement>(null);

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
      ref={ref}
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
      const iframe = insEl.querySelector("iframe");

      console.log("Ad element changed:", { adStatus, adFill, iframe });

      if (
        adStatus === "done" &&
        (adFill == "unfilled" ||
          insEl.childNodes.length == 0 ||
          insEl.childNodes[0] == null ||
          insEl.childNodes[0].childNodes.length === 0)
      ) {
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
          console.log("Attribute changed on INS:", mutation.target);
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
