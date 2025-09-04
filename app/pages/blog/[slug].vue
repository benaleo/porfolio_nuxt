<template>
  <div class="mx-auto max-w-3xl px-4 py-16">
    <NuxtLink to="/" class="text-sm text-blue-600">← Back to Home</NuxtLink>
    <div class="mx-auto max-w-3xl px-4">
      <article v-if="post" class="mt-4">
        <div class="text-sm text-slate-500">{{ format(post.publishedAt || post.createdAt) }}</div>
        <h1 class="text-3xl font-bold">{{ post.title }}</h1>
        <p class="mt-4 text-slate-700 dark:text-slate-300 whitespace-pre-line">{{ post.content }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { showError } from '#app'

type Post = {
  id: number
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  publishedAt?: string | null
  createdAt: string
}

const route = useRoute()
const slug = route.params.slug as string

const { data: post, error } = await useAsyncData(`blog-${slug}`, () => $fetch<Post>(`/api/blog/by-slug/${slug}`))

if (error.value) {
  const statusCode = (error.value as any)?.statusCode || 404
  showError({ statusCode, statusMessage: 'Post not found' })
}

const format = (s?: string | null) => (s ? new Date(s).toLocaleDateString() : '')
</script>
