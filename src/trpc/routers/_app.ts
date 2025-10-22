import prisma from '@/lib/db';
import {google} from '@ai-sdk/google';
import {generateText} from 'ai';
import { z } from 'zod';
import {inngest} from '@/ingest/client';

import {createTRPCRouter, protectedProcedure} from '../init';

export const appRouter = createTRPCRouter({

  testAi: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
      
    });

    return { success: true, message: "Job Queued" }
  }),


  // getWorkflows: protectedProcedure.query(({ctx}) => {
  //   // console.log({userId: ctx.auth.user.id});
  //   return prisma.workflow.findMany();
  // }),

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