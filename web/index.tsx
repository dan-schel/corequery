import "temporal-polyfill/global";

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
import { NowProvider } from "@/web/components/providers/NowProvider.js";
import { CorequeryUrls } from "@/web/pages/corequery-urls";

const About = lazy(() => import("./pages/About.js"));
const AdminControls = lazy(() => import("./pages/AdminControls.js"));
const Debug = lazy(() => import("./pages/Debug.js"));
const Home = lazy(() => import("./pages/Home.js"));
const Nearby = lazy(() => import("./pages/Nearby.js"));
const Service = lazy(() => import("./pages/Service.js"));
const Settings = lazy(() => import("./pages/Settings.js"));
const Status = lazy(() => import("./pages/Status.js"));
const ZenMode = lazy(() => import("./pages/ZenMode.js"));
const Stop = lazy(() => import("./pages/Stop.js"));
const Line = lazy(() => import("./pages/Line.js"));

const NotFound = lazy(() => import("./pages/NotFound.js"));

function App() {
  return (
    <ServiceWorkerProvider>
      <StaticDataProvider>
        <ForceUpdateController>
          <SettingsProvider>
            <FoundationalDataProvider>
              <NowProvider>
                <LocationProvider>
                  <PageContainer>
                    <ErrorBoundary>
                      <Router>
                        <Route path={CorequeryUrls.home} component={Home} />
                        <Route path={CorequeryUrls.about} component={About} />
                        <Route
                          path={CorequeryUrls.admin}
                          component={AdminControls}
                        />
                        <Route path={CorequeryUrls.debug} component={Debug} />
                        <Route
                          path={CorequeryUrls.lineUrlTemplate}
                          component={Line}
                        />
                        <Route path={CorequeryUrls.nearby} component={Nearby} />
                        <Route
                          path={CorequeryUrls.serviceUrlTemplate}
                          component={Service}
                        />
                        <Route
                          path={CorequeryUrls.settings}
                          component={Settings}
                        />
                        <Route path={CorequeryUrls.status} component={Status} />
                        <Route
                          path={CorequeryUrls.stopUrlTemplate}
                          component={Stop}
                        />
                        <Route path={CorequeryUrls.zen} component={ZenMode} />
                        <Route default component={NotFound} />
                      </Router>
                    </ErrorBoundary>
                  </PageContainer>
                </LocationProvider>
              </NowProvider>
            </FoundationalDataProvider>
          </SettingsProvider>
        </ForceUpdateController>
      </StaticDataProvider>
    </ServiceWorkerProvider>
  );
}

render(<App />, document.body);
