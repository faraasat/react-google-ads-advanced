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

## Upgrading from 1.x

`2.0.0` adds reserved space, lazy loading, fallbacks and a script loader. Props
are backwards compatible, but three defaults changed.

| Change | Impact | What to do |
| --- | --- | --- |
| **Slots reserve `minHeight: 250` by default** | Space is held before the ad resolves, then released. This is deliberate — unreserved slots are a leading cause of Cumulative Layout Shift | Match it to your real slot, e.g. `minHeight={90}`, or `minHeight={0}` for the old behaviour |
| **The stylesheet no longer sets `z-index: 100 !important`** | Ads no longer stack above your navigation or dialogs | Set a `z-index` yourself if a layout genuinely needs one |
| **The stylesheet no longer sets `display: flex`** | AdSense controls its own layout again | Usually nothing |

`<GoogleAdsObserver />` is now only needed for slots created **outside** React
— `<GoogleAd />` observes itself. Leaving it mounted is harmless.

The slot is also exposed as a `complementary` landmark labelled
"Advertisement", so screen-reader users can identify and skip it.

### New, optional

```tsx
<AdSenseScript clientId="ca-pub-XXXX" enabled={hasAdConsent} />
<GoogleAd clientId="ca-pub-XXXX" slot="123" lazy={400} fallback={<Newsletter />} />
```

## Why

A plain `<ins class="adsbygoogle">` has three problems: it leaves a blank
rectangle whenever AdSense has nothing to serve, it reserves no space so the
page jumps when the ad arrives, and it requests every slot immediately even the
ones far below the fold.

This package fixes all three, and stays out of the way otherwise.

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

```tsx
import { AdSenseScript, GoogleAd } from "react-google-ads-advanced";
import "react-google-ads-advanced/style.css";

export default function Layout({ children }) {
  return (
    <>
      <AdSenseScript clientId="ca-pub-XXXXXXXXXXXXXXXX" />
      {children}
      <GoogleAd clientId="ca-pub-XXXXXXXXXXXXXXXX" slot="1234567890" />
    </>
  );
}
```

> **Next.js App Router:** the package ships the `"use client"` directive, so it
> imports straight into a server component.

## `<AdSenseScript />`

Loads the AdSense script once per page. Optional — skip it if you already load
the script yourself.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | — | **Required.** Publisher id. |
| `enabled` | `boolean` | `true` | Set `false` to hold off until consent is granted. |

```tsx
// Only load the script once the visitor has accepted advertising cookies.
<AdSenseScript clientId="ca-pub-XXXX" enabled={consent.ad_storage} />
```

## `<GoogleAd />`

### Core

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | — | **Required.** Publisher id (`ca-pub-…`). |
| `slot` | `string` | — | **Required.** Ad slot id. |
| `adFormat` | `string` | `"auto"` | Maps to `data-ad-format`. |
| `adFullWidthResponsive` | `string` | `"true"` | Maps to `data-full-width-responsive`. |
| `adLayout` | `string` | — | For in-article / in-feed units. |
| `adLayoutKey` | `string` | — | Maps to `data-ad-layout-key`. |
| `className` / `style` | — | — | Applied to the slot. |

Any other prop is spread onto the underlying `<ins>`.

### Layout stability

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `minHeight` | `number \| string` | `250` | Space reserved until the outcome is known, then released. |

Unreserved ad slots are one of the most common causes of **Cumulative Layout
Shift**, so this defaults to `250` rather than `0`. Match it to the slot you
configured in AdSense:

```tsx
<GoogleAd clientId="ca-pub-XXXX" slot="123" minHeight={90} />
```

### Lazy loading

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `lazy` | `boolean \| number` | `false` | Defer the request until the slot nears the viewport. `true` uses a 200px margin; a number sets your own, in px. |

```tsx
<GoogleAd clientId="ca-pub-XXXX" slot="123" lazy={400} />
```

Off by default: a slot that is never requested never earns, so lazy-load the
ones well below the fold rather than all of them.

### Unfilled slots

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `collapseOnUnfilled` | `boolean` | `true` | Hide the slot when AdSense has no ad. |
| `fallback` | `ReactNode` | — | Render this instead when unfilled. Implies collapsing. |
| `onFilled` / `onUnfilled` | `() => void` | — | Outcome callbacks. |

```tsx
<GoogleAd
  clientId="ca-pub-XXXX"
  slot="123"
  fallback={<NewsletterSignup />}
  onUnfilled={() => analytics.track("ad_unfilled")}
/>
```

### Other

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Advertisement"` | Accessible label. The slot is exposed as a `complementary` landmark so screen-reader users can identify and skip it. |
| `refreshKey` | `string \| number` | — | Change it to request a fresh ad into the same slot. |

## How unfilled detection works

`data-ad-status` is AdSense's own verdict, so it is trusted whenever present.
Only when AdSense sets no status at all does the component fall back to
inspecting the slot's contents.

That distinction matters: a **filled** slot renders a cross-origin iframe whose
children are not visible from your document, so treating "looks empty" as
unfilled would collapse perfectly good ads.

## `<GoogleAdsObserver />`

Only needed for slots created **outside** React — `GoogleAd` manages itself.

```tsx
<GoogleAdsObserver />              // watches document.body
<GoogleAdsObserver root={myEl} />  // or a subtree
```

## Consent

Personalised advertising needs consent in the EU/UK. Gate the script, and
optionally the slots:

```tsx
<AdSenseScript clientId="ca-pub-XXXX" enabled={hasAdConsent} />
```

Pair with
[`react-consent-management-banner`](https://github.com/faraasat/react-consent-management-banner),
which wires Google Consent Mode v2 for you.

## Notes

- Ads do not render on `localhost` or on an unapproved domain. Empty slots in
  development are AdSense, not this package.
- Ad blockers stop the AdSense script loading at all. Pair with
  [`react-adblocker-detect`](https://github.com/faraasat/react-adblocker-detect)
  to detect that case.
- The stylesheet sets **no `z-index`** — an advert should not stack above your
  navigation or dialogs. Set one yourself if a layout needs it.

## Styling

```tsx
import "react-google-ads-advanced/style.css";
```

The stylesheet is deliberately tiny: `display: block`, full width, and
`overflow: hidden` so a slightly oversized creative cannot introduce a
horizontal scrollbar on narrow screens. Everything else is AdSense's own
layout, and fighting it with `!important` causes more problems than it solves.

## Contributing

Issues and pull requests are welcome.

```bash
git clone https://github.com/faraasat/react-google-ads-advanced.git
cd react-google-ads-advanced
npm install
npm test          # vitest unit tests
npm run typecheck # tsc --noEmit
npm run build     # tsup
```

End-to-end tests run against the built demo in a real browser (desktop and
mobile viewports), and cover the things unit tests cannot: layout, CSS and
keyboard behaviour.

```bash
npm run build && npm --prefix example install && npm --prefix example run build
npm run test:e2e      # playwright
npm run test:e2e:ui   # interactive
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
