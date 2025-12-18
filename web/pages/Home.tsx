import { useEffect } from "preact/hooks";
import { Nav } from "../components/Nav";
import { runSharedCode } from "../../shared/example";
import { ReloadPrompt } from "../components/PwaReloadPrompt";

export default function Home() {
  useEffect(() => {
    runSharedCode();
  }, []);

  return (
    <div>
      <h1>CoreQuery - Home</h1>
      <Nav />
      <ReloadPrompt />
    </div>
  );
}
