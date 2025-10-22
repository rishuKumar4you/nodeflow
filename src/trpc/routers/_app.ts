import prisma from '@/lib/db';
import {z} from 'zod';

import {createTRPCRouter, protectedProcedure} from '../init';

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ctx}) => {
    // console.log({userId: ctx.auth.user.id});
    return prisma.workflow.findMany();
    }),

  createWorkflow: protectedProcedure.mutation(() => {
    return prisma.workflow.create({
      data: {
        name: 'Test Workflow',
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;