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
      <PwaStatus />
    </div>
  );
}
