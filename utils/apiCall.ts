import { request } from '@playwright/test';
import { getEnv } from './helpers';

const MAILSAC_BASE_URL = 'https://mailsac.com';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface ApiCallOptions {
  /** Base URL prepended to `path` (e.g. "https://mailsac.com/api"). */
  baseURL?: string;
  /** Extra request headers (auth keys, content-type, etc.). */
  headers?: Record<string, string>;
  /** Query-string parameters. */
  params?: Record<string, string | number | boolean>;
  /** Request body (serialized as JSON). */
  data?: unknown;
}

/**
 * Thin, reusable API client over Playwright's request context.
 * Spins up a request context, performs the call, throws on a non-2xx
 * response (with status + body for debugging), and returns the parsed JSON.
 *
 * Example:
 *   const messages = await apiCall<Message[]>('get', `/api/addresses/${email}/messages`, {
 *     baseURL: 'https://mailsac.com',
 *     headers: { 'Mailsac-Key': key },
 *   });
 */
export async function apiCall<T = unknown>(
  method: HttpMethod,
  path: string,
  options: ApiCallOptions = {},
): Promise<T> {
  const context = await request.newContext({
    baseURL: options.baseURL,
    extraHTTPHeaders: options.headers,
  });

  try {
    const response = await context[method](path, {
      params: options.params,
      data: options.data,
    });

    if (!response.ok()) {
      throw new Error(
        `API ${method.toUpperCase()} ${path} failed ` +
          `(${response.status()} ${response.statusText()}): ${await response.text()}`,
      );
    }

    return (await response.json()) as T;
  } finally {
    await context.dispose();
  }
}

/**
 * Polls a Mailsac inbox and returns the first link of the latest email
 * (the primary CTA, e.g. the "Verify your email" button). Email delivery is
 * async, so it retries until a message with a link appears or it times out.
 *
 * Requires the MAILSAC_API_KEY environment variable.
 */
export async function getLatestEmailLink(
  email: string,
  options: { timeoutMs?: number; pollIntervalMs?: number } = {},
): Promise<string> {
  const { timeoutMs = 30_000, pollIntervalMs = 2_000 } = options;

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const messages = await apiCall<Array<{ links?: string[] }>>(
      'get',
      `/api/addresses/${encodeURIComponent(email)}/messages`,
      {
        baseURL: MAILSAC_BASE_URL,
        headers: { 'Mailsac-Key': getEnv('MAILSAC_API_KEY') },
      },
    );

    const link = messages[0]?.links?.[0];
    if (link) {
      return link;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`No email with a link arrived for "${email}" within ${timeoutMs}ms.`);
}