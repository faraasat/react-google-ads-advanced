"use client";

import { useState } from "react";
import { GoogleAd, GoogleAdsObserver } from "react-google-ads-advanced";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { track } from "@/components/analytics";

export default function Home() {
  const [simulated, setSimulated] = useState<"filled" | "unfilled" | null>(null);

  // AdSense will not serve real ads on a demo domain, so the observer is
  // demonstrated against a stand-in <ins> carrying the same attributes
  // AdSense sets in production.
  const simulate = (status: "filled" | "unfilled") => {
    const el = document.getElementById("sim-ad");
    if (!el) return;
    el.style.removeProperty("display");
    if (status === "filled" && !el.querySelector("iframe")) {
      const frame = document.createElement("iframe");
      frame.title = "simulated ad";
      el.appendChild(frame);
    }
    if (status === "unfilled") el.replaceChildren();
    el.setAttribute("data-adsbygoogle-status", "done");
    el.setAttribute("data-ad-status", status);
    setSimulated(status);
    track("ad_status_simulated", { status });
  };

  return (
    <main className="wrap">
      <Hero />
      <GoogleAdsObserver />

      <section className="card">
        <h2>Unfilled-slot collapsing</h2>
        <p className="sub">
          <code>GoogleAdsObserver</code> watches for AdSense marking a slot{" "}
          <code>unfilled</code> and hides it, so you never ship a blank
          rectangle. Trigger either outcome below.
        </p>
        <div className="row">
          <button className="demo primary" onClick={() => simulate("filled")}>
            Simulate filled
          </button>
          <button className="demo" onClick={() => simulate("unfilled")}>
            Simulate unfilled
          </button>
        </div>

        <div style={{ marginTop: 20, border: "1px dashed var(--border)", borderRadius: 10, padding: 16 }}>
          <ins
            id="sim-ad"
            style={{ display: "block", minHeight: 90, background: "var(--panel-2)", borderRadius: 8 }}
          />
          <p className="sub" style={{ margin: "12px 0 0" }}>
            {simulated === null
              ? "Waiting — the slot is a placeholder until you pick an outcome."
              : simulated === "filled"
                ? "Marked filled: the slot stays visible."
                : "Marked unfilled: the observer collapsed it."}
          </p>
        </div>
      </section>

      <section className="card">
        <h2>Usage</h2>
        <p className="sub">
          Mount the observer once, then place slots wherever you need them.
        </p>
        <pre>{`import { GoogleAd, GoogleAdsObserver } from "react-google-ads-advanced";
import "react-google-ads-advanced/style.css";

export default function Layout({ children }) {
  return (
    <>
      <GoogleAdsObserver />
      {children}
      <GoogleAd clientId="ca-pub-XXXXXXXXXXXXXXXX" slot="1234567890" />
    </>
  );
}`}</pre>
      </section>

      <section className="card">
        <h2>A real slot</h2>
        <p className="sub">
          Rendered with a placeholder publisher id, so it stays empty here.
        </p>
        <GoogleAd clientId="ca-pub-0000000000000000" slot="0000000000" style={{ display: "block", minHeight: 60 }} />
      </section>

      <Footer />
    </main>
  );
}
