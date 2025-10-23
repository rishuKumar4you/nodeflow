import { createTRPCRouter, protectedProcedure,premiumProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { generateSlug } from "random-word-slugs";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  create:
      premiumProcedure.mutation(({ctx}) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
            },
        });
      }),

  remove:
      protectedProcedure
          .input(z.object({
            id: z.string()
          }))  // attempt to delete the workflow using this id and the currently
               // logged in user
          .mutation(({ctx, input}) => {
            return prisma.workflow.delete({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
            });
          }),

  updateName:
      protectedProcedure
          .input(z.object({id: z.string(), name: z.string().min(1)}))
          .mutation(({ctx, input}) => {
            return prisma.workflow.update({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
                data: {
                    name: input.name
                },
            });
          }),
  getOne: protectedProcedure.input(z.object({id: z.string()}))
              .query(({ctx, input}) => {
                return prisma.workflow.findUnique({
                    where: {
                        id: input.id,
                        userId: ctx.auth.user.id,
                    }
                });
              }),
  getMany: protectedProcedure   // fetch all of the workflows of the user 
                .query(({ctx}) => {
                  return prisma.workflow.findMany({
                    where: {
                      
                      userId: ctx.auth.user.id,
                    }
                  });
                }),

});

// create a protected procedure for creating a workflow. 
// we are adding CRUD operation for workflows, with a rondom name and authenticated user id, 