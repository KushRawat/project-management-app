const site = new sst.aws.StaticSite("Web", {
  // go up one folder (out of `infrastructure`) into `apps/web`
  path:         "../apps/web",

  // since `buildCommand` is run _in_ that folder, this will invoke your web package’s build
  buildCommand: "pnpm build",

  // after build, Next will emit into `.next` at the root of the web folder
  buildOutput:  ".next",
});

export const SiteUrl = site.url;
