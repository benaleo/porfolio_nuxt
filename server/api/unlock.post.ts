export default defineEventHandler(async (event) => {
  const { token } = await readBody<{ token: string }>(event);

  if (!token) {
    throw createError({ statusCode: 400, message: "Missing token" });
  }

  const config = useRuntimeConfig();
  let decoded: string;

  try {
    decoded = Buffer.from(token, "base64url").toString("utf-8");
  } catch {
    throw createError({ statusCode: 400, message: "Invalid token encoding" });
  }

  if (decoded !== config.secret) {
    throw createError({ statusCode: 401, message: "Invalid token" });
  }

  return { valid: true };
});
