import { initTRPC, TRPCError } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { getServerSession } from "next-auth";
import { authOptions }      from "@/pages/api/auth/[...nextauth]";
import { db }               from '@/server/db'

// 1) Build the “inner” context using session + prisma client
function createInnerTRPCContext(opts: {
  session: Awaited<ReturnType<typeof getServerSession>>
}) {
  return { session: opts.session, db }
}

// 2) Adapter for Next.js — calls getServerSession under the hood
// export async function createTRPCContext({
//   req,
//   res,
// }: CreateNextContextOptions) {
//   const session = await getServerSession(req, res, authOptions)
//   return createInnerTRPCContext({ session })
// }

export async function createTRPCContext({ req, res }: CreateNextContextOptions) {
  const session = await getServerSession(req, res, authOptions);
  return { session, db };
}

// 3) Initialize tRPC
const t = initTRPC
  .context<ReturnType<typeof createInnerTRPCContext>>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError: error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
        },
      }
    },
  })

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user)
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next()
})

export const createTRPCRouter = t.router
