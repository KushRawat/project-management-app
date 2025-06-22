// import { StackContext, Api } from "@serverless-stack/resources";

export function ApiStack({ stack }: StackContext) {
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        runtime: "nodejs18.x",
        timeout: 10,
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
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
          SUPABASE_URL: process.env.SUPABASE_URL!,
          SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE!,
        },
      },
    },
    routes: {
      // NextAuth (both GET & POST)
      "GET    /api/auth/{proxy+}": "apps/web/src/pages/api/auth/[...nextauth].handler",
      "POST   /api/auth/{proxy+}": "apps/web/src/pages/api/auth/[...nextauth].handler",
      // tRPC (both GET & POST)
      "GET    /trpc/{router}":    "apps/web/src/pages/api/trpc/[trpc].handler",
      "POST   /trpc/{router}":    "apps/web/src/pages/api/trpc/[trpc].handler",
    },
  });

  stack.addOutputs({ ApiEndpoint: api.url });
}
