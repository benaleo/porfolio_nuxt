// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css', '@vueup/vue-quill/dist/vue-quill.snow.css'],
  routeRules: {
    '/uploads/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  },
  app: {
    head: {
      title: 'Beno – Fullstack Developer',
      meta: [
        { name: 'description', content: 'Fullstack Developer | Spring Boot • Golang • Vue/Nuxt' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:title', content: 'Beno – Fullstack Developer' },
        { property: 'og:description', content: 'Portfolio & blog – Spring Boot • Golang • Vue/Nuxt' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
      ],
    },
  },
  runtimeConfig: {
    auth: {
      adminUsername: process.env.ADMIN_USERNAME,
      adminPassword: process.env.ADMIN_PASSWORD,
      jwtSecret: process.env.JWT_SECRET,
    },
    contact: {
      // e.g. https://formspree.io/f/xxxxxx
      formspreeEndpoint: process.env.FORMSPREE_ENDPOINT || '',
    },
    public: {
      siteName: 'Beno – Fullstack Developer',
      siteDescription: 'Fullstack Developer | Spring Boot • Golang • Vue/Nuxt',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      social: {
        github: 'https://github.com/your-github',
        linkedin: 'https://www.linkedin.com/in/your-linkedin',
        email: 'mailto:benaleo.projects@gmail.com',
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
