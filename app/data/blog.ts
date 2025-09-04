export type Blog = {
  slug: string
  title: string
  date: string
  snippet: string
  content: string
}

export const blogs: Blog[] = [
  {
    slug: 'spring-boot-best-practices',
    title: 'Spring Boot Best Practices for Production',
    date: '2024-11-10',
    snippet: 'Configuration, observability, and secure defaults to take your Spring Boot service to production…',
    content:
      'In this article, we cover profiles, config binding, metrics (Micrometer), health checks, and container-friendly JVM settings for Spring Boot.',
  },
  {
    slug: 'nuxt3-performance',
    title: 'Nuxt 3 Performance Tips',
    date: '2025-02-05',
    snippet: 'Code-splitting, image optimization, and caching strategies for fast Nuxt apps…',
    content:
      'Leverage route rules, lazy components, and modern image formats. Monitor with Web Vitals and Lighthouse.',
  },
]
