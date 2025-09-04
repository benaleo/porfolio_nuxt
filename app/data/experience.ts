export type Experience = {
  period: string
  role: string
  company: string
  description: string
}

export const experiences: Experience[] = [
  {
    period: '2023 - Present',
    role: 'Backend Engineer - Spring Boot',
    company: 'BCA Youth Community',
    description: 'Building and maintaining backend services with Spring Boot, designing REST APIs, and integrating with internal systems.',
  },
  {
    period: '2021 - 2023',
    role: 'Fullstack Developer',
    company: 'Startup Labs',
    description: 'Developed fullstack features using Golang (backend) and Vue/Nuxt (frontend), improved performance and DX.',
  },
]
