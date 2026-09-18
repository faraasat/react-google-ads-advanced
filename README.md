<p align="center">
  <img src="https://raw.githubusercontent.com/faraasat/react-google-ads-advanced/main/.github/assets/banner.svg" alt="react-google-ads-advanced" width="100%" />
</p>

<p align="center">
  Google AdSense for React that collapses unfilled slots instead of leaving blank gaps in your layout.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-google-ads-advanced"><img alt="npm version" src="https://img.shields.io/npm/v/react-google-ads-advanced?color=cb3837&label=npm&logo=npm"></a>
  <a href="https://www.npmjs.com/package/react-google-ads-advanced"><img alt="downloads" src="https://img.shields.io/npm/dm/react-google-ads-advanced?color=cb3837&label=downloads"></a>
  <a href="https://bundlephobia.com/package/react-google-ads-advanced"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/react-google-ads-advanced?label=minzipped"></a>
  <a href="https://github.com/faraasat/react-google-ads-advanced/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/faraasat/react-google-ads-advanced/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="types" src="https://img.shields.io/badge/types-included-3178c6?logo=typescript&logoColor=white">
  <a href="https://github.com/faraasat/react-google-ads-advanced/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/react-google-ads-advanced?color=blue"></a>
</p>

<p align="center">
  <a href="https://faraasat.github.io/react-google-ads-advanced/"><b>Live demo</b></a> ·
  <a href="https://www.npmjs.com/package/react-google-ads-advanced">npm</a> ·
  <a href="https://github.com/faraasat/react-google-ads-advanced/blob/main/CHANGELOG.md">Changelog</a> ·
  <a href="https://github.com/faraasat/react-google-ads-advanced/issues">Issues</a>
</p>

---

## Why

A plain `<ins class="adsbygoogle">` leaves a visible empty rectangle whenever
AdSense has no ad to serve — which is common on low-traffic pages and in
unsupported regions. This package renders the slot *and* ships a small observer
that hides slots AdSense reports as unfilled, so your layout closes up cleanly.

## Installation

```bash
npm install react-google-ads-advanced
```

<details>
<summary>yarn / pnpm / bun</summary>

```bash
yarn add react-google-ads-advanced
pnpm add react-google-ads-advanced
bun add react-google-ads-advanced
```
</details>

**Peer dependencies:** `react >= 17`, `react-dom >= 17`.

## Quick start

Load the AdSense script once in your document head, mount the observer once,
then place slots wherever you need them.

```tsx
import { GoogleAd, GoogleAdsObserver } from "react-google-ads-advanced";
import "react-google-ads-advanced/style.css";

export default function Layout({ children }) {
  return (
    <>
      <GoogleAdsObserver />
      {children}
      <GoogleAd clientId="ca-pub-XXXXXXXXXXXXXXXX" slot="1234567890" />
    </>
  );
}
```

<details>
<summary>Loading the AdSense script in Next.js</summary>

```tsx
import Script from "next/script";

<Script
  async
  strategy="afterInteractive"
  crossOrigin="anonymous"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
/>
```
</details>

> **Next.js App Router:** the package ships the `"use client"` directive, so it
> can be imported directly from a server component.

## `<GoogleAd />`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | — | **Required.** Your AdSense publisher id (`ca-pub-…`). |
| `slot` | `string` | — | **Required.** The ad slot id. |
| `adFormat` | `string` | `"auto"` | Maps to `data-ad-format`. |
| `adFullWidthResponsive` | `string` | `"true"` | Maps to `data-full-width-responsive`. |
| `className` | `string` | — | Appended to the built-in classes. |
| `style` | `CSSProperties` | — | Inline styles for the `<ins>`. |

Any other prop is spread onto the underlying `<ins>` element.

```tsx
<GoogleAd
  clientId="ca-pub-XXXXXXXXXXXXXXXX"
  slot="1234567890"
  adFormat="rectangle"
  style={{ display: "block", minHeight: 250 }}
/>
```

## `<GoogleAdsObserver />`

Mount this **once**, near the root of your app. It watches the document for
AdSense updating `data-ad-status` and hides any slot reported as `unfilled`.

```tsx
<GoogleAdsObserver />
```

Detection trusts AdSense's own `data-ad-status` attribute when it is present.
Only when AdSense sets no status at all does it fall back to inspecting the
slot's contents — a filled slot renders a cross-origin iframe whose children
are not visible from your document, so treating "looks empty" as unfilled would
otherwise collapse perfectly good ads.

The observer disconnects itself on unmount.

## Notes

- Ads will not render on `localhost` or on an unapproved domain. Expect empty
  slots in development; that is AdSense, not this package.
- Ad blockers prevent the AdSense script from loading at all. Pair this with
  [`react-adblocker-detect`](https://github.com/faraasat/react-adblocker-detect)
  if you want to detect that case.
- Respect consent before serving personalised ads — see
  [`react-consent-management-banner`](https://github.com/faraasat/react-consent-management-banner).

## Contributing

Issues and pull requests are welcome.

```bash
git clone https://github.com/faraasat/react-google-ads-advanced.git
cd react-google-ads-advanced
npm install
npm test          # vitest
npm run typecheck # tsc --noEmit
npm run build     # tsup
```

To run the demo site against your local build:

```bash
npm run example:dev
```

Releases are manual — nothing publishes on a push to `main`. Maintainers run
the **Release** workflow from the Actions tab.

## Privacy

The published package contains **no telemetry**. The demo site at
[faraasat.github.io/react-google-ads-advanced](https://faraasat.github.io/react-google-ads-advanced/) uses
Google Analytics and Aptabase; the library itself never phones home.

## License

[MIT](./LICENSE) © [Farasat Ali](https://github.com/faraasat)
