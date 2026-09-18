export function Hero() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <header className="hero">
      <img src={`${base}/banner.svg`} alt="react-google-ads-advanced" />
      <h1>react-google-ads-advanced</h1>
      <p>Google AdSense for React that collapses unfilled slots instead of leaving blank gaps.</p>
      <nav className="links">
        <a href="https://www.npmjs.com/package/react-google-ads-advanced">npm</a>
        <a href="https://github.com/faraasat/react-google-ads-advanced">GitHub</a>
        <a href="https://github.com/faraasat/react-google-ads-advanced#readme">Docs</a>
      </nav>
    </header>
  );
}
