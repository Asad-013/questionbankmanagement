import { Resend } from 'resend';

/**
 * Get an initialized Resend client.
 * Returns null if the API key is not configured.
 * This helper avoids build-time errors when the environment variables are not available.
 */
export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('RESEND_API_KEY is not configured. Email features will not work.');
    }
    return null;
  }
  
  return new Resend(apiKey);
}
