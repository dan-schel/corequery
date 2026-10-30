# Foundational Data - Frequently asked questions <!-- omit in toc -->

## Table of contents <!-- omit in toc -->

- [When is a new version of the foundational data API required?](#when-is-a-new-version-of-the-foundational-data-api-required)
- [What happens to the cached foundational data when I add a new field?](#what-happens-to-the-cached-foundational-data-when-i-add-a-new-field)

## When is a new version of the foundational data API required?

Like any API, a change to the foundational data API requires a new version if it widens the result schema or narrows the arguments schema in any way.

Considering the frontend's schema may be outdated, it cannot be given values which are wider than it expects, and it cannot be expected to provide values which are narrower than it expects.

This means, for the **results schema**:

- Adding new fields = ❌ No new version required, result schema has only narrowed. Old frontends will just ignore the new fields.
- Removing a field = ✅ New version required, you've made the result schema wider. Old frontends will break because they still expect that old field to be there.
- Adding a new enum value to a field = ✅ New version required, you've made the result schema wider. Old frontends will break if they encounter the new enum value.
- Removing an enum value from a field = ❌ No new version required, result schema has narrowed. Old frontends will still only ever encounter the enum values they understand.
- Renaming a field = ✅ New version required. A rename is really just a combination of an add and a remove.

And then, for the **arguments schema**:

- Adding new fields = ✅ New version required, you've made the arguments schema narrower. Old frontends won't know to pass this new argument.
- Removing a field = ❌ No new version required, the arguments schema has widened. Old frontends still think they need to supply the argument, but the server will just ignore it.
- Adding a new enum value to a field = ❌ No new version required, the arguments schema has widened. Old frontends will only supply the enum values they know about, and the server still accepts them.
- Removing an enum value from a field = ✅ New version required, you've made the arguments schema narrower. Old frontends won't know that the server no longer accepts that removed enum value.
- Renaming a field = ✅ New version required. A rename is really just a combination of an add and a remove.

## What happens to the cached foundational data when I add a new field?

This is the situation where the frontend (PWA) version updates, and the value in local storage is missing a field it wants.

The frontend will expect the cached foundational data to include the new field, as some pages, presumably, will want to start using it immediately. When it tries to load the FODA from the cache, it'll fail to parse, and therefore the frontend will ignore the cached value and will re-fetch it from the server.
