import type { Corequery } from "@/server/corequery.js";
import type { ZodType } from "zod";
import { Router } from "express";
import * as apis from "@/shared/apis/index.js";
import * as handlers from "@/server/api/handlers/index.js";
import type { Api } from "@/shared/apis/types.js";
import type { ApiHandler } from "@/server/api/types.js";

export function createApiRouter(app: Corequery) {
  const router = Router();

  // No CORS middleware needed. The API is served from the same origin as the
  // web app, so nothing is needed to make that work, and browsers already block
  // cross-origin requests bydefault, unless the server explicitly opts-in to
  // allowing JS from another domain accessing it.

  function setup<Args extends ZodType, Result extends ZodType>(
    api: Api<Args, Result>,
    handler: ApiHandler<Args, Result>,
  ) {
    router.post(api.path, async (req, res) => {
      try {
        const args = api.argsSchema.safeParse(req.body);
        if (!args.success) {
          res.status(400).json(args.error);
          return;
        }

        // const token = getToken(req);
        const result = await handler({ app /* token */ }, args.data);
        res.json(result);
      } catch (err) {
        // In future we might want to allow handlers to throw some sort of
        // custom error (e.g. throw new Api400Error(message)) and handle it here
        // to return 400 rather than 500. So far, my plan is to handle that with
        // return types in the schema instead, but it's an idea.

        app.log.general.apiError(api.path, err);
        res.sendStatus(500);
      }
    });
  }

  // List all APIs here.
  setup(apis.FOUNDATIONAL_DATA_V1, handlers.FOUNDATIONAL_DATA_V1);
  setup(apis.ABOUT_PAGE_V1, handlers.ABOUT_PAGE_V1);
  setup(apis.VERSION_CHECK_V1, handlers.VERSION_CHECK_V1);
  setup(apis.VERSIONS_V1, handlers.VERSIONS_V1);

  router.use(/(.*)/, (_req, res) => {
    res.sendStatus(404);
  });

  return router;
}
