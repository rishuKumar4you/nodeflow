import type {GetStepTools, Inngest} from "inngest";

export type Workflowcontext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export interface NodeExecutorParams<TData = Record<string, unknown>> {
    data: TData;  // in ai node, it's system prompt; in stripe it's payment data 
    nodeId: string;
    context: Workflowcontext;
    step: StepTools;

    // publish: TODO Add realtime later

};

export type NodeExecutor<TData = Record<string, unknown>> = (
    params: NodeExecutorParams<TData>,

)=> Promise<Workflowcontext>;
