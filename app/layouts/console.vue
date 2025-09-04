<template>
  <div class="min-h-dvh flex bg-slate-50 dark:bg-slate-950">
    <aside
      class="w-64 shrink-0 border-r border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur hidden md:flex md:flex-col"
    >
      <div
        class="h-14 px-4 flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800"
      >
        <NuxtLink to="/console/dashboard" class="font-semibold">CMS</NuxtLink>
      </div>
      <nav class="p-3 space-y-1 text-sm">
        <NuxtLink
          to="/console/dashboard"
          class="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >Dashboard</NuxtLink
        >
        <NuxtLink
          to="/console/profile"
          class="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >Profile</NuxtLink
        >
        <NuxtLink
          to="/console/blog"
          class="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >Blog</NuxtLink
        >
        <NuxtLink
          to="/console/projects"
          class="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >Projects</NuxtLink
        >
        <NuxtLink
          to="/console/education"
          class="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >Education</NuxtLink
        >
        <NuxtLink
          to="/console/experience"
          class="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >Experience</NuxtLink
        >
        <NuxtLink
          to="/console/request-contact"
          class="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >Request Contact</NuxtLink
        >
        <NuxtLink
          to="/console/log-trafic"
          class="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >Log Trafic</NuxtLink
        >
      </nav>
      <div class="mt-auto p-3">
        <button
          @click="logout"
          class="w-full text-left px-3 py-2 rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300"
        >
          Logout
        </button>
      </div>
    </aside>

    <div class="flex-1 min-w-0 flex flex-col">
      <header
        class="h-14 border-b border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center justify-between px-4"
      >
        <div class="flex items-center gap-2 md:hidden">
          <NuxtLink to="/console/dashboard" class="font-semibold">CMS</NuxtLink>
        </div>
        <div class="text-sm text-slate-500">{{ now }}</div>
      </header>
      <ClientOnly>
        <main class="p-4">
          <slot />
        </main>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClientOnly } from "#components";

const now = new Date().toLocaleString();
const logout = async () => {
  try {
    await $fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    navigateTo("/console/login");
  }
};
</script>
