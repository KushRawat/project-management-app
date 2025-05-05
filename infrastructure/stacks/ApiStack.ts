const api = new sst.aws.ApiGatewayV2("Api", {
  defaults: {
    function: {
      runtime:  "nodejs18.x",
      timeout:   10,
      nodejs: {
        esbuild: {
          external: [
            "fsevents",
            "mysql2",
            "pg",
            "better-sqlite3",
            "kysely-codegen",
          ],
        },
      },
    },
  },
  routes: {
    "POST /trpc/{router}": "apps/web/src/server/trpc/lambda.handler",
  },
});

export const ApiEndpoint = api.url;
