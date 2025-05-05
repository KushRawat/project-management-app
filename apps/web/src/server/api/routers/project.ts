import { z } from "zod";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";

export const projectRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.project.findMany({
      where: {
        members: { some: { userId: ctx.session!.user.id } },
      },
      include: { members: true },
    })
  ),
  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string().optional() }))
    .mutation(({ ctx, input }) =>
      ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          members: {
            create: { userId: ctx.session!.user.id, role: "owner" },
          },
        },
      })
    ),
});
