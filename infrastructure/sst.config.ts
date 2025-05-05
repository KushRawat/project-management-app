export default $config({
  app({ stage }) {
    return {
      name:    "project-management-app-infra",
      home:    "aws",
      region:  "ap-south-1",
      profile: "sst-admin",
      removal: stage === "production" ? "retain" : "remove",
    };
  },

  providers: {
    aws: {
      profile: "sst-admin",
    },
  },

  build: {
    esbuild: {
      loader:   { ".node": "file" },
      external: ["fsevents"],
    },
  },

  async run() {
    const { ApiEndpoint } = await import("./stacks/ApiStack");
    const { SiteUrl     } = await import("./stacks/WebStack");
    return { ApiEndpoint, SiteUrl };
  },
});
