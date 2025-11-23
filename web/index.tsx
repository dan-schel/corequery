import {
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
  lazy,
} from "preact-iso";
import { render } from "preact";

const Home = lazy(() => import("./pages/Home.js"));
const About = lazy(() => import("./pages/About.js"));
const NotFound = lazy(() => import("./pages/NotFound.js"));

function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route default component={NotFound} />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}

render(<App />, document.body);
