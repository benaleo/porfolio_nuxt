// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css", "@vueup/vue-quill/dist/vue-quill.snow.css"],

  routeRules: {
    // Cache uploads for 1 year
    "/uploads/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    // Security headers for all routes
    '/*': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:;"
      }
    }
  },

  app: {
    head: {
      title: "Beno – Fullstack Developer",
      meta: [
        {
          name: "description",
          content: "Fullstack Developer | Spring Boot • Golang • Vue/Nuxt",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { property: "og:title", content: "Beno – Fullstack Developer" },
        {
          property: "og:description",
          content: "Portfolio & blog – Spring Boot • Golang • Vue/Nuxt",
        },
        { property: "og:type", content: "website" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.ico" }],
    },
  },

  runtimeConfig: {
    // Server-only config (not exposed to client)
    secret: process.env.APP_SECRET || 'default-secret-key',
    auth: {
      adminUsername: process.env.ADMIN_USERNAME,
      adminPassword: process.env.ADMIN_PASSWORD,
      jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
    },
    contact: {
      formspreeEndpoint: process.env.FORMSPREE_ENDPOINT || "",
    },
    // Public config (exposed to client)
    public: {
      siteName: "Beno – Fullstack Developer",
      siteDescription: "Fullstack Developer | Spring Boot • Golang • Vue/Nuxt",
      siteUrl: process.env.SITE_URL || "https://benaleo-dev.cloud/",
      social: {
        github: "https://github.com/your-github",
        linkedin: "https://www.linkedin.com/in/your-linkedin",
        email: "mailto:benaleo.projects@gmail.com",
      },
      // No sensitive data here
    },
  },
  

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [],
});
