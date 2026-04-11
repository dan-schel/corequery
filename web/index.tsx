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
import { SettingsProvider } from "@/web/components/providers/SettingsProvider";
import { PageContainer } from "@/web/components/page/PageContainer";
import { ServiceWorkerProvider } from "@/web/components/providers/ServiceWorkerProvider";
import { ForceUpdateController } from "@/web/components/ForceUpdateController";

const About = lazy(() => import("./pages/About.js"));
const AdminControls = lazy(() => import("./pages/AdminControls.js"));
const Debug = lazy(() => import("./pages/Debug.js"));
const Home = lazy(() => import("./pages/Home.js"));
const Nearby = lazy(() => import("./pages/Nearby.js"));
const Settings = lazy(() => import("./pages/Settings.js"));
const Status = lazy(() => import("./pages/Status.js"));
const ZenMode = lazy(() => import("./pages/ZenMode.js"));
const Stop = lazy(() => import("./pages/Stop.js"));

const NotFound = lazy(() => import("./pages/NotFound.js"));

function App() {
  return (
    <ServiceWorkerProvider>
      <StaticDataProvider>
        <ForceUpdateController>
          <SettingsProvider>
            <FoundationalDataProvider>
              <LocationProvider>
                <PageContainer>
                  <ErrorBoundary>
                    <Router>
                      <Route path="/" component={Home} />
                      <Route path="/about" component={About} />
                      <Route path="/admin" component={AdminControls} />
                      <Route path="/debug" component={Debug} />
                      <Route path="/nearby" component={Nearby} />
                      <Route path="/settings" component={Settings} />
                      <Route path="/status" component={Status} />
                      <Route path="/stop/:id" component={Stop} />
                      <Route path="/zen" component={ZenMode} />
                      <Route default component={NotFound} />
                    </Router>
                  </ErrorBoundary>
                </PageContainer>
              </LocationProvider>
            </FoundationalDataProvider>
          </SettingsProvider>
        </ForceUpdateController>
      </StaticDataProvider>
    </ServiceWorkerProvider>
  );
}

render(<App />, document.body);
