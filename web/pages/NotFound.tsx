import { Nav } from "../components/Nav";
import { useStaticData } from "../data/static-data";

export default function NotFound() {
  const { appName } = useStaticData();

  return (
    <div>
      <h1>{appName} - Not Found</h1>
      <Nav />
    </div>
  );
}
