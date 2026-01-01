import { useEffect } from "preact/hooks";
import { Nav } from "../components/Nav";
import { runSharedCode } from "../../shared/example";
import { PwaStatus } from "../components/PwaStatus";
import { useStaticData } from "../data/static-data";

export default function Home() {
  const { appName } = useStaticData();

  useEffect(() => {
    runSharedCode();
  }, []);

  return (
    <div>
      <h1>{appName} - Home</h1>
      <Nav />
      <h2>PWA Status:</h2>
      <PwaStatus />
      <h2>Assets:</h2>
      <h3>Favicon SVG</h3>
      <img src="/favicon.svg" alt={`${appName} logo`} />
      <h3>Apple touch icon</h3>
      <img src="/apple-touch-icon.png" alt={`${appName} logo`} />
      <h3>PWA 192x192</h3>
      <img src="/pwa-192x192.png" alt={`${appName} logo`} />
      <h3>PWA 512x512</h3>
      <img src="/pwa-512x512.png" alt={`${appName} logo`} />
      <h3>PWA maskable 192x192</h3>
      <img src="/pwa-maskable-192x192.png" alt={`${appName} logo`} />
      <h3>PWA maskable 512x512</h3>
      <img src="/pwa-maskable-512x512.png" alt={`${appName} logo`} />
    </div>
  );
}
