import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { GoogleAd, GoogleAdsObserver } from "../src";

describe("GoogleAd", () => {
  beforeEach(() => {
    window.adsbygoogle = [];
  });
  afterEach(() => vi.restoreAllMocks());

  const ins = (c: HTMLElement) => c.querySelector("ins") as HTMLModElement;

  it("renders an <ins> carrying the AdSense data attributes", () => {
    const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" />);
    const el = ins(container);
    expect(el.getAttribute("data-ad-client")).toBe("ca-pub-123");
    expect(el.getAttribute("data-ad-slot")).toBe("456");
  });

  it("applies the documented adFormat and responsive defaults", () => {
    const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" />);
    const el = ins(container);
    expect(el.getAttribute("data-ad-format")).toBe("auto");
    expect(el.getAttribute("data-full-width-responsive")).toBe("true");
  });

  it("lets callers override the format and keeps their className", () => {
    const { container } = render(
      <GoogleAd clientId="ca-pub-123" slot="456" adFormat="rectangle" className="mine" />
    );
    const el = ins(container);
    expect(el.getAttribute("data-ad-format")).toBe("rectangle");
    expect(el.className).toContain("mine");
    expect(el.className).toContain("adsbygoogle");
  });

  it("pushes exactly one request onto the adsbygoogle queue per mount", () => {
    render(<GoogleAd clientId="ca-pub-123" slot="456" />);
    expect(window.adsbygoogle).toHaveLength(1);
  });

  it("does not throw when the adsbygoogle queue rejects the push", () => {
    window.adsbygoogle = { push: () => { throw new Error("adsense down"); } };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<GoogleAd clientId="ca-pub-123" slot="456" />)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });
});

describe("GoogleAdsObserver", () => {
  it("hides an <ins> that AdSense reports as unfilled", async () => {
    const el = document.createElement("ins");
    document.body.appendChild(el);
    render(<GoogleAdsObserver />);

    el.setAttribute("data-adsbygoogle-status", "done");
    el.setAttribute("data-ad-status", "unfilled");

    await vi.waitFor(() => expect(el.style.display).toBe("none"));
  });

  it("leaves a filled ad slot visible", async () => {
    const el = document.createElement("ins");
    el.appendChild(document.createElement("iframe"));
    document.body.appendChild(el);
    render(<GoogleAdsObserver />);

    el.setAttribute("data-adsbygoogle-status", "done");
    el.setAttribute("data-ad-status", "filled");

    await new Promise((r) => setTimeout(r, 20));
    expect(el.style.display).not.toBe("none");
  });

  it("disconnects its observer on unmount", () => {
    const disconnect = vi.fn();
    vi.spyOn(window, "MutationObserver").mockImplementation(function (this: any) {
      this.observe = vi.fn();
      this.disconnect = disconnect;
    } as any);
    const { unmount } = render(<GoogleAdsObserver />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
