import z from "zod";
import type { Api } from "@/shared/apis/types.js";

// NOTE: This is a "v0" API, i.e. its not intended to be used by anyone except
// me, during the "beta" phase. When we switch to "v1" it'll break compatibility
// with frontends that only understand the v0 API, and that's A-OK.

// TODO: The v1 API needs to be wrapped in foundational data (FODA) updating
// logic, because the cached FODA might be missing stops that this API response
// includes (at least, in the future when I add the stopping pattern field).
// Maybe the server has had a new stop added since the user opened the app. It
// means all APIs that reference things in the FODA (e.g. stop IDs) need to take
// FODA hash from the client as an argument, and if the FODA hash is outdated,
// return the updated FODA along with the API response, so that the client can
// update its cached FODA, and use that to now render the API response against.
//
// Something that'll be tricky with this foundational data update logic, is that
// foundational data is stored in state, in a global context, so when the API
// response comes back, if we need to update the foundational data, we'll call
// setState(), but that updated state doesn't apply until the next render (I
// think?), so there'll still be a render with the old foundational data unless
// I'm able to find a way to prevent that first render.
//
// I think if you call setState() synchronously in a component's render function
// rather than inside a useEffect() it'll essentially ignore the result of that
// render, and immediately re-render with the new state. The issue is that
// because we're doing an API call, it'll probably be inside a useEffect(), so
// maybe we'd need to store the whole result in state ("whole" = with the
// foundational data too), and then check synchronously inside the render
// function (of some `useFodaSynchronizedApiCall()` hook which will be doing the
// API call, subbing in the FODA hash argument, unwrapping the result, and
// managing everything related to this problem) that if that state is set AND
// has updated foundational data, then setState on the foundational data context
// immediately. I'd have to check that this re-rendering thing works in Preact
// like it does in React though.
//
// ^^ Actually, I don't think this works, because even as the render which will
// ultimately be discarded is being rendered, an error could be thrown while
// trying to resolve a stop name or something, and we don't want that! I doubt
// Preact will just swallow that error, and even so, executing broken code like
// that could weird bugs if that code has side-effects. The real solution might
// just have to be ensuring that components who consume an API response that
// requires up-to-date FODA only ever use the FODA given by the
// `useFodaSynchronizedApiCall()` hook itself, and the hook will ensure that if
// it returns a result, it also returns the FODA from that result if the FODA in
// the global context is outdated (but still updating the global context of
// course, we're just solving that first render bug). Child components fetching
// their FODA from the global context could still be affected by the bug though,
// so we might need to wrap the children in a second context provider which uses
// the hook result's FODA.
//
// Sheesh! 😅

const argsSchema = z.object({
  stopId: z.number(),
  count: z.number(),

  // Remember that the v1 API should accept multiple departure streams, so we'll
  // need an array of these arguments! The result needs to be an array too, to
  // compensate.
  //
  // Other things the real v1 API should have:
  //
  // instant: z.string(),
  // direction: z.enum(["forwards", "backwards"]),
  // filters: z.string().array(),
  //
  // // Will be required for infinite scrolling, as two departures can have
  // // the same time.
  // skip: z
  //   .object({
  //     sourceId: z.string(),
  //     intrasourceId: z.string(),
  //   })
  //   .array(),
});

const resultSchema = z.object({
  departures: z
    .object({
      sourceId: z.string(),
      intrasourceId: z.string(),

      // TODO: Possibly we should calculate these on the frontend, and just pass
      // stop IDs for the destination and stopping pattern array (with an
      // `isServicing` flag for each entry) for the v1 API.
      //
      // We shouldn't just use `stoppingPatternText`, because I could see
      // different users wanting to configure what's shown, e.g. "just list all
      // stops", and Zen mode, which probably re-uses this API, wants to list
      // all stops rather than using "express between X and Y" text.
      //
      // The only complicating factor is how to deal with the fact that
      // sometimes the destination is not from the "current service" we give
      // sourceId/intrasourceId for, but from a future connecting service, e.g.
      // "Watergardens" when viewing citybound departures at Clayton, so we need
      // to find naming for that array that makes it clear that it's all the
      // movements for the same vehicle, until we see a servicing movement at a
      // stop which was already serviced. Once we find that repeated servicing
      // movement, we trim the array to end at the previous servicing movement.
      // What do we call that array?
      //
      // I also don't have a solution in mind for the secondary destination
      // text. If the frontend is expected to calculate it, then my current idea
      // to allow the consumer to configure arbitrary functions returning a
      // `string | null` for a given stop array won't work. I'll need something
      // a little more codified.
      primaryDestinationText: z.string(),
      secondaryDestinationText: z.string().nullable(),

      lineIds: z.number().array().readonly(),
      color: z
        .object({
          lightModeHexCode: z.string(),
          darkModeHexCode: z.string(),
        })
        .nullable(),

      isCancelled: z.boolean(),

      movement: z.object({
        // So that it can link to a service page.
        index: z.number(),

        positionId: z.number().nullable(),

        // "time" not "departureTime", as for arrivals it'll be the arrival time.
        time: z.string(),
        formerTime: z.string().nullable(),
      }),
    })
    .array(),
});

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/departures/v0",
  argsSchema,
  resultSchema,
};
