import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { GoogleAd, GoogleAdsObserver, AdSenseScript } from "../src";

const ins = (c: HTMLElement) => c.querySelector("ins") as HTMLModElement;

const markStatus = (el: HTMLElement, status: "filled" | "unfilled") => {
  if (status === "filled" && !el.querySelector("iframe")) {
    el.appendChild(document.createElement("iframe"));
  }
  el.setAttribute("data-adsbygoogle-status", "done");
  el.setAttribute("data-ad-status", status);
};

beforeEach(() => {
  document.head.innerHTML = "";
  window.adsbygoogle = [] as unknown as Window["adsbygoogle"];
});
afterEach(() => vi.restoreAllMocks());

describe("GoogleAd", () => {
  it("renders an <ins> carrying the AdSense data attributes", () => {
    const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" />);
    const el = ins(container);
    expect(el.getAttribute("data-ad-client")).toBe("ca-pub-123");
    expect(el.getAttribute("data-ad-slot")).toBe("456");
  });

  it("applies the documented format defaults", () => {
    const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" />);
    const el = ins(container);
    expect(el.getAttribute("data-ad-format")).toBe("auto");
    expect(el.getAttribute("data-full-width-responsive")).toBe("true");
  });

  it("supports in-feed layout attributes", () => {
    const { container } = render(
      <GoogleAd clientId="ca-pub-123" slot="456" adLayout="in-article" adLayoutKey="-fb+5w" />
    );
    const el = ins(container);
    expect(el.getAttribute("data-ad-layout")).toBe("in-article");
    expect(el.getAttribute("data-ad-layout-key")).toBe("-fb+5w");
  });

  it("keeps a caller className alongside the AdSense one", () => {
    const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" className="mine" />);
    expect(ins(container).className).toContain("mine");
    expect(ins(container).className).toContain("adsbygoogle");
  });

  it("pushes exactly one request per mount", () => {
    render(<GoogleAd clientId="ca-pub-123" slot="456" />);
    expect(window.adsbygoogle).toHaveLength(1);
  });

  it("does not throw when the adsbygoogle queue rejects the push", () => {
    window.adsbygoogle = { push: () => { throw new Error("adsense down"); } } as never;
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<GoogleAd clientId="ca-pub-123" slot="456" />)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it("is labelled for assistive technology", () => {
    render(<GoogleAd clientId="ca-pub-123" slot="456" />);
    expect(screen.getByLabelText("Advertisement")).toBeInTheDocument();
  });

  describe("layout stability", () => {
    it("reserves height before the ad resolves", () => {
      const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" />);
      expect(ins(container).style.minHeight).toBe("250px");
    });

    it("accepts a custom reserved height", () => {
      const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" minHeight={90} />);
      expect(ins(container).style.minHeight).toBe("90px");
    });

    it("releases the reservation once filled", async () => {
      const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" />);
      markStatus(ins(container), "filled");
      await waitFor(() => expect(ins(container).style.minHeight).toBe(""));
    });
  });

  describe("unfilled handling", () => {
    it("collapses an unfilled slot", async () => {
      const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" />);
      markStatus(ins(container), "unfilled");
      await waitFor(() => expect(ins(container).style.display).toBe("none"));
    });

    it("leaves a filled slot visible", async () => {
      const { container } = render(<GoogleAd clientId="ca-pub-123" slot="456" />);
      markStatus(ins(container), "filled");
      await new Promise((r) => setTimeout(r, 30));
      expect(ins(container).style.display).not.toBe("none");
    });

    it("can be told not to collapse", async () => {
      const { container } = render(
        <GoogleAd clientId="ca-pub-123" slot="456" collapseOnUnfilled={false} />
      );
      markStatus(ins(container), "unfilled");
      await new Promise((r) => setTimeout(r, 30));
      expect(ins(container).style.display).not.toBe("none");
    });

    it("renders a fallback instead of an empty gap", async () => {
      const { container } = render(
        <GoogleAd clientId="ca-pub-123" slot="456" fallback={<p>Support us</p>} />
      );
      markStatus(ins(container), "unfilled");
      expect(await screen.findByText("Support us")).toBeInTheDocument();
    });

    it("reports outcomes through callbacks", async () => {
      const onUnfilled = vi.fn();
      const { container } = render(
        <GoogleAd clientId="ca-pub-123" slot="456" onUnfilled={onUnfilled} />
      );
      markStatus(ins(container), "unfilled");
      await waitFor(() => expect(onUnfilled).toHaveBeenCalled());
    });
  });

  describe("lazy loading", () => {
    it("does not request until the slot is observed", () => {
      const observe = vi.fn();
      vi.stubGlobal("IntersectionObserver", class {
        observe = observe;
        disconnect = vi.fn();
        constructor(public cb: unknown) {}
      });
      render(<GoogleAd clientId="ca-pub-123" slot="456" lazy />);
      expect(window.adsbygoogle).toHaveLength(0);
      expect(observe).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it("requests once the slot intersects", async () => {
      let trigger: ((e: unknown[]) => void) | null = null;
      vi.stubGlobal("IntersectionObserver", class {
        constructor(cb: (e: unknown[]) => void) { trigger = cb; }
        observe = vi.fn();
        disconnect = vi.fn();
      });
      render(<GoogleAd clientId="ca-pub-123" slot="456" lazy />);
      trigger!([{ isIntersecting: true }]);
      await waitFor(() => expect(window.adsbygoogle).toHaveLength(1));
      vi.unstubAllGlobals();
    });
  });

  it("requests a fresh ad when refreshKey changes", () => {
    const { rerender } = render(<GoogleAd clientId="ca-pub-123" slot="456" refreshKey={1} />);
    rerender(<GoogleAd clientId="ca-pub-123" slot="456" refreshKey={2} />);
    expect(window.adsbygoogle).toHaveLength(2);
  });
});

describe("AdSenseScript", () => {
  it("injects the AdSense script with the publisher id", () => {
    render(<AdSenseScript clientId="ca-pub-123" />);
    const el = document.querySelector("script[src*='adsbygoogle.js']") as HTMLScriptElement;
    expect(el.src).toContain("client=ca-pub-123");
    expect(el.async).toBe(true);
  });

  it("injects only once across several mounts", () => {
    render(<AdSenseScript clientId="ca-pub-123" />);
    render(<AdSenseScript clientId="ca-pub-123" />);
    expect(document.querySelectorAll("script[src*='adsbygoogle.js']")).toHaveLength(1);
  });

  it("can be gated on consent", () => {
    render(<AdSenseScript clientId="ca-pub-123" enabled={false} />);
    expect(document.querySelector("script[src*='adsbygoogle.js']")).toBeNull();
  });
});

describe("GoogleAdsObserver", () => {
  it("hides an unfilled slot rendered outside React", async () => {
    const el = document.createElement("ins");
    el.className = "adsbygoogle";
    document.body.appendChild(el);
    render(<GoogleAdsObserver />);
    markStatus(el, "unfilled");
    await waitFor(() => expect(el.style.display).toBe("none"));
  });

  it("leaves a filled slot alone", async () => {
    const el = document.createElement("ins");
    el.className = "adsbygoogle";
    document.body.appendChild(el);
    render(<GoogleAdsObserver />);
    markStatus(el, "filled");
    await new Promise((r) => setTimeout(r, 30));
    expect(el.style.display).not.toBe("none");
  });

  it("disconnects on unmount", () => {
    const disconnect = vi.fn();
    vi.spyOn(window, "MutationObserver").mockImplementation(function (this: never) {
      return { observe: vi.fn(), disconnect, takeRecords: vi.fn() } as never;
    });
    const { unmount } = render(<GoogleAdsObserver />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
