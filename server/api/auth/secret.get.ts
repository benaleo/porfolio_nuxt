export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // Access the secret from the runtime config
  const secret = config.secret;
  
  console.log('Runtime config keys:', Object.keys(config));
  console.log('Secret from config:', secret);
  
  if (!secret) {
    console.error('No secret found in runtime config');
    return { secret: '' };
  }
  
  // Set a secure cookie with the secret
  setCookie(event, 'app-secret', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  });
  
  return { secret };
});
