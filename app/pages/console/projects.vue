<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between relative">
      <div>
        <h1 class="text-2xl font-semibold">Projects</h1>
        <p class="text-sm text-slate-500">Create and manage your projects</p>
      </div>
      <button
        @click="startCreate"
        class="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
      >
        New Project
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
            {{ form.id ? "Edit Project" : "New Project" }}
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
            <label class="block text-sm mb-1">Description</label>
            <ClientOnly>
              <QuillEditor
                v-model:content="form.description"
                contentType="html"
                theme="snow"
                toolbar="full"
                class="bg-white rounded border border-slate-300 dark:border-slate-700"
              />
            </ClientOnly>
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1">Category</label>
              <select
                v-model="form.category"
                class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
              >
                <option v-for="c in categories" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1">Image</label>
              <div class="flex items-center gap-3">
                <input type="file" accept="image/*" @change="onPickImage" />
                <button
                  type="button"
                  v-if="form.image"
                  class="text-sm text-red-600"
                  @click="() => (form.image = null)"
                >
                  Remove
                </button>
              </div>
              <img
                v-if="form.image"
                :src="form.image"
                alt="image"
                class="mt-2 w-full rounded"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1">Tags (comma separated)</label>
            <input
              v-model="tagsInput"
              type="text"
              class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none"
              placeholder="e.g. vue, nuxt, golang"
            />
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
              <th class="px-4 py-2">Category</th>
              <th class="px-4 py-2">Tags</th>
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
              <td class="px-4 py-2 text-slate-500">{{ p.category }}</td>
              <td class="px-4 py-2 text-slate-500">
                {{ (p.tags || []).join(", ") }}
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
                No projects yet
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
import { QuillEditor } from "@vueup/vue-quill";

definePageMeta({ layout: "console", middleware: [admin] });

type Project = {
  id: number;
  title: string;
  description: string;
  category: "Backend" | "Frontend" | "Fullstack" | "Other";
  image?: string | null;
  tags?: string[];
  createdAt: string;
};

const categories = ["Backend", "Frontend", "Fullstack", "Other"] as const;

type ProjectApi = {
  items: Project[];
  total: number;
  take: number;
  skip: number;
};

const page = ref(1);
const pageSize = ref(10);

const {
  data,
  refresh,
  error: fetchError,
} = await useAsyncData(
  () => `project-list-${page.value}-${pageSize.value}`,
  () =>
    $fetch<ProjectApi>("/api/projects", {
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
  description: string;
  category: Project["category"];
  image?: string | null;
  tags?: string[];
}>({ title: "", description: "", category: "Backend", image: null, tags: [] });
const tagsInput = ref("");

const startCreate = () => {
  editing.value = true;
  Object.assign(form, {
    id: undefined,
    title: "",
    description: "",
    category: "Backend",
    image: null,
    tags: [],
  });
  tagsInput.value = "";
};

const startEdit = (p: Project) => {
  editing.value = true;
  Object.assign(form, {
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    image: p.image || null,
    tags: p.tags || [],
  });
  tagsInput.value = (p.tags || []).join(", ");
};

const cancelEdit = () => {
  editing.value = false;
};

const onPickImage = async (e: Event) => {
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
    form.image = res.url;
  } catch (err: any) {
    error.value = err?.data?.message || "Upload failed";
  }
};

const onSave = async () => {
  error.value = "";
  saving.value = true;
  try {
    form.tags = tagsInput.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!form.id) {
      await $fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        body: form,
      });
    } else {
      await $fetch(`/api/projects/${form.id}`, {
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

const onDelete = async (p: Project) => {
  if (!confirm(`Delete "${p.title}"?`)) return;
  try {
    await $fetch(`/api/projects/${p.id}`, {
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
