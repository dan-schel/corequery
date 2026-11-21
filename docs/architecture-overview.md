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
- [FAQs](#faqs)

## Introduction

CoreQuery is a platform for building web apps serving transit information. The majority of its architectural decisions can be explained as a direct consequence of the following decisions.

### 1. CoreQuery is an NPM package

A transit app for Melbourne's train network can share a lot of code with one for Sydney's. That's what CoreQuery is, and therefore it has to be highly configurable to work for each case, i.e. different stops, different methods of fetching departures, different ways to interpret disruption messages, etc.

The most effective way to do that configuration is with TypeScript (rather than something like YAML), since you can inject logic too. Someone wishing to build a web app using CoreQuery installs it from NPM, writes some TypeScript code to import the `Corequery` class, configures it, and calls methods on it to initialise/start the web server, as if it were any other shared library.

The consumer app doesn't build any frontend code, it only configures the server. The frontend code is a static bundle, built when the `corequery` NPM package is built. This means Preact, Vite, etc. are dev dependencies of CoreQuery rather than dependencies, and that all CoreQuery consumers run the exact same frontend code, despite their configuration (well almost, see [Static Data](#static-data) below).

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

- the list of stops, their positions, and filters
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

These values are precached by the service worker, meaning they'll only be updated when the service worker updates.

> [!CAUTION]
> Unlike the other data strategies, this method has a very specific use case, and I don't expect that we'll ever need to add further fields using this approach.
>
> The reason this is done **_at all_**, is that:
>
> - We show the app name on the splash screen before the foundational data is loaded, and it can't be updated dynamically anyway since it's hardcoded in the PWA manifest.
> - The frontend version is _**by definition**_ meant to be tied to the precached frontend code to aid debugging and enable the "force service worker update" mechanism (see [Dealing with outdated frontends and caches](#dealing-with-outdated-frontends-and-caches) below), and therefore also shouldn't be dynamic.
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

In some cases, an API response will be unusable unless the frontend is on the same foundational data version as the server that responded. For example, the departures API may return departures for a line which didn't exist last time the frontend updated its foundational data!

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

We probably can't support old frontends forever. Eventually, the time will come to remove an old API version. Hopefully by this time, it'll have been long enough that most users will be on the new version naturally, but there can always be someone who hasn't opened the app in a long time.

Due to this, CoreQuery has a force update mechanism which enables the server to tell a frontend to do whatever it can to update immediately. Upon startup, the frontend calls the `version-check/v1` API and passes its frontend version hash and `corequery` package version (the one stored in the static data, i.e. what it was at the time of the last frontend version update). If the server responds with `isForceUpdateOfServiceWorkerRequired: true`, then the frontend evicts the service worker and programmatically refreshes the page.

Note that this mechanism works above the level of even the foundational data system, so even if the user is stuck with a broken splash screen (due to some newly introduced bug), this mechanism should still be able to get them unstuck. However, the force update API call is not a blocking query, and it runs entirely in the background. If it fails or times out, the user is not impacted.

At the time of writing, this mechanism can only be used to force update the frontend version. The foundational data already has a force update mechanism of its own via FODA-synced queries, so it doesn't seem necessary to consider it here.

## FAQs

#### What do I need to do if I make a breaking change to an API? <!-- omit in toc -->

Add a new version of the API, and leave the old one alone, or at least try to maintain compatibility as best you can for old frontends. When it's been long enough that you're comfortable removing the old API version, update the handler to the `version-check/v1` API to return `isForceUpdateOfServiceWorkerRequired: true` if the `corequery` package version is older than the one in which the new API version was added.

#### What do I need to do if I make a breaking change to the foundational data? <!-- omit in toc -->

It's the same as any other API breaking change really.

#### If the frontend caches FODA from the v1 API and updates to a frontend version which uses FODA from the v2 API, what happens? <!-- omit in toc -->

Foundational data has a metadata field for which version of the API it came from, and this version is a `z.literal()` in the schema. This means the frontend will fail to parse the data in the cache, as it'll be expecting `z.literal("2")` and the cached data will have `"1"`. This failure to parse is just treated as if the cache was empty, and it's your first time visiting the site. Therefore the frontend will block on the splash screen until it successfully fetches the FODA from the `foundational-data/v2` API.

(Note: Being in metadata, the field that tracks which version of the FODA API it came from is not factored into the hash. Foundational data from different API versions still have the same hash!)

#### If a new field is added to the FODA without a breaking change, will the frontend cache it, or break when the frontend version later updates to require it? <!-- omit in toc -->

For this reason, FODA is actually cached exactly as it is returned by the API, rather than only caching the value which Zod parses.

If it's not clear, the problem occurs when a new field is added to the FODA. It's not a breaking change, so no new API version is needed, but it will cause a hash change because there's more stuff to hash. Even if the new field is added in the same commit as the frontend starts consuming it, client PWAs don't update immediately, so chances are the old frontend version will be the one to see the new FODA hash, and the one to cache it. If it weren't to cache the raw response, including the new field, when the PWA is later updated, it'll try to fetch the FODA from the cache and fail, as the new field won't be there.

Now this wouldn't be a catastrophic situation of course, because the frontend will simply treat the cache as empty and fetch the updated FODA from the API. However, it _can_ lead to [some bugs](https://github.com/dan-schel/corequery/blob/d0a2c77584b29bf95b0de7d9d9295ee913bb80ae/web/components/providers/FoundationalDataProvider.tsx#L81-L93) if we're not careful.

#### Why do FODA-synced queries not return the FODA directly when it's outdated? <!-- omit in toc -->

This is discussed in [FODA-synced queries (ADR)](./foda-synced-queries-adr.md). The short answer is that if APIs returned the FODA directly, a FODA version update would cause a version update of all FODA-synced APIs, which is a DX nightmare.

#### How do FODA-synced queries deal with outdated data in the _request_? <!-- omit in toc -->

Good question. At the time of writing, they don't, and this is handled on a case-by-case basis.

For example, if the departures API receives a request for departures from a stop ID it doesn't recognise, it will return an empty array. If it receives a filter token it doesn't understand (i.e. `line-10` when line 10 doesn't exist), it'll ignore that filter and return it in `invalidFilterTokens` (only so the frontend can inform the user that a filter was removed, the FODA will be synced on the response).

#### What happens when I link someone to `/stops/XYZ`, but their FODA is outdated and doesn't know about that stop? <!-- omit in toc -->

In this situation, even if the usual splash screen FODA refresh times out, CoreQuery is smart enough to trigger a force FODA update. The "Stop Not Found" page doesn't actually render until it has confirmed that the FODA is up-to-date (see `useVersionAssurance()`). Instead, it shows a loading spinner whilst making a call to the `versions/v1` API. If it finds the hash is outdated, the page will trigger a FODA update (similar to how a FODA-synced query can trigger one), continuing to show the loading spinner until that's done. At that point, the user should be seeing a stop page, as whatever logic sent them to the not found page will no longer be doing so.

#### What happens when I link someone to a brand new page, but their frontend version is outdated and doesn't support it? <!-- omit in toc -->

Similar to the above, the not found page is designed to first check the frontend version before displaying "Not Found", so in this case, the PWA will be force updated, and they should see the new page.
