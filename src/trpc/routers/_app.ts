import prisma from "@/lib/prisma";

import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(() => {
    return prisma.user.findMany();
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;