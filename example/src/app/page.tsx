"use client";

import { useState } from "react";
import { GoogleAd } from "react-google-ads-advanced";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { Code } from "@/components/code";
import { track } from "@/components/analytics";

/**
 * AdSense never serves real ads on a demo domain, so this page drives the
 * component with a stand-in <ins> carrying the same attributes AdSense sets in
 * production. Everything you see is the real component logic.
 */
function Simulator() {
  const [outcome, setOutcome] = useState<"idle" | "filled" | "unfilled">("idle");
  const [withFallback, setWithFallback] = useState(false);
  const [key, setKey] = useState(0);

  const simulate = (status: "filled" | "unfilled") => {
    const el = document.querySelector<HTMLElement>("#sim .adsbygoogle");
    if (!el) return;
    if (status === "filled" && !el.querySelector("iframe")) {
      const f = document.createElement("iframe");
      f.title = "simulated creative";
      f.style.cssText = "width:100%;height:90px;border:0;background:#1d2a3d";
      el.appendChild(f);
    }
    if (status === "unfilled") el.replaceChildren();
    el.setAttribute("data-adsbygoogle-status", "done");
    el.setAttribute("data-ad-status", status);
    setOutcome(status);
    track("ad_status_simulated", { status });
  };

  const reset = () => {
    setKey((k) => k + 1);
    setOutcome("idle");
  };

  return (
    <>
      <div className="row">
        <button className="demo primary" onClick={() => simulate("filled")}>
          Simulate filled
        </button>
        <button className="demo" onClick={() => simulate("unfilled")}>
          Simulate unfilled
        </button>
        <button className="demo" onClick={reset}>
          Reset
        </button>
        <button className="demo" onClick={() => { setWithFallback((f) => !f); reset(); }}>
          {withFallback ? "Fallback: on" : "Fallback: off"}
        </button>
      </div>

      <div id="sim" className="sim-slot">
        <GoogleAd
          key={`${key}-${withFallback}`}
          clientId="ca-pub-0000000000000000"
          slot="0000000000"
          minHeight={90}
          fallback={
            withFallback ? (
              <div className="ad-fallback">
                <strong>No ad to show</strong>
                <span>So here is a house promo instead — that is the `fallback` prop.</span>
              </div>
            ) : undefined
          }
        />
      </div>

      <dl className="state" style={{ marginTop: 16 }}>
        <dt>status</dt>
        <dd>
          <span className={`pill ${outcome === "unfilled" ? "off" : outcome === "filled" ? "on" : ""}`}>
            {outcome === "idle" ? "waiting — space reserved (90px)" : outcome}
          </span>
        </dd>
      </dl>
    </>
  );
}

export default function Home() {
  return (
    <main className="wrap">
      <Hero />

      <section className="card">
        <h2>Unfilled slots, handled</h2>
        <p className="sub">
          AdSense marks a slot <code>unfilled</code> when it has nothing to
          serve. Left alone that is a blank rectangle in your layout. Trigger
          either outcome below.
        </p>
        <Simulator />
      </section>

      <section className="card">
        <h2>Layout stability</h2>
        <p className="sub">
          Unreserved ad slots are a leading cause of{" "}
          <strong>Cumulative Layout Shift</strong>. The slot above reserves{" "}
          <code>minHeight: 90</code> before the ad resolves, then releases it —
          so the page never jumps.
        </p>
        <Code language="tsx">{`<GoogleAd clientId="ca-pub-XXXX" slot="123" minHeight={90} />`}</Code>
      </section>

      <section className="card">
        <h2>Lazy loading</h2>
        <p className="sub">
          Defer the request until the slot nears the viewport. Off by default —
          a slot that is never requested never earns, so lazy-load the ones well
          below the fold rather than all of them.
        </p>
        <Code language="tsx">{`<GoogleAd clientId="ca-pub-XXXX" slot="123" lazy={400} />`}</Code>
      </section>

      <section className="card">
        <h2>Usage</h2>
        <Code language="tsx">{`import { AdSenseScript, GoogleAd } from "react-google-ads-advanced";
import "react-google-ads-advanced/style.css";

export default function Layout({ children }) {
  return (
    <>
      <AdSenseScript clientId="ca-pub-XXXX" enabled={hasAdConsent} />
      {children}
      <GoogleAd
        clientId="ca-pub-XXXX"
        slot="1234567890"
        minHeight={90}
        fallback={<NewsletterSignup />}
      />
    </>
  );
}`}</Code>
      </section>

      <Footer />
    </main>
  );
}
