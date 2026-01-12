# Horizontal Scaling

Horizontal scaling (i.e. having multiple instances running simultaneously) makes it harder to achieve consistency in certain situations. This doc acknowledges those situations and explains how CoreQuery solves them, if applicable.

## Database breaking changes

Sometimes breaking changes need to be made to the database schema, e.g. removing a table. If that case, it's essential that all instances are no longer using the table before the migration runs to remove the table. This means we need to guarantee that the change where we stop using the table is deployed to all instances before the change which adds the migration.

As CoreQuery is published as an NPM package, CoreQuery itself doesn't control how it's deployed. That responsibility falls on the consumer projects. To help, CoreQuery will always ensure breaking database changes are made as a major version bump. This means consumer projects should always make sure they've deployed the latest minor version of any major version of CoreQuery before upgrading to the next major version, and never skip a major version.

(In the example of removing a table, that last minor version will stop using the table, and the new major version will include the migration to remove the table.)

For example, if versions `1.0`, `1.1`, `1.2`, `2.0`, `2.1`, and `3.0` exist. A consumer running `2.0` must first upgrade to `2.1`, deploy all instances, and only then upgrade to `3.0`. A consumer running `1.0` can skip version `1.1`, but must upgrade to `1.2`, then `2.0`, then `2.1`, and only then `3.0`, deploying between each upgrade.

(Note that this is unnecessary if deployments are not horizontally scaled!)

## GTFS, disruptions, and other polling

GTFS data, disruptions, and other polled data are stored in memory for performance reasons. This means that if multiple instances are running, each instance will have its own copy of the data in memory. When data needs to be updated, those updates need to be synchronized across all instances.

This is achieved through the relay server. CoreQuery instances poll the relay server for updates, at high frequency. As we own the relay server, and are it's only client, we can poll stupidly fast (e.g. every second) without worrying about rate limiting. We poll its `status` endpoint, where the relay server provides hashes of all the data it has. If the hashes differ from what the current instance has, we fetch the updated data.

Since we poll extremely frequently, the instances are kept very closely in sync, and the user impact of any discrepancies is minimal.

### GTFS

For GTFS a different strategy might be required, as unlike disruptions or most other polled data, the GTFS data is a larger download and expensive to parse. Therefore, even if each instance notices the change within the same second, it could be a while longer before the instance is ready to serve the new data, and there might be a higher variance between when each instance is serving the new data.

(**TODO:** This is something I'll have to monitor, and see if it's an issue.)

If it is, the relay server will be modified to serve both versions of the GTFS data for a short time (say, 5 minutes), with timestamps indicating when it began serving each version of the data. When each of the instances see the new version of the data, they download and parse it, but continue serving the old data until exactly 5 minutes after the relay's provided timestamp.

The relay must continue to serve the old data during that 5 minute window, just in case any new instances spin up during that time. Those instances will first download and parse the new data, to make sure they're ready to switch over as soon as needed, but then download and parse the old data too, to use for the time being. They should make sure both new and old data is ready to use before starting to accept requests.

## Foundational data & configuration changes

Any changes to the foundational data or configuration of CoreQuery require a new commit and therefore deployment. During deployment, there's a risk that some requests from the frontend will hit the old instances and others will hit the new instances. Different configuration can lead to differing API responses, and in particular, differences in the foundational data (which will have different hashes and force the frontend to replace its cached foundational data).

This could mean, for a brief period of time, the frontend is forced to ping-pong between two different versions of the foundational data, and the user might see two different versions of the data if they refresh the page or navigate around.

Ideally, deployments would be configured to switch over to **all** instances of the new code when ready, all at once. However, depending the platform where the code is deployed, that might not be an option.

This is a difficult problem to solve, and has a relatively minor user impact (it's only short, and the foundational data should remain consistent with each live data response due to the force update mechanism, so I don't expect any errors, just inconsistencies), so for now, no attempt is made to solve it.

Storing stringified foundational data in the database to be re-used on next boot for a certain period of time, at which time all instances would switch over to the new data simultaneously, is a solution that was considered, and may one-day be implemented. However, when the foundational data changes, the GTFS data should ideally be re-parsed (which complicates its synchronization mechanism), so this solution was seen as creating too much complexity for now.
