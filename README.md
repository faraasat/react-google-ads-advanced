<h1 align="center">🧩 React Google Ads Advanced</h1>

<p align="center">A lightweight, customizable React component for embedding and managing Google AdSense ads with automatic detection of unfilled ads and smart hiding logic. Includes a built-in observer that monitors ad status dynamically and hides failed or unfilled ad slots automatically. Equally useable for React, React 19, Next.js Pages Router and Next.js App Router.</p>

<br />

<p align="center">

![npm version](https://img.shields.io/npm/v/react-google-ads-advanced.svg) &nbsp;
![package size minified](https://img.shields.io/bundlephobia/min/react-google-ads-advanced?style=plastic) &nbsp;
[![jsdelivr package](https://data.jsdelivr.com/v1/package/npm/react-google-ads-advanced/badge)](https://www.jsdelivr.com/package/npm/react-google-ads-advanced) &nbsp;
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![total downloads](https://img.shields.io/npm/dt/react-google-ads-advanced.svg) &nbsp;
![total downloads per year](https://img.shields.io/npm/dy/react-google-ads-advanced.svg) &nbsp;
![total downloads per week](https://img.shields.io/npm/dw/react-google-ads-advanced.svg) &nbsp;
![total downloads per month](https://img.shields.io/npm/dm/react-google-ads-advanced.svg) &nbsp;
![download-image](https://img.shields.io/npm/dm/react-google-ads-advanced.svg) &nbsp;
![download-url](https://npmjs.org/package/react-google-ads-advanced) &nbsp;

</p>

<p align="center">

[![react-google-ads-advanced](https://nodei.co/npm/react-google-ads-advanced.png)](https://npmjs.org/package/react-google-ads-advanced)

</p>

---

## 📦 Installation

```bash
npm i react-google-ads-advanced

# or
yarn add react-google-ads-advanced

# or
pnpm i react-google-ads-advanced

# or
bun add react-google-ads-advanced
```

---

## 🚀 Features

- Easy to use React component
- Automatically loads Google AdSense ads
- Observes ad fill status and hides unfilled ads
- Fully customizable with className and style props
- Lightweight and zero dependencies
- Supports responsive ads out of the box

---

## 🧠 Usage

Before doing any of this, you must make sure `Adsense Ads Script` is in your project according to the framework guidelines.

### **React (CRA)**

If you’re using **Create React App** or a plain React setup, first import the global observer in the `App.tsx` or `App.jsx`:

```tsx
// src/App.tsx|jsx
import React from "react";

import { GoogleAdsObserver } from "react-google-ads-advanced";

// VERY IMPORTANT
import "react-google-ads-advanced/index.css";

function App() {
  return (
    <div className="App">
      {/* Place observer once globally */}
      <GoogleAdsObserver />
    </div>
  );
}
```

### **Vite + React**

For **Vite**, you can use it the same way:

```tsx
// src/main.tsx|jsx
import React from "react";

import { GoogleAdsObserver } from "react-google-ads-advanced";

// VERY IMPORTANT
import "react-google-ads-advanced/index.css";

function Main() {
  return (
    <>
      <GoogleAdsObserver />
    </>
  );
}

export default Main;
```

### **Next.js Pages Router**

If your app uses **pages/** (classic router):

```tsx
// pages/_app.tsx|jsx
import type { AppProps } from "next/app";

import { GoogleAdsObserver } from "react-google-ads-advanced";

// VERY IMPORTANT
import "react-google-ads-advanced/index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Global ad observer */}
      <GoogleAdsObserver />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

### **Next.js (App Router)**

If your app uses the new **app/** directory:

```tsx
// app/layout.tsx|jsx
import "./globals.css";

import { GoogleAdsObserver } from "react-google-ads-advanced";

// VERY IMPORTANT
import "react-google-ads-advanced/index.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleAdsObserver />
        {children}
      </body>
    </html>
  );
}
```

---

> <b style="color:red">NOTE: After all the initial setup according to your framework, now you can place the ad anywhere in you app:</b>

```tsx
<GoogleAd
    clientId="<your-client-id>"
    slot="<your-slot-id>"
    {/* OTHER PROPS */}
/>
```

---

## ⚙️ Props

| Prop                    | Type                  | Default      | Description                                           |
| ----------------------- | --------------------- | ------------ | ----------------------------------------------------- |
| `clientId`              | `string`              | **Required** | Your Google AdSense client ID (`ca-pub-XXXXXXXXXXXX`) |
| `slot`                  | `string`              | **Required** | Ad slot ID from AdSense                               |
| `adFormat`              | `string`              | `"auto"`     | Format of the ad (`auto`, `rectangle`, etc.)          |
| `adFullWidthResponsive` | `string`              | `"true"`     | Enables full-width responsive ads                     |
| `className`             | `string`              | `""`         | Additional custom CSS classes                         |
| `style`                 | `React.CSSProperties` | `{}`         | Inline styles for the ad block                        |
| `...rest`               | any                   | —            | Other props passed to the `<ins>` element             |

---

## Components Overview

### 🪄 `GoogleAds`

Renders a Google AdSense `<ins>` tag and automatically pushes it to the `adsbygoogle` queue.

```tsx
<GoogleAds clientId="<your-client-id>" slot="<your-slot-id>" adFormat="auto" />
```

### `GoogleAdsObserver`

Watches for dynamically loaded ads and hides empty or unfilled ad blocks automatically.

- Uses a `MutationObserver` to track attribute changes on all `<ins>` tags.
- If the ad is marked as `"done"` but `"unfilled"` or has no children (iframe missing), it hides the element.

You only need **one instance globally**:

```tsx
<GoogleAdsObserver />
```

---

## 💡 Notes

- Must include Google AdSense script in your app according to your framework guideline:

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  crossorigin="anonymous"
></script>
```

- Make sure your AdSense account and slots are approved before testing.
- Ads do not work in the development mode.

## 🧑‍💻 Author

Built and maintained by [**Farasat Ali**](https://www.farasat.me)

- Website: [www.farasat.me](https://www.farasat.me)
- LinkedIn: [linkedin.com/in/faraasat](https://linkedin.com/in/faraasat)
- GitHub: [github.com/faraasat](https://github.com/faraasat)

