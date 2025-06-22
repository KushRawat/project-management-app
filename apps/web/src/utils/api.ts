import { createTRPCNext } from "@trpc/next";
import superjson         from "superjson";
import { httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        loggerLink(),
        httpLink({
          url: "/api/trpc",
          transformer: superjson,
          fetch: (input, init) =>
            fetch(input, { ...init, credentials: "include" }),
        }),
      ],
    };
  },
  ssr: false,
});
