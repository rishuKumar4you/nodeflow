"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LogoutButton } from "./logout";
import { Button } from "@/components/ui/button";
import { on } from "events";
import { useQueryClient } from "@tanstack/react-query";

const Page = () => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const data = useQuery(trpc.getWorkflows.queryOptions());
  
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
}
}));

  return (
    <div
    className="min-h-screen min-w-screen flex items-center
justify-center flex-col gap-y-6">
      protected server comp
      <div>
        {JSON.stringify(data,null,2)}
      </div>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      <LogoutButton/>
    </div>
  );
};

export default Page;