// import { StackContext, NextjsSite } from "@serverless-stack/resources";

export function WebStack({ stack, app }: StackContext) {
  const site = new NextjsSite(stack, "Web", {
    path: "apps/web",
    environment: {
      NEXT_PUBLIC_API_URL: stack.outputs.ApiEndpoint,
      NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  });

  stack.addOutputs({ SiteUrl: site.url });
}
