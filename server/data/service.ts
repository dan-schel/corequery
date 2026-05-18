import type { Color } from "@/server/data/color.js";
import type { CoreDate } from "@/server/data/core-date/core-date.js";
import type { CoreServiceTime } from "@/server/data/core-date/core-service-time.js";
import type { Tags } from "@/server/data/tags.js";

// TODO: Departure isn't the best term for "a service visiting a stop", because
// it could be an arrival, i.e. the services which show up in TrainQuery when
// you say "Show arrivals". I've considered alternatives: Visit, StopTime, Call
// (train "calls" at a station), and Movement. But so far, I don't think any of
// those are as easily understood by me (I'm used to using "departure" for this
// meaning), and I think I'll just confuse myself, i.e. if theres an API called
// get-visits. Maybe get-stop-times is ok though.
type DepartureFields = {
  readonly service: Service;

  // I'd probably represent these as indices into the service, and the Departure
  // class itself would resolve them in the contructor and/or as needed.
  readonly leg: ServiceLeg;
  readonly stopTime: ServiceStopTime;
};

type ServiceFields = {
  // A service itself doesn't have an ID, it's just a group of legs, and each
  // leg has it's own ID. This matches how things are represented in GTFS, where
  // each trip can be "transferred" to another trip, but that transfer doesn't
  // have an ID, the trips do.
  //
  // This has the side-effect that two service page URLs (which will almost
  // certainly be based around the leg ID, for stability across different GTFS
  // publishes) could actually refer to the same service. Sounds fine by me.
  //
  // TODO: Consider that this array-based model cannot model infinitely looping
  // services. City Circle services can just repeat infinitely (in theory), and
  // have infinite legs. In practice, no-one ever needs to know about any more
  // than the second loop. When I started writing this, I thought it would be
  // an argument for a recursive data structure, but given these will be
  // serialised for the frontend, it doesn't really matter, and there's no
  // practical way to represent them.
  //
  // That means, regardless, we have to have some logic _somewhere_ to determine
  // how many legs are "useful". On Melbourne's network the answer is always 2
  // at most, because after that the train has either reversed direction (or
  // it's a City Circle train, and we don't care after the second loop), but I
  // imagine in some places you could have a train that forms a second or third
  // service, and it might actually make sense for someone on leg A to continue
  // through to leg C, so we certainly wouldn't want to limit it to 2 legs here.
  legs: readonly ServiceLeg[];
};

type ServiceLegFields = {
  readonly id: string;

  // Possibly multiple, e.g. for Westall trains which are both Cranbourne &
  // Pakenham line.
  readonly lineIds: readonly number[];

  readonly tags: Tags;
  readonly color: Color | null;
  readonly timetableDate: CoreDate;
  readonly stopTimes: readonly ServiceStopTime[];
};

type ServiceStopTimeFields = {
  readonly stopId: number;
  readonly positionId: number | null;
  readonly arrivalTime: CoreServiceTime | null;
  readonly departureTime: CoreServiceTime | null;
  readonly allowsPickUp: boolean;
  readonly allowsDropOff: boolean;
};

/*

One concern I had is whether you could combine services ahead of time, i.e. 
while processing GTFS, rather than join transfers when fetching departures.

To combine services ahead of time assumes that services are always linked in the
same calendar, i.e. two services aren't linked during some days in T_0 and not
others. That seems to be true, GTFS just links route_ids, it doesn't specify
certain days that the link occurs, and each route belongs to one calendar only.
But I don't want to lock myself into anything.

I don't think we NEED to combine services ahead of time. The problem as I 
initially saw it was that if querying departures at Town Hall allowing "Arrivals
only" to be shown too, then you'd see duplicates, with an up Pakenham 
terminating as a down Sunbury originates. If we don't combine the services, 
we'll show both, even though they're the same train.

HOWEVER, once we fill out the full service, we can know to exclude the down 
Pakenham as NOT being an "Arrival only", because it has a subsequent leg.

Then, the only advantage of combining ahead of time is performance, and I don't
think we should model the data in a certain way just for performance reasons.
There's usually a way to optimize performance without changing the data model,
e.g. maintaining a separate cache/index outside the main data model.

*/
