<template>
  <section class="py-20" id="blog">
    <div class="mx-auto max-w-6xl px-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl sm:text-3xl font-bold">Blog</h2>
      </div>

      <ClientOnly>
        <div
          v-if="posts?.length"
          class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <NuxtLink
            v-for="b in posts"
            :key="b.id"
            :to="`/blog/${b.slug}`"
            class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80 hover:shadow-lg transition"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }"
          >
            <div class="text-xs text-slate-500">
              {{ format(b.publishedAt || b.createdAt) }}
            </div>
            <div class="mt-1 font-semibold">{{ b.title }}</div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {{ excerpt(b.content) }}
            </p>
          </NuxtLink>
        </div>
        <p v-else class="mt-6 text-slate-500">No posts yet.</p>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
  publishedAt?: string | null;
  createdAt: string;
};
const { data: posts } = await useAsyncData("blog-list", () =>
  $fetch<Post[]>("/api/blog")
);
const format = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString() : "";
const excerpt = (s: string) => (s.length > 120 ? s.slice(0, 120) + "…" : s);
</script>
