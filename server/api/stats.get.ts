import { db } from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const [blog, projects, education, experience, profile] = await Promise.all([
      db.blogPost.count(),
      db.project.count(),
      db.education.count(),
      db.experience.count(),
      db.profile.findUnique({ where: { id: 1 }, select: { id: true } }),
    ])
    return {
      blog,
      projects,
      education,
      experience,
      hasProfile: !!profile,
    }
  } catch (e: any) {
    if (e?.code === 'P2021') {
      return { blog: 0, projects: 0, education: 0, experience: 0, hasProfile: false }
    }
    throw e
  }
})
