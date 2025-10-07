<template>
  <section class="relative py-36 sm:py-20">
    <div class="mx-auto max-w-5xl px-4">
      <ClientOnly>
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          class="text-center"
        >
          <div
            class="mx-auto size-32 sm:size-50 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-500"
          >
            <img
              :src="props.avatar || ''"
              alt="avatar"
              class="size-full rounded-full object-cover"
            />
          </div>
          <h1
            class="mt-6 text-3xl sm:text-4xl md:text-5xl text-slate-100 font-extrabold tracking-tight"
          >
            {{ props.name }}
          </h1>
          <p class="mt-3 text-slate-300">
            {{
              props.tagline ||
              "Fullstack Developer | Spring Boot • Golang • Vue/Nuxt"
            }}
          </p>
          <button
            @click="showBiography = !showBiography"
            class="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
          >
            Show Biography
          </button>
          <div
            v-if="showBiography"
            class="fixed top-0 left-0 right-0 bottom-0 z-50 transition-opacity duration-800"
            :class="{ 'opacity-100': showBiography, 'opacity-0': !showBiography }"
          >
            <BiographyElement :bio="props.bio || ''" :showBiography="showBiography" @close="closeBiography" />
          </div>

          <div class="mt-5 flex items-center justify-center gap-4">
            <a
              v-if="props.github"
              :href="props.github || ''"
              target="_blank"
              rel="noopener"
              class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path
                  d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.12-1.5-1.12-1.5-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.6 2.36 1.14 2.94.87.09-.67.35-1.14.64-1.4-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .85-.28 2.79 1.05A9.4 9.4 0 0112 6.82c.86 0 1.74.12 2.55.34 1.93-1.33 2.78-1.05 2.78-1.05.56 1.4.21 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.69.95.69 1.92v2.84c0 .27.18.59.69.49A10.02 10.02 0 0022 12.26C22 6.58 17.52 2 12 2z"
                />
              </svg>
            </a>
            <a
              v-if="props.linkedin"
              :href="props.linkedin || ''"
              target="_blank"
              rel="noopener"
              class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path
                  d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5C0 2.12 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zM8.5 8h3.8v2.2h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V24h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9V24h-4V8z"
                />
              </svg>
            </a>
            <a
              :href="props.email || ''"
              class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path
                  d="M20 4H4a2 2 0 00-2 2v.35l10 6.25L22 6.35V6a2 2 0 00-2-2zm0 4.23l-8 5-8-5V18a2 2 0 002 2h12a2 2 0 002-2V8.23z"
                />
              </svg>
            </a>
          </div>

          <div class="mt-6 flex items-center justify-center gap-3">
            <a
              href="/cv.pdf"
              download
              class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Download CV
            </a>
            <a
              href="#contact"
              class="inline-flex items-center gap-2 rounded-lg text-white hover:text-slate-700 border border-slate-700 px-4 py-2 hover:bg-slate-100 transition"
            >
              Contact Me
            </a>
          </div>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Profile } from "~/types/profile.types";
import BiographyElement from "./BiographyElement.vue";

const props = defineProps<Partial<Profile>>();
const showBiography = ref(false);

const closeBiography = () => {
  showBiography.value = false;
};
</script>
