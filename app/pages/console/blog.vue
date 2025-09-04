<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between relative">
      <div>
        <h1 class="text-2xl font-semibold">Blog</h1>
        <p class="text-sm text-slate-500">Create and manage your blog posts</p>
      </div>
      <button
        @click="startCreate"
        class="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
      >
        New Post
      </button>
      <div
        v-if="editing"
        class="absolute z-50 top-0 left-0 w-full h-fit bg-white text-slate-700 rounded-xl"
      >
        <!-- Editor -->
        <form
          v-if="editing"
          class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
          @submit.prevent="onSave"
        >
          <div class="text-sm font-medium">
            {{ form.id ? "Edit Post" : "New Post" }}
          </div>
          <div>
            <label class="block text-sm mb-1">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Slug (optional)</label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Content</label>
            <textarea
              v-model="form.content"
              rows="8"
              class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200"
              required
            ></textarea>
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1">Published Date</label>
              <input
                v-model="form.publishedAt"
                type="date"
                class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Thumbnail</label>
              <div class="flex items-center gap-3">
                <input type="file" accept="image/*" @change="onPickThumbnail" />
                <button
                  type="button"
                  v-if="form.thumbnail"
                  class="text-sm text-red-600"
                  @click="() => (form.thumbnail = null)"
                >
                  Remove
                </button>
              </div>
              <img
                v-if="form.thumbnail"
                :src="form.thumbnail"
                alt="thumb"
                class="mt-2 w-full rounded"
              />
            </div>
          </div>
          <div class="flex items-center gap-2 pt-2">
            <button
              :disabled="saving"
              class="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-60"
            >
              {{ saving ? "Saving…" : "Save" }}
            </button>
            <button
              type="button"
              class="rounded border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <span v-if="error" class="text-sm text-red-600">{{ error }}</span>
          </div>
        </form>
      </div>
    </div>

    <div class="grid">
      <!-- List -->
      <div
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 overflow-x-auto"
      >
        <table class="min-w-full text-sm">
          <thead>
            <tr
              class="text-left border-b border-slate-200/70 dark:border-slate-800"
            >
              <th class="px-4 py-2">Title</th>
              <th class="px-4 py-2">Slug</th>
              <th class="px-4 py-2">Published</th>
              <th class="px-4 py-2">Created</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in items"
              :key="p.id"
              class="border-b border-slate-200/70 dark:border-slate-800"
            >
              <td class="px-4 py-2 font-medium">{{ p.title }}</td>
              <td class="px-4 py-2 text-slate-500">{{ p.slug }}</td>
              <td class="px-4 py-2">
                <span v-if="p.publishedAt" class="text-green-600">{{
                  format(p.publishedAt)
                }}</span>
                <span v-else class="text-yellow-600">Draft</span>
              </td>
              <td class="px-4 py-2 text-slate-500">
                {{ format(p.createdAt) }}
              </td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2">
                  <button
                    class="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    @click="startEdit(p)"
                  >
                    Edit
                  </button>
                  <button
                    class="px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50"
                    @click="onDelete(p)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="(items || []).length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-slate-500">
                No posts yet
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3">
          <div class="text-sm text-slate-600">
            Page {{ page }} of {{ totalPages }}
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              :disabled="page === 1"
              @click="prevPage"
            >
              Prev
            </button>
            <select
              v-model.number="pageSize"
              class="px-2 py-1 rounded border border-slate-300 dark:border-slate-700"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <button
              class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              :disabled="page === totalPages"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import admin from "../../../middleware/admin";

definePageMeta({ layout: "console", middleware: [admin] });

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
  createdAt: string;
  publishedAt?: string | null;
};

type PostApi = { items: Post[]; total: number; take: number; skip: number };

const page = ref(1);
const pageSize = ref(10);

const {
  data,
  refresh,
  error: fetchError,
} = await useAsyncData(
  () => `blog-list-${page.value}-${pageSize.value}`,
  () =>
    $fetch<PostApi>("/api/blog", {
      params: { take: pageSize.value, skip: (page.value - 1) * pageSize.value },
    }),
  { watch: [page, pageSize] }
);

const items = computed(() => data.value?.items || []);
const total = computed(() => data.value?.total || 0);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
);

watch(pageSize, () => {
  page.value = 1;
});
const prevPage = () => {
  if (page.value > 1) page.value--;
};
const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};

const editing = ref(false);
const saving = ref(false);
const error = ref("");

const form = reactive<{
  id?: number;
  title: string;
  slug?: string;
  content: string;
  publishedAt?: string | null;
  thumbnail?: string | null;
}>({ title: "", slug: "", content: "", publishedAt: null, thumbnail: null });

const startCreate = () => {
  editing.value = true;
  Object.assign(form, {
    id: undefined,
    title: "",
    slug: "",
    content: "",
    publishedAt: null,
    thumbnail: null,
  });
};

const startEdit = (p: Post) => {
  editing.value = true;
  Object.assign(form, {
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content,
    publishedAt: p.publishedAt ? p.publishedAt.slice(0, 10) : null,
    thumbnail: p.thumbnail || null,
  });
};

const cancelEdit = () => {
  editing.value = false;
};

const onPickThumbnail = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const fd = new FormData();
  fd.append("file", file);
  try {
    const res = await $fetch<{ url: string }>("/api/upload", {
      method: "POST",
      body: fd,
    });
    form.thumbnail = res.url;
  } catch (err: any) {
    error.value = err?.data?.message || "Upload failed";
  }
};

const onSave = async () => {
  error.value = "";
  saving.value = true;
  try {
    if (!form.id) {
      await $fetch("/api/blog", {
        method: "POST",
        credentials: "include",
        body: form,
      });
    } else {
      await $fetch(`/api/blog/${form.id}`, {
        method: "PATCH",
        credentials: "include",
        body: form,
      });
    }
    await refresh();
    editing.value = false;
  } catch (e: any) {
    error.value = e?.data?.message || "Failed to save";
  } finally {
    saving.value = false;
  }
};

const onDelete = async (p: Post) => {
  if (!confirm(`Delete "${p.title}"?`)) return;
  try {
    await $fetch(`/api/blog/${p.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await refresh();
  } catch (e: any) {
    error.value = e?.data?.message || "Failed to delete";
  }
};

const format = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString() : "";
</script>
