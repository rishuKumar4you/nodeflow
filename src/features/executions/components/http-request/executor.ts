import type {NodeExecutor} from '@/features/executions/types';
import {NonRetriableError} from 'inngest';
import ky, {type Options as KyOptions} from 'ky';

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId: _nodeId,
  context,
  step,
}) => {
  // TODO: Publish "loading" state for http request

  if (!data.endpoint) {
    // TODO: Publish "error" state for http request
    throw new NonRetriableError('HTTP Request node: No endpoint configured');

  }

  if (!data.variableName){
    throw new NonRetriableError('HTTP Request node: Missing variable name');
  }

  if (!data.method) {
    throw new NonRetriableError('HTTP Request node: Method not configured');
  }

  const result = await step.run('http-request', async () => {
    const endpoint = data.endpoint;
    const method = data.method;

    const options: KyOptions = {method: method as KyOptions['method']};

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (data.body !== undefined) {
        options.body = data.body as BodyInit;

      }
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get('content-type');

    const responseData = contentType?.includes('application/json') ?
        await response.json() :
        await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };


    if (data.variableName){
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }

    // Fallback to direct httpResponse for backwards comnpatiblity.
    return {
      ...context,
      ...responsePayload,
    };
  });
  // TODO:  Publish "success" state for http request
  return result;
};
