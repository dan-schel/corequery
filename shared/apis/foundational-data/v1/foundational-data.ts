import z from "zod";

// TODO: My idea is still that the client will interact with the foundational
// data through classes, but that those classes can live in the /web folder,
// hydrating themselves from these schemas. There's advantages to co-locating
// these schemas with those classes (and bundle size doesn't matter for the
// server), but because of API versioning, coupling these schemas to the class
// isn't necessarily a good idea anyway, since old versions of these schemas
// need to stick around for the server to continue using.
//
// NOTE: Despite these schemas living inside `apis/foundational-data/v1`,
// they'll be reused in a lot of APIs, due to the force update mechanism. When a
// breaking change occurs to the foundational data, it causes a breaking change
// to all those APIs too. E.g. we might have `/depatures/v2` API serving this V1
// version of the foundational data, and `/departures/v3` serving a V2 version
// of the foundational data.
//
// The class in /web that wraps these schemas and provides helper methods should
// hopefully be the only touch-point in the frontend for these schemas, so when
// a new version happens, there shouldn't be a million places to change. Only
// the API itself has to support serving multiple versions of the foundational
// data (for a little while at least). Remember that the frontend, of course,
// doesn't need to be backwards compatible (we won't be running an old version
// of the SERVER)!

export const stopSchema = z.object({
  id: z.number(),
  name: z.string(),
  urlPath: z.string(),

  // To avoid users needing to send their location to the server, we send the
  // locations of each stop to them instead, and do the maths client-side.
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .nullable(),

  // At the time of writing, my current thinking is that things like the list
  // of supported filters and default departure feeds would go in a
  // `/stop-page/v1` API (which would also return the departures themselves,
  // even though subsequent refreshes would still use a `/departures/v1` API),
  // because it seems a little heavy to include them all in the foundational
  // data.
  //
  // That said, since foundational data only needs to be fully refetched when
  // the hash changes (which would only be due to a commit, as I don't think
  // there'll be anything dynamic in it), and the only time it will restrict
  // navigation (longer than like 1 second) is on the first load (even though
  // APIs have the force update mechanism, APIs are called to load dynamic data
  // on pages, and nothing prevents you navigating away while it loads), so
  // maybe it really doesn't matter.
  //
  // Consider that people on a slow connection might want to navigate to a stop
  // page and set their filters before having to wait for a response from the
  // server. Making them wait for one request to complete before they can adjust
  // the filters might be kinda frustrating. I assume most connections are
  // "choppy" anyway, rather than slow, so it's better to minimise the number of
  // requests rather than the size of each one, as when the internet is
  // available, it's fast anyway!
});

export const lineSchema = z.object({
  id: z.number(),
  name: z.string(),
  urlPath: z.string(),

  // To the above point. It's probably good to include line diagrams in the
  // foundational data, so navigation (by clicking through to a stop via the
  // line page) isn't blocked by an API call.
});

export const terminologySchema = z.object({
  // Needed for navigation.
  stop: z.enum(["stop", "station"]),
  line: z.enum(["line", "route"]),

  // Not sure if this is really needed yet. It will be if stop filters are
  // included in the foundational data, as they're not pre-formatted by the
  // server (i.e. sent over as `position: 1` and expect the frontend to format
  // that to "Platform 1").
  //
  // Pre-formatting could make sense if we want to support customly named
  // filters for maximum flexibility, but NOT pre-formatting allows us to
  // smartly combine multiple filters together, e.g. "Citybound Frankston trains
  // on Platform 6".
  //
  // I know we want to be super flexible in allowing custom filters to be
  // configured per stop, but I don't remember if there's any need to support
  // custom names, or if a naming algorithm similar to what TrainQuery v3 had
  // would work just fine in all cases.
  //
  // Just be aware that obviously removing it later is a breaking change, which
  // is best avoided!
  stopPosition: z.enum([
    "platform",
    "track",
    "bay",
    "wharf",
    "wharf-and-side",
    "stand",
  ]),
});

export const aboutPageSchema = z.object({
  // I'm torn on this. I don't think the about page serves any real navigational
  // purpose, so there's little harm in fetching it from an API when the user
  // wants it. Also, unlike the two examples below for the landing page and
  // footer, this markdown isn't just a little snippet, it's essentially the
  // entire content of the page, which is traditionally exactly what you'd be
  // fetching from a server. The main argument to include it in the foundational
  // data is really just consistency with the other markdown bits below.
  primaryMarkdown: z.string(),
});

export const landingPageSchema = z.object({
  // Would feel weird needing to load copy from an API while the rest of the
  // HTML for the landing page (search box, JS handling widgets, etc.) is
  // precached lol.
  primaryMarkdown: z.string(),
});

export const footerSchema = z.object({
  // This is structural to enough pages that loading it in via an API each time
  // would be insane.
  primaryMarkdown: z.string(),
});

export const foundationalDataSchema = z.object({
  hash: z.string(),
  stops: stopSchema.array(),
  lines: lineSchema.array(),
  terminology: terminologySchema,
  aboutPage: aboutPageSchema,
  landingPage: landingPageSchema,
  footer: footerSchema,
});
