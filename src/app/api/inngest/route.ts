import {inngest} from '@/ingest/client';
import {executeWorkflow} from '@/ingest/functions';
import {serve} from 'inngest/next';

export const {GET, POST, PUT} = serve({
  client: inngest,
  functions: [executeWorkflow],
});