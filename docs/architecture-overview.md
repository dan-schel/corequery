# Architecture overview <!-- omit in toc -->

## Table of contents <!-- omit in toc -->

<!-- Table of contents created using "Markdown All in One" VSCode extension. -->
<!-- Command palette: "> Markdown All in One: Update Table of Contents" -->

- [Introduction](#introduction)
  - [1. CoreQuery is an NPM package](#1-corequery-is-an-npm-package)
  - [2. CoreQuery is a PWA](#2-corequery-is-a-pwa)
- [Static, foundational, and live data](#static-foundational-and-live-data)
  - [Live data](#live-data)
  - [Foundational data](#foundational-data)
  - [Static data](#static-data)
- [Dealing with outdated frontends and caches](#dealing-with-outdated-frontends-and-caches)
  - [The happy path](#the-happy-path)
  - [API versioning](#api-versioning)
  - [FODA-synced APIs](#foda-synced-apis)
  - [Versioning schemes](#versioning-schemes)
  - [Force update mechanism](#force-update-mechanism)

## Introduction

CoreQuery is a platform for building web apps serving transit information. The majority of its architectural decisions can be explained as a direct consequence of the following decisions.

### 1. CoreQuery is an NPM package

A transit app for Melbourne's train network can share a lot of code with one for Sydney's. That's what CoreQuery is, and therefore it has to be highly configurable to work for each case, i.e. different stops, different methods of fetching departures, different ways to interpret disruption messages, etc.

The most effective way to do that configuration is with Typescript (rather than something like YML), since you can inject logic too. Someone wishing to build a web app using CoreQuery installs it from NPM, writes some Typescript code to import the `Corequery` class, configures it, and calls methods on it to initialise/start the web server, just like it were any other shared library.

The consumer app doesn't build any frontend code, it only configures the server. The frontend code is a static bundle, built when the `corequery` NPM package is built. This means Preact, Vite, etc. are dev dependencies of CoreQuery rather than dependencies, and that all CoreQuery consumers run the exact same frontend code, despite their configuration (well almost, see [Static Data](#static-data) below).

<!-- TODO: Link Static Data above to somewhere. -->

### 2. CoreQuery is a PWA

This means that the frontend code/assets get installed on the user's device when they first load it. The web app can be opened without an internet connection, and only needs the internet when an API call is made.

While it's not practical to make the entire transit network timetable available offline (especially considering real-time updates come in as often as every 30 seconds), the app leans on offline capability as much as it can. The goal is to reserve API calls for truly live data (e.g. departures, disruptions, etc.), so that users on a flaky internet connection (i.e. on a train) have the best experience possible.

The goal is:

- Navigation between pages is instant, even if the data on the page needs to be fetched from the server.
- The list of stops, lines, etc. is cached and available offline. Search is done on the client-side.
- A user can search for a stop, set their departure time, and configure their filters without an internet connection. The connection is only used to fetch the departures themselves.

The downside of being a PWA, which CoreQuery has to mitigate, is that clients can be outdated, both in the frontend code they're running, and the cached data they're working with.

## Static, foundational, and live data

From the frontend's perspective, there are three different data fetching "strategies".

### Live data

"Live" data is information that's so fresh, there's no point caching it. It's always fetched via an API call at the time it's needed.

This strategy is used for things like:

- departures
- disruptions

### Foundational data

"Foundational" data (a.k.a. FODA) is information that _does_ change, but change is rare enough that you can generally rely on a cached version of it.

This strategy is used for things like:

- the list of stops, their positionsm, and filters
- the list of lines, their colors and diagrams
- landing page content
- terminology (is it "stops" or "stations", "bays" or "platforms"?)

Foundational data is fetched from the server when the app first loads, and the app isn't functional until it loads (we show a splash screen). Once fetched, it's stored in the browser cache. Upon subsequent app loads the app will still attempt to load the foundational data from the server again, but will fallback to its cached version after a short timeout, so as not to keep the user stuck on the splash screen when offline or on a flaky connection.

The size of the data is not really a concern (within reason of course) because it only needs to be downloaded once by the user each time it changes, and it won't ever slow down navigation (except the initial load).

Foundational data is what enables users to search, set filters, navigate around to stop/line pages and more, without requiring an internet connection. But as you might imagine, it's possible for a client to have outdated foundational data, see [Dealing with outdated frontends and caches](#dealing-with-outdated-frontends-and-caches) below for details on how this is handled.

### Static data

"Static" data is literally hardcoded into the frontend bundle.

When the server starts, we have to replace some assets in the `web/dist` folder (see the [Demo App](./demo-app.md) docs) so that the consumer project can control certain attributes in the PWA manifest, SEO tags in the `index.html`, and customize the favicons. At the same time, we take the opportunity to inject static data into the frontend code, to be made available in JS via `useStaticData()`. This is achieved via `<meta>` tags in the `<head>` of `index.html`:

```html
<meta name="corequery-app-name" content="Demo App" />
<meta name="corequery-frontend-version" content="demo-app" />
<meta name="corequery-package-version-on-last-update" content="demo-app" />
<meta name="corequery-server-version-on-last-update" content="demo-app" />
```

These value are precached by the service worker, meaning they'll only be updated when the service worker updates.

> [!CAUTION]
> Unlike the other data strategies, this method has a very specific use case, and I don't expect that we'll ever need to add further fields using this approach.
>
> The reason this is done **_at all_**, is that:
>
> - We show the app name on the splash screen before the foundational data is loaded, and it can't be updated dynamically anyway since it's hardcoded in the PWA manifest.
> - The frontend version is _**by definition**_ meant to the tied to the precached frontend code to aid debugging and enable the "force service worker update" mechanism (see [Dealing with outdated frontends and caches](#dealing-with-outdated-frontends-and-caches) below), and therefore also shouldn't be dynamic.
> - Similarly, the `-on-last-update` fields are meant to be tied to the precached frontend code, for debugging.
>
> Anything further added to the static data would need a similarly strong justification. For example, the app description (shown on the landing page) **_doesn't_** need to be static data, because it's not part of the splash screen, and so can live in the foundational data instead.

## Dealing with outdated frontends and caches

In normal running, the frontend keeps itself up-to-date using a "best effort" approach.

Remember that there are two things to track here, the frontend version (i.e. the service worker, HTML, CSS, and JS code itself), and the foundational data version. Both are completely independent, and either one can be out of date, even if the other isn't.

### The happy path

Updates to the frontend version are largely handled by the browser. When it notices a change in `/sw.js`, it will attempt to install it, and inform CoreQuery when it has. CoreQuery will then show a prompt to the user for them to refresh and update. Even if they don't, next time the app is fully closed and opened, they'll be running the new version.

As for the foundational data, as mentioned above, we attempt to refresh it every time the app starts, and we're on the splash screen. The request has a short timeout so we don't block the user for too long, but it should be sufficient in most cases.

### API versioning

To support users on outdated frontend versions, all APIs are versioned. Anytime a breaking change is made to an API, the server should implement a new version of the API and continue to serve the old version. A "breaking change" here means a change that old frontend versions will not handle correctly, so just adding a new field is not a breaking change, but removing one, or updating an enum to include a new value is.

### FODA-synced APIs

In some cases, an API response will be unusable unless the frontend is on the same foundational data version as the server who responded. For example, the departures API may return departures for a line which didn't exist last time the frontend updated it's foundational data!

To handle this, affected APIs are "FODA-synced", meaning they return the foundational data version that the server is using as part of the response. If the frontend receives this response and sees that the version doesn't match its own, it must immediately call the foundational data API to refresh its cache before making that API response available to the component that requested it.

### Versioning schemes

I'm saying "version" a lot here, and there's several versions to track.

- **Server version** - A version string configured by the consumer app. Usually it's just the commit hash.
- **`corequery` package version** - The NPM version of the `corequery` package.
- **Frontend version** - The frontend version is a hash calculated factoring in the HTML, CSS, and JS code, the app name, description, web manifest, and icons. It does **not** change as a result of the server version or `corequery` package version changing, as it's meant to represent a change to the actual bundled frontend code only.
- **API versions** - Integers which increment each time there's a breaking change, e.g. `/departures/v1`, `/departures/v2`, etc.
- **Foundational data version** - A hash calculated from all the data which can appear in the foundational data APIs. By "APIs" (plural), I mean `/foundational-data/v1`, `/foundational-data/v2`, etc. Regardless of which version of the frontend is running, they'll all receive the same foundational data version from the server at the same time. It doesn't depend on which version of the foundational data API they call.

So, to be clear - the frontend bundle/PWA will update if and only if the frontend version changes, and the cached foundational data will update if and only if the foundational data version changes.

### Force update mechanism
