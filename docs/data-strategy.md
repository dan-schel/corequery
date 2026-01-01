# Data strategy

This doc is meant to serve as a reference for future me. It explains the different strategies in play to get data to the frontend.

## Live data

The first and simplest method is "live data", a.k.a. making API calls as required, as the user loads pages and takes actions on the site.

This strategy is used for things like:

- departure times
- disruption messages

This data likely isn't cached anywhere, because the assumption is that the user always wants the latest data, and outdated data holds no value.

## Foundational data

The second method is "foundational data", which is for data that changes relatively often, but is nice to have available offline if needed.

This strategy is used for things like:

- the list of stops
- the list of lines
- about page content
- landing page content

This data is fetched from the server when the app first loads, and the app isn't functional until it loads (we show a splash screen). Once fetched, it's cached in the browser's local storage. Upon subsequent app loads the app will still attempt to load the foundational data from the server again, but will fallback to its cached version after a short timeout.

The idea is to enable a user browsing on a flaky connection (or entirely offline) to navigate around the site (searching stop/line names, etc.) without issue, and only need to rely on the server to supply live data. It helps apps powered by CoreQuery work in an "offline-first" manner.

### Force update mechanism

To avoid potential data inconsistencies between the foundational data and live data, foundational data includes a `hash` field which is always included in the request for any live data. If the server has newer foundational data to serve when a live data query is made, the server will include the latest version of the foundational data in its response. Whenever this happens, the frontend caches the new foundational data immediately before attempting to process the live data response.

This avoids a situation where the server's foundational data has changed since the user loaded the app (and/or the user was offline when they loaded the app but now has a usable connection) and they request live data which could now include references to stops/lines that don't exist in the user's cached foundational data.

## Static data

The first method is called the "static data", which is literally hardcoded into the frontend code.

This strategy is used ONLY for:

- the app name
- the frontend version

When the server starts, we have to replace certain assets in the `web/dist` folder (see the [Demo App](./demo-app.md) docs) so that the consumer project can control certain attributes in the PWA manifest, and customize the favicons. At the same time, we take the opportunity to inject static data into the frontend code. This is achieved via `<meta>` tags in the `<head>` of `index.html`:

```html
<meta name="corequery-app-name" content="..." />
<meta name="corequery-frontend-version" content="..." />
```

This is purposely done in a way that isn't designed to scale nicely. It is HIGHLY discouraged from adding anything further to this static data strategy. As we're hardcoding values into `index.html`, these values will be precached by the service worker, meaning they'll only be updated when the service worker updates. That makes it unsuitable for data which updates often (more often than a user would intentionally update their PWA).

The reason this is done _at all_ is that:

- we show the app name on the splash screen before the foundational data is loaded, and it can't be updated dynamically anyway since it's hardcoded in the PWA manifest
- the frontend version is by design meant to the tied to the precached frontend code to aid debugging, and therefore also shouldn't be dynamic

Anything added to the static data needs a similarly strong justification.
