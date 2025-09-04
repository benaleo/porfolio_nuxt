<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <p class="text-sm text-slate-500">Overview of your content</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80">
        <div class="text-sm text-slate-500">Blog Posts</div>
        <div class="mt-1 text-3xl font-bold">{{ stats?.blog ?? 0 }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80">
        <div class="text-sm text-slate-500">Projects</div>
        <div class="mt-1 text-3xl font-bold">{{ stats?.projects ?? 0 }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80">
        <div class="text-sm text-slate-500">Education</div>
        <div class="mt-1 text-3xl font-bold">{{ stats?.education ?? 0 }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80">
        <div class="text-sm text-slate-500">Experience</div>
        <div class="mt-1 text-3xl font-bold">{{ stats?.experience ?? 0 }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80 sm:col-span-2 lg:col-span-1">
        <div class="text-sm text-slate-500">Profile</div>
        <div class="mt-1 text-base">
          <span class="inline-flex items-center gap-2 px-2 py-1 rounded-full" :class="stats?.hasProfile ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'">
            <span class="size-2 rounded-full" :class="stats?.hasProfile ? 'bg-green-500' : 'bg-yellow-500'" />
            {{ stats?.hasProfile ? 'Completed' : 'Not set' }}
          </span>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80">
      <div class="text-sm font-medium">Quick Actions</div>
      <div class="mt-3 flex flex-wrap gap-2">
        <NuxtLink to="/console/profile" class="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Edit Profile</NuxtLink>
        <NuxtLink to="/console/blog" class="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Manage Blog</NuxtLink>
        <NuxtLink to="/console/projects" class="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Manage Projects</NuxtLink>
        <NuxtLink to="/console/education" class="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Manage Education</NuxtLink>
        <NuxtLink to="/console/experience" class="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Manage Experience</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import admin from '../../../middleware/admin'
definePageMeta({ layout: 'console', middleware: [admin] })

type Stats = { blog: number; projects: number; education: number; experience: number; hasProfile: boolean }
const { data: stats } = await useAsyncData('stats', () => $fetch<Stats>('/api/stats', { credentials: 'include' }))
</script>