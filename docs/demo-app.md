# How does the "Demo App" work? <!-- omit in toc -->

This doc is meant to serve as a reference for future me. It explains the broad architecture, i.e. how the published package works, how the demo app works, how Vite is setup for dev mode, etc. and why certain decisions were made.

## Table of contents <!-- omit in toc -->

<!-- Table of contents created using "Markdown All in One" VSCode extension. -->
<!-- Command palette: "> Markdown All in One: Update Table of Contents" -->

- [Environments](#environments)
  - [Option 1 - A project installs the published `corequery` NPM package and runs it normally.](#option-1---a-project-installs-the-published-corequery-npm-package-and-runs-it-normally)
  - [Option 2 - A project installs the published `corequery` NPM package and runs it with hot-reloading (of their code) enabled.](#option-2---a-project-installs-the-published-corequery-npm-package-and-runs-it-with-hot-reloading-of-their-code-enabled)
  - [Option 3 - A developer in this repo builds and runs it, in the context of a demo app.](#option-3---a-developer-in-this-repo-builds-and-runs-it-in-the-context-of-a-demo-app)
  - [Option 4 - A developer in this repo runs it with hot-reloading enabled, in the context of a demo app.](#option-4---a-developer-in-this-repo-runs-it-with-hot-reloading-enabled-in-the-context-of-a-demo-app)
- [FAQ](#faq)
  - [Why is there a `COREQUERY_HOT_RELOAD` environment variable?](#why-is-there-a-corequery_hot_reload-environment-variable)
  - [Why do we need to modify files in `web/dist` before starting the server?](#why-do-we-need-to-modify-files-in-webdist-before-starting-the-server)

## Environments

There are four environments in which CoreQuery can run. Let's consider how each one works.

### Option 1 - A project installs the published `corequery` NPM package and runs it normally.

This will be the typical situation for TrainQuery running in production.

In this case, the `corequery` package is installed in `node_modules` like so:

```
trainquery
├─ node_modules
│  └─ corequery
│     ├─ server
│     │  └─ dist
│     │     └─ server
│     │        └─ index.js
│     └─ web
│        └─ dist
│           └─ index.html
├─ main.ts
└─ package.json
```

The server code located in `node_modules/corequery/server/dist/server` and imported in `main.ts` serves the static files located in `node_modules/corequery/web/dist` (along with handling API requests).

Before the server starts listening, it modifies some files within `node_modules/corequery/web/dist` to substitute the correct app name (where it must be hardcoded, such as the `manifest.webmanifest` file), favicons, etc.

### Option 2 - A project installs the published `corequery` NPM package and runs it with hot-reloading (of their code) enabled.

From the perspective of CoreQuery, this situation is identical to the previous one. The only difference is that code in `main.ts` is being hot-reloaded. CoreQuery's code is not being hot-reloaded (it's installed as an NPM package - it's code that's already built!).

### Option 3 - A developer in this repo builds and runs it, in the context of a demo app.

CoreQuery is a library - it cannot run by itself, therefore if you want to develop CoreQuery itself and test it, you need to run it in the context of a demo app.

This is what happens when you run `npm run build && npm run start` (after first running `npm run setup`). In this case the folder structure looks very similar:

```
corequery
├─ demo-app
│  ├─ node_modules
│  │  └─ corequery
│  │     ├─ server
│  │     │  ├─ dist
│  │     │  │  └─ server
│  │     │  │     └─ index.js
│  │     │  └─ (...)
│  │     └─ web
│  │        ├─ dist
│  │        │  └─ index.html
│  │        └─ (...)
│  ├─ main.ts
│  └─ package.json
├─ server
│  ├─ dist
│  │  └─ (...)
│  └─ (...)
├─ web
│  ├─ dist
│  │  └─ (...)
│  └─ (...)
└─ (...)
```

When setting up the demo app, we modify `demo-app/package.json` to point `corequery` to the upper directory (`file:../`), which causes NPM to create a symlink at `demo-app/node_modules/corequery`. While that means `demo-app/node_modules/corequery` contains the raw source code for CoreQuery (exactly as it appears in this repository), the prior `npm run build` (in the CoreQuery project) means that the built code is also ready at `demo-app/node_modules/corequery/server/dist` and `demo-app/node_modules/corequery/web/dist`, and therefore the demo app runs normally (from the built code) from its perspective. We change into the `demo-app` directory and run its `npm run start` script.

### Option 4 - A developer in this repo runs it with hot-reloading enabled, in the context of a demo app.

This is the most common situation when developing CoreQuery itself.

Just like Option 3, we have the demo app with a symlink at `demo-app/node_modules/corequery` pointing to the upper directory (the CoreQuery repo), but there are two key differences:

1. We run the demo app's `npm run dev` script instead of `npm run start`. The demo app will likely be configured to hot-reload its server code if `npm run dev` is used.

2. We set the `COREQUERY_HOT_RELOAD` environment variable to `true` before starting the demo app. CoreQuery is configured to look out for this variable, and if seen, it uses the Vite middleware to serve the frontend code instead of serving the static files from `web/dist`. This means that any changes made to CoreQuery's frontend code (in the `web` folder) are hot-reloaded live in the demo app environment.

## FAQ

### Why is there a `COREQUERY_HOT_RELOAD` environment variable?

This variable controls whether the frontend (Vite) code is hot-reloaded. It enables devs working in **this repo** to tweak frontend code and see their changes update live in the demo app environment. It should only ever be set by the `scripts/demo-app.ts` script, and certainly never in a repo consuming the package. It's `true` if we ran `npm run dev` in **this repo**, and `false` if we ran `npm run start`.

The reason an enviroment variable is used (over configuration passed into the `Corequery` class constructor) is that end-consumers of the package consume a pre-built version of the frontend code (`node_modules/corequery/web/dist`). We don't bundle the source code into the NPM package, so comsumer projects are unable to run from the Vite middleware even if they wanted to. As they aren't developing CoreQuery, they have no need to hot-reload the frontend code anyway. There's no point having configuration that no (real) consumer of the package would ever use. Additionally, we should be able to clone any consumer of CoreQuery as a demo app, and shouldn't have to modify any of that consumer's code in order to use it, other than linking the import of the `corequery` package to this repo's local code. Setting an environment variable is much easier than trying to inject configuration into the consumer's Javascript/Typescript code.

### Why do we need to modify files in `web/dist` before starting the server?

The `web/dist` folder contains all the static code served as the frontend. CoreQuery is not server-rendered. Assets like the PWA manifest and favicons are built into the `web/dist` folder when Vite builds the frontend, but we still want the end-consumer of the package to be able to customize the app name and icons. Therefore, before we start serving the `node_modules/corequery/web/dist` folder in the consumer repo, we need to swap out and modify certain files within that folder based on the consumer's configuration. This is one of the many things `Corequery#start()` does when it's called, before launching the web server.
