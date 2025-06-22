import { createTRPCRouter } from "./trpc";
import { taskRouter } from "./routers/task";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  user:    userRouter,
  task:    taskRouter,
});

export type AppRouter = typeof appRouter;
