import { computed, ref } from 'vue';
import { useRuntimeConfig, useNuxtApp, useCookie } from '#imports';

// This composable provides secure access to configuration values
export const useConfig = () => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  
  // Only expose what's necessary for the client
  const publicConfig = computed(() => ({
    siteName: config.public.siteName as string,
    siteDescription: config.public.siteDescription as string,
    siteUrl: config.public.siteUrl as string,
    social: config.public.social as {
      github: string;
      linkedin: string;
      email: string;
    }
  }));

  // Use a ref to store the secret
  const secret = ref<string | null>(null);
  
  // Use a cookie to store the secret
  const cookie = useCookie('app-secret');
  
  // On server, get the secret from config
  if (process.server) {
    const serverSecret = (config as any).secret as string || '';
    if (serverSecret) {
      secret.value = serverSecret;
    }
  } 
  // On client, the cookie will be set by the API response

  // Server-only config
  const serverConfig = {
    getSecret: () => secret.value
  };

  return {
    public: publicConfig,
    server: serverConfig
  };
};
