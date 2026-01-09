import prisma from "@/lib/prisma";

import { inngest } from "@/inngest/client";

import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),
  crateWorkflow: protectedProcedure.mutation(async (ctx) => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "guangxinyu1998@gmail.com",
      },
    });

    return prisma.workflow.create({
      data: {
        name: "test-workflow",
        userId: ctx.ctx.auth.user.id
      },
    });
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;