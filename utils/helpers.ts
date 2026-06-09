/**
 * Reads a required environment variable.
 * Throws a descriptive error if it is missing or empty, so tests fail
 * fast with a clear message instead of running with `undefined`/empty values.
 */
export function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(
      `Missing required environment variable "${key}". Add it to your .env file (see .env.example).`,
    );
  }
  return value;
}

/**
 * Reads an optional environment variable, returning `fallback` when it is
 * missing or empty.
 */
export function getEnvOptional(key: string, fallback = ''): string {
  const value = process.env[key];
  return value === undefined || value.trim() === '' ? fallback : value;
}

/**
 * Generates a unique, disposable Mailsac email with an 8-character random
 * local part (e.g. "a1b2c3d4@mailsac.com"). No inbox needs to be provisioned,
 * each run is isolated, and the short local part keeps the address from being
 * truncated in the UI's "verification email sent" message.
 */
export function generateMailsacEmail(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let localPart = '';
  for (let i = 0; i < 8; i++) {
    localPart += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${localPart}@mailsac.com`;
}
