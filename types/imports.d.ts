// Type definitions for Nuxt auto-imports
declare module '#imports' {
  import { Ref } from 'vue'
  import { H3Event } from 'h3'
  import { RuntimeConfig } from 'nuxt/schema'
  
  export const useRuntimeConfig: () => RuntimeConfig
  // Add other auto-imported composables as needed
}

// Type definitions for Node.js process
declare namespace NodeJS {
  interface Process {
    server: boolean
    client: boolean
  }
}

// Ensure TypeScript recognizes the ~/composables alias
declare module '~/composables/*' {
  import { Ref } from 'vue'
  
  export function useConfig(): {
    public: {
      value: {
        siteName: string
        siteDescription: string
        siteUrl: string
        social: {
          github: string
          linkedin: string
          email: string
        }
      }
    }
    server: {
      getSecret: () => string | null
    }
  }
}
