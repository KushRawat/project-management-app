import { z } from "zod";
import { publicProcedure, protectedProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session!.user.id },
      include: { profile: true },
    });
  }),
  updateProfile: protectedProcedure
    .input(z.object({ bio: z.string().max(500).optional() }))
    .mutation(({ ctx, input }) =>
      ctx.db.profile.upsert({
        where: { userId: ctx.session!.user.id },
        create: { userId: ctx.session!.user.id, bio: input.bio },
        update: { bio: input.bio },
      })
    ),
});
