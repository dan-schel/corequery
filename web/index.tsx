import {
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
  lazy,
} from "preact-iso";
import { render } from "preact";
import "@/web/index.css";
import { StaticDataProvider } from "@/web/components/providers/StaticDataProvider";
import { FoundationalDataProvider } from "@/web/components/providers/FoundationalDataProvider";
import { PageContainer } from "@/web/components/page/PageContainer";
import { ServiceWorkerProvider } from "@/web/components/providers/ServiceWorkerProvider";

const Home = lazy(() => import("./pages/Home.js"));
const About = lazy(() => import("./pages/About.js"));
const Debug = lazy(() => import("./pages/Debug.js"));

const NotFound = lazy(() => import("./pages/NotFound.js"));

function App() {
  return (
    <ServiceWorkerProvider>
      <StaticDataProvider>
        <FoundationalDataProvider>
          <LocationProvider>
            <PageContainer>
              <ErrorBoundary>
                <Router>
                  <Route path="/" component={Home} />
                  <Route path="/about" component={About} />
                  <Route path="/debug" component={Debug} />
                  <Route default component={NotFound} />
                </Router>
              </ErrorBoundary>
            </PageContainer>
          </LocationProvider>
        </FoundationalDataProvider>
      </StaticDataProvider>
    </ServiceWorkerProvider>
  );
}

render(<App />, document.body);
