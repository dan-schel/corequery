import {
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
  lazy,
} from "preact-iso";
import { render } from "preact";
import "@/web/index.css";
import { StaticDataProvider } from "@/web/components/StaticDataProvider";
import { FoundationalDataProvider } from "@/web/components/FoundationalDataProvider";
import { PageContainer } from "@/web/components/page/PageContainer";

const Home = lazy(() => import("./pages/Home.js"));
const About = lazy(() => import("./pages/About.js"));
const NotFound = lazy(() => import("./pages/NotFound.js"));

function App() {
  return (
    <StaticDataProvider>
      <FoundationalDataProvider>
        <LocationProvider>
          <PageContainer>
            <ErrorBoundary>
              <Router>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route default component={NotFound} />
              </Router>
            </ErrorBoundary>
          </PageContainer>
        </LocationProvider>
      </FoundationalDataProvider>
    </StaticDataProvider>
  );
}

render(<App />, document.body);
