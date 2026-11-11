import z from "zod";

// TODO: My idea is still that the client will interact with the foundational
// data through classes, but that those classes can live in the /web folder,
// hydrating themselves from these schemas. There's advantages to co-locating
// these schemas with those classes (and bundle size doesn't matter for the
// server), but because of API versioning, coupling these schemas to the class
// isn't necessarily a good idea anyway, since old versions of these schemas
// need to stick around for the server to continue using.
//
// The class in /web that wraps these schemas and provides helper methods should
// hopefully be the only touch-point in the frontend for these schemas, so when
// a new version happens, there shouldn't be a million places to change. Only
// the API itself has to support serving multiple versions of the foundational
// data (for a little while at least). Remember that the frontend, of course,
// doesn't need to be backwards compatible (we won't be running an old version
// of the SERVER)!

const locationFodaSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const colorFodaSchema = z.object({
  lightModeHexCode: z.string(),
  darkModeHexCode: z.string(),
});

export const stopFodaSchema = z.object({
  id: z.number(),
  name: z.string(),
  urlPath: z.string(),
  canonicalLinesServingStop: z.number().array().readonly(),

  // To avoid users needing to send their location to the server, we send the
  // locations of each stop to them instead, and do the maths client-side.
  location: locationFodaSchema.nullable(),

  defaultDepartureFeeds: z
    .object({
      name: z.string(),
      desiredCount: z.number(),
      filterExpression: z.string(),
    })
    .array(),

  departureFilters: z.object({
    lines: z.union([
      z.literal("off"),
      z.literal("canonical"),

      // North Melbourne is an example of a stop that will want to define custom
      // lines instead of using canonical lines, as the Flemington Racecourse is
      // not a canonical line.
      z.number().array(),
    ]),

    positions: z.union([
      // Southern Cross is an example of a stop that will not want positional
      // filters to be created automatically (it'll use a custom group for
      // them).
      z.literal("off"),

      z.literal("all"),
      z.number().array(),
    ]),

    // Note that custom filter are given as a list of groups. Grouped filters:
    //
    // - Display together under a shared heading in the filters popover.
    //
    // - Logically OR instead of AND, meaning if two from the same group are
    //   selected, they'll be sent to the departures query as `a|b` instead of
    //   `a b`. We can allow arbitrary filter expressions to be combined, as
    //   every boolean expressions can be converted to conjunctive normal form,
    //   which is what the server supports, e.g. `(a b)|c` = `a|c b|c`.
    customGroups: z
      .object({
        label: z.string(), // "By platform"
        items: z.object({
          name: z.string(), // "Platform 1"
          labelWithinGroup: z.string(), // "1"
          filterExpression: z.string(), // "position-51"
        }),
      })
      .array(),
  }),
});

export const lineDiagramStopFodaSchema = z.object({
  stopId: z.number(),
  type: z.enum(["regular", "always-express"]),
});

export const lineDiagramEntryFodaSchema = z.union([
  z.object({
    type: z.literal("linear"),
    name: z.string().nullable(),
    color: colorFodaSchema.nullable(),
    stops: lineDiagramStopFodaSchema.array().readonly(),
  }),
  z.object({
    type: z.literal("branch"),
    name: z.string().nullable(),
    color: colorFodaSchema.nullable(),
    commonStops: lineDiagramStopFodaSchema.array().readonly(),
    branchAStops: lineDiagramStopFodaSchema.array().readonly(),
    branchBStops: lineDiagramStopFodaSchema.array().readonly(),
  }),
  z.object({
    type: z.literal("loop"),
    name: z.string().nullable(),
    color: colorFodaSchema.nullable(),
    loopLeftStops: lineDiagramStopFodaSchema.array().readonly(),
    loopRightStops: lineDiagramStopFodaSchema.array().readonly(),
    mainStops: lineDiagramStopFodaSchema.array().readonly(),
  }),
]);

// TODO: Time to split up this huge file.
type UnderstoodLineDiagramEntryType = z.output<
  typeof lineDiagramEntryFodaSchema
>["type"];

const understoodLineDiagramEntryTypeMap: Record<
  UnderstoodLineDiagramEntryType,
  true
> = {
  linear: true,
  branch: true,
  loop: true,
};

export function isUnderstoodLineDiagramEntryType(
  type: string,
): type is UnderstoodLineDiagramEntryType {
  return type in understoodLineDiagramEntryTypeMap;
}

export const lineDiagramFodaSchema = z.object({
  entries: z
    .union([
      lineDiagramEntryFodaSchema,

      // Allows for future diagram types, without a breaking change. When this
      // case is hit, the frontend, which doesn't understand this new diagram
      // type, will fallback to the `fallbackStopList`.
      z.object({
        type: z.string().refine((x) => !isUnderstoodLineDiagramEntryType(x)),
      }),
    ])
    .array()
    .readonly(),

  fallbackStopList: z.number().array().readonly(),
});

export const lineFodaSchema = z.object({
  id: z.number(),
  name: z.string(),
  urlPath: z.string(),
  color: colorFodaSchema.nullable(),
  diagram: lineDiagramFodaSchema,
});

// Omitting for now, see comments below for each field's reasoning.
const terminologySchema = z.object({
  stop: z.enum(["stop", "station"]),
  line: z.enum(["line", "route"]),
  service: z.enum(["service", "trip", "train", "tram", "bus"]),

  // Not sure if this is really needed yet. It will be if stop filters are
  // included in the foundational data, as they're not pre-formatted by the
  // server (i.e. sent over as `position: 1` and expect the frontend to format
  // that to "Platform 1").
  //
  // Pre-formatting could make sense if we want to support customly named
  // filters for maximum flexibility, but NOT pre-formatting allows us to
  // smartly combine multiple filters together, e.g. "Citybound Frankston trains
  // on Platform 6". I think we'll end up pre-formatting the filters, due to how
  // Southern Cross has platforms 16a, 16b, and 16, and we just want a single
  // "Platform 16" filter to cover all three.
  //
  // This could also be needed for showing the little "Platform XYZ" badges on
  // each departure. It probably makes more sense to send it over as part of the
  // foundational data rather than each departures/service API response.
  //
  // Gonna omit it for now, until I'm sure, then I don't have to make a breaking
  // change.
  //
  // stopPosition: z.enum([
  //   "platform",
  //   "track",
  //   "bay",
  //   "wharf",
  //   "wharf-and-side",
  //   "stand",
  // ]),
});

const landingPageFodaSchema = z.object({
  // Would feel weird needing to load copy from an API while the rest of the
  // HTML for the landing page (search box, JS handling widgets, etc.) is
  // precached lol.
  primaryMarkdown: z.string(),
});

const footerFodaSchema = z.object({
  // Adding this to the foundational data when the about page content is NOT in
  // the foundational data doesn't make much sense. I put it in because I
  // thought we'd be displaying this footer on most/every page, but given that
  // we're only showing it on the about page, it can probably be removed in the
  // next major version.
  primaryMarkdown: z.string(),
});

export const fodaSchema = z.object({
  metadata: z.object({
    hash: z.string(),
    fodaApiVersion: z.literal("1"),
    serverVersion: z.string(),
  }),

  stops: stopFodaSchema.array().readonly(),
  lines: lineFodaSchema.array().readonly(),
  terminology: terminologySchema,
  landingPage: landingPageFodaSchema,
  footer: footerFodaSchema,
});
