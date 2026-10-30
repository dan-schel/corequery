# FODA synced queries (ADR)

## Problem

If thrashing between two servers on different FODA versions (e.g. I've just pushed a deployment to a horizontally-scaled cluster), FODA-synced queries may repeatedly trigger force updates (under what I'm calling "option 1" below), which then may be directed to the other server which supplies the same old FODA. My current model would be to then fail that API call, as even after the force update, the FODA hash from the API and "updated" FODA still disagree.

This could only really be solved by returning the latest FODA within the API response itself, so that it's atomic (option 2).

Like all APIs, FODA is versioned though. If a breaking change in the FODA schema happens, a new version of the FODA API will be created.

If other queries are able to return FODA, then a breaking change in the FODA schema would require those queries to ALSO bump to a new version.

You might think allowing the foda part of the response to be type-less/schema-less would solve this problem (option 3), but I think it makes it worse, because then clients which only understand FODA v1 will begin to recieve FODA v2 via these FODA-synced queries (even though when requesting FODA directly from the FODA v1 query - as they would normally do - would give them back FODA v1). Those clients will completely break.

## Options

So there's my three options.

(1) FODA-synced queries return the latest FODA hash, but the client is then required to refresh the FODA itself, using it's regular mechanism, because it can use the response.

    Con: Suffers from the thrashing issue. FODA-synced queries may occasionally fail during new deployments in horizontally-scaled environments, unless those deployments can be carefully coordinated.

    Con: Gotta make two queries instead of one, which on a flaky connection isn't ideal.

(2) FODA-synced queries return the full FODA response when the client is outdated, with the FODA also in-scope of that API's schema.

    Con: A breaking change to the FODA requires a breaking change to all FODA-synced queries too. This has a huge DX impact.

(3) FODA-synced queries return the full FODA response when the client is outdated, and the FODA is a untyped object that sits outside the API's schema.

    Con: Breaking changes to the FODA immediately break all clients. ⬅️ This is obviously not an option!

## Decision

I have chosen option 1.

Thrashing is an edge case. Flaky networks are common on PT, but one additional request everytime the FODA changes (which should be infrequent, probably only as the result of a commit) is ultimately trivial. Option 2 survives the thrashing, but only if that user isn't one a page where it's visible (i.e. if new stop is added, thrashing could cause the stop page to be intermittently "not found"), which is to say that thrashing is a bad experience regardless of the option chosen here, and would ideally be mitigated at the infra level so that it just doesn't happen. The DX issues are concrete and long-lived (I'd want to keep old API version around for a while).
