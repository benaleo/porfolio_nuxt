<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between relative">
      <div>
        <h1 class="text-2xl font-semibold">Education</h1>
        <p class="text-sm text-slate-500">
          Create and manage your education history
        </p>
      </div>
      <button
        @click="startCreate"
        class="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
      >
        New Education
      </button>
      <div v-if="editing" class="absolute z-50 top-0 left-0 w-full h-fit bg-white text-slate-700 rounded-xl">
      <!-- Editor -->
      <form
        v-if="editing"
        class="rounded-xl border border-slate-200 dark:border-slate-800 px-4 pt-4 pb-24  space-y-3"
        @submit.prevent="onSave"
      >
        <div class="text-sm font-medium">
          {{ form.id ? "Edit Education" : "New Education" }}
        </div>
        <div>
          <label class="block text-sm mb-1">Year</label>
          <input
            v-model="form.year"
            type="text"
            class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Institution</label>
          <input
            v-model="form.institution"
            type="text"
            class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none"
            required
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Major</label>
          <input
            v-model="form.major"
            type="text"
            class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none"
            required
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Summary (optional)</label>
          <textarea
            v-model="form.summary"
            rows="5"
            class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none"
          ></textarea>
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
              <th class="px-4 py-2">Year</th>
              <th class="px-4 py-2">Institution</th>
              <th class="px-4 py-2">Major</th>
              <th class="px-4 py-2">Created</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in items"
              :key="e.id"
              class="border-b border-slate-200/70 dark:border-slate-800"
            >
              <td class="px-4 py-2 font-medium">{{ e.year }}</td>
              <td class="px-4 py-2">{{ e.institution }}</td>
              <td class="px-4 py-2 text-slate-500">{{ e.major }}</td>
              <td class="px-4 py-2 text-slate-500">
                {{ format(e.createdAt) }}
              </td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2">
                  <button
                    class="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    @click="startEdit(e)"
                  >
                    Edit
                  </button>
                  <button
                    class="px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50"
                    @click="onDelete(e)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="(items || []).length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-slate-500">
                No education records yet
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

type Education = {
  id: number;
  year: string;
  institution: string;
  major: string;
  summary?: string | null;
  createdAt: string;
};

type EducationApi = {
  items: Education[];
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
  () => `education-list-${page.value}-${pageSize.value}`,
  () =>
    $fetch<EducationApi>("/api/education", {
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
  year: string;
  institution: string;
  major: string;
  summary?: string | null;
}>({ year: "", institution: "", major: "", summary: "" });

const startCreate = () => {
  editing.value = true;
  Object.assign(form, {
    id: undefined,
    year: "",
    institution: "",
    major: "",
    summary: "",
  });
};

const startEdit = (e: Education) => {
  editing.value = true;
  Object.assign(form, {
    id: e.id,
    year: e.year,
    institution: e.institution,
    major: e.major,
    summary: e.summary || "",
  });
};

const cancelEdit = () => {
  editing.value = false;
};

const onSave = async () => {
  error.value = "";
  saving.value = true;
  try {
    if (!form.id) {
      await $fetch("/api/education", {
        method: "POST",
        credentials: "include",
        body: form,
      });
    } else {
      await $fetch(`/api/education/${form.id}`, {
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

const onDelete = async (e: Education) => {
  if (!confirm(`Delete education ${e.year} at ${e.institution}?`)) return;
  try {
    await $fetch(`/api/education/${e.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await refresh();
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to delete";
  }
};

const format = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString() : "";
</script>
