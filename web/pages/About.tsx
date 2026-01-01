import { Nav } from "../components/Nav";
import { useStaticData } from "../data/static-data";

export default function About() {
  const { appName } = useStaticData();

  return (
    <div>
      <h1>{appName} - About</h1>
      <Nav />
    </div>
  );
}
