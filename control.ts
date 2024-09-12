#!/usr/bin/env -S deno run --allow-run --allow-net

import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router
  .get("/snapshot", (context) => {
    console.log("DUNCAN");

    context.response.status = 200;
    context.response.body = "Success!";
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
