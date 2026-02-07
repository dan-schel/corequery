import {
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
  lazy,
} from "preact-iso";
import { render } from "preact";
import { StaticDataProvider } from "@/web/components/StaticDataProvider.js";
import "@/web/index.css";

const Home = lazy(() => import("./pages/Home.js"));
const About = lazy(() => import("./pages/About.js"));
const NotFound = lazy(() => import("./pages/NotFound.js"));

function App() {
  return (
    <StaticDataProvider>
      <LocationProvider>
        <ErrorBoundary>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route default component={NotFound} />
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </StaticDataProvider>
  );
}

render(<App />, document.body);
