export type Project = {
  id: string
  title: string
  description: string
  image?: string
  category: 'Backend' | 'Frontend' | 'Fullstack' | string
  tags?: string[]
}

export const projects: Project[] = [
  {
    id: 'spring-boot-api',
    title: 'Banking API – Spring Boot',
    description:
      'A secure banking API with JWT authentication, role-based access, and PostgreSQL. Features transactions, accounts, and audit logs.',
    image:
      'https://images.unsplash.com/photo-1556741533-411cf82e4e2d?q=80&w=1600&auto=format&fit=crop',
    category: 'Backend',
    tags: ['Spring Boot', 'PostgreSQL', 'JWT', 'REST'],
  },
  {
    id: 'golang-microservice',
    title: 'Order Service – Golang',
    description:
      'Golang microservice for order processing with gRPC, Redis caching, and CI/CD. Benchmarked for high throughput.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    category: 'Backend',
    tags: ['Golang', 'gRPC', 'Redis', 'Docker'],
  },
  {
    id: 'nuxt-portfolio',
    title: 'Personal Portfolio – Nuxt 3',
    description:
      'Modern responsive portfolio built with Nuxt 3 and TailwindCSS. Includes projects grid, blog, and animated galaxy background.',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop',
    category: 'Frontend',
    tags: ['Nuxt 3', 'TailwindCSS', 'VueUse Motion'],
  },
  {
    id: 'fullstack-ecommerce',
    title: 'E-Commerce – Fullstack',
    description:
      'Fullstack e-commerce with Nuxt frontend and Spring Boot backend. Features authentication, cart, checkout, and admin dashboard.',
    image:
      'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=1600&auto=format&fit=crop',
    category: 'Fullstack',
    tags: ['Nuxt', 'Spring Boot', 'Stripe', 'PostgreSQL'],
  },
]
