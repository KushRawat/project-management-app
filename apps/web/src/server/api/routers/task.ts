import { z } from "zod";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";

export const taskRouter = createTRPCRouter({
  listByProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.task.findMany({
        where: { projectId: input.projectId },
        include: { assignments: { include: { user: true } } },
      })
    ),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.string().optional(),
        priority: z.number().min(1).max(5).default(3),
        assigneeIds: z.array(z.string()).optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.task.create({
        data: {
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          priority: input.priority,
          assignments: input.assigneeIds
            ? { create: input.assigneeIds.map((id) => ({ userId: id })) }
            : undefined,
        },
      })
    ),
});
