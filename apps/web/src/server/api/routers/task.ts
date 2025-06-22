import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const PRIORITY_OPTIONS = [
  "Not started",
  "In progress",
  "Designing",
  "Testing",
  "Blocked",
  "Complete",
  "On hold",
] as const;

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({
          search:      z.string().optional(),
          assigneeIds: z.array(z.string()).optional(),
          priority:    z.string().optional(),
          start:       z.string().optional(),
          end:         z.string().optional(),
        })
        .default({
          search: "",
          assigneeIds: [],
          priority: "",
          start: "",
          end: "",
        })
    )
    .query(async ({ ctx, input }) => {
      // debugger;                
      console.log("📥 [task.getAll] input:", input);
      const { search, assigneeIds, priority, start, end } = input;
      const where: any = {};

      if (search) {
        where.title = { contains: search, mode: "insensitive" };
      }
      if (assigneeIds?.length) {
        where.assignments = { some: { userId: { in: assigneeIds } } };
      }
      if (priority) {
        const idx = PRIORITY_OPTIONS.indexOf(priority as any);
        if (idx >= 0) where.priority = idx + 1;
      }
      if (start || end) {
        where.dueDate = {};
        if (start) where.dueDate.gte = new Date(start);
        if (end)   where.dueDate.lte = new Date(end);
      }

      const rows = await ctx.db.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { assignments: { include: { user: true } } },
      });

      return rows.map((t) => ({
        ...t,
        priorityName: PRIORITY_OPTIONS[t.priority - 1] ?? "Unknown",
      }));
    }),

  create: publicProcedure
    .input(
      z.object({
        title:       z.string(),
        description: z.string().optional(),
        startDate:   z.string().optional(),
        endDate:     z.string().optional(),
        priority:    z.number().min(1).max(5).default(1),
        assigneeIds: z.array(z.string()).optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      console.log("📥 [task.create] input:", input);
      debugger;
      return ctx.db.task.create({
        data: {
          title:       input.title,
          description: input.description,
          startDate:   new Date(input.startDate),
          endDate:     new Date(input.endDate),
          priority:    input.priority,
          assignments: {
            create: input.assigneeIds.map((userId) => ({ userId })),
          },
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id:          z.string(),
        title:       z.string(),
        description: z.string().optional(),
        dueDate:     z.string().optional(),
        priority:    z.number().min(1).max(PRIORITY_OPTIONS.length),
        assigneeIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.update({
        where: { id: input.id },
        data: {
          title:       input.title,
          description: input.description,
          dueDate:     input.dueDate ? new Date(input.dueDate) : null,
          priority:    input.priority,
          assignments: input.assigneeIds
            ? {
                deleteMany: {},
                create:     input.assigneeIds.map((userId) => ({ userId })),
              }
            : undefined,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.delete({ where: { id: input.id } });
    }),
});
