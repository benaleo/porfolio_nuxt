<template>
  <section class="py-20" id="blog">
    <div class="mx-auto max-w-6xl px-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl text-white sm:text-3xl font-bold">Blog</h2>
      </div>

      <ClientOnly>
        <div v-if="pending" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card-blue-neon space-y-3">
            <Skeleton class="h-3 w-24" />
            <Skeleton class="h-5 w-3/4" />
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-5/6" />
          </div>
        </div>
        <div
          v-else-if="postItems.length > 0"
          class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <NuxtLink
            v-for="b in postItems"
            :key="b.id"
            :to="`/blog/${b.slug}`"
            class="group card-blue-neon"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }"
          >
            <div class="text-xs text-slate-100">
              {{ format(b.publishedAt || b.createdAt) }}
            </div>
            <div class="mt-1 font-semibold text-white">{{ b.title }}</div>
            <p class="mt-2 text-sm text-slate-300 group-hover:text-white transition prose prose-slate line-clamp-3" v-html="b.content">
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
type BlogResponse = { items: Post[]; total: number; take: number; skip: number };
const { data: posts, pending } = useAsyncData("blog-list", () =>
  $fetch<BlogResponse>("/api/blog"),
  { server: false, lazy: true, getCachedData: () => undefined },
);
const postItems = computed(() => posts.value?.items || []);
const format = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString() : "";
</script>
