import { useEffect } from "preact/hooks";
import { Nav } from "../components/Nav";
import { runSharedCode } from "../../shared/example";
import { PwaStatus } from "../components/PwaStatus";

export default function Home() {
  useEffect(() => {
    runSharedCode();
  }, []);

  return (
    <div>
      <h1>CoreQuery - Home</h1>
      <Nav />
      <PwaStatus />
    </div>
  );
}
