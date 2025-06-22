import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter }           from '@/server/api/root';
import { createTRPCContext }   from '@/server/api/trpc';

// 1) build the tRPC handler
const trpcHandler = createNextApiHandler({
  router:        appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) =>
          console.error(`❌ tRPC failed on ${path}: ${error.message}`)
      : undefined,
});

export default function handler(req, res) {
  console.log('🔥 RAW REQ.BODY:', req.body);
  return trpcHandler(req, res);
}
