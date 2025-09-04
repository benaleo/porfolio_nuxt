<template>
  <div class="mx-auto max-w-3xl px-4 py-16">
    <NuxtLink to="/" class="text-sm text-blue-600">← Back to Home</NuxtLink>
    <div class="mx-auto max-w-3xl px-4">
      <article v-if="post" class="mt-4">
        <div class="text-sm text-slate-500">{{ format(post.date) }}</div>
        <h1 class="text-3xl font-bold">{{ post.title }}</h1>
        <p class="mt-4 text-slate-700 dark:text-slate-300 whitespace-pre-line">{{ post.content }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { blogs } from '~/data/blog'
import { showError } from '#app'

const route = useRoute()
const slug = route.params.slug as string
const post = blogs.find((b) => b.slug === slug)

if (!post) {
  showError({ statusCode: 404, statusMessage: 'Post not found' })
}

const format = (s: string) => new Date(s).toLocaleDateString()
</script>
