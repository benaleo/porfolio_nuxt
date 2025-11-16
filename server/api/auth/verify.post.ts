import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password?: string }>(event);
  const config = useRuntimeConfig();
  const secret = config.secret as string | undefined;

  if (!secret) {
    setResponseStatus(event, 500);
    return { ok: false, message: 'Server secret not configured' };
  }

  if (!password) {
    setResponseStatus(event, 400);
    return { ok: false, message: 'Password is required' };
  }

  if (password === secret) {
    return { ok: true };
  }

  setResponseStatus(event, 401);
  return { ok: false, message: 'Invalid password' };
});
