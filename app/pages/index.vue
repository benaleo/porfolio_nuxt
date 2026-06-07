<template>
  <div>
    <LockScreen v-if="!isUnlocked" @unlocked="handleUnlock" />
    <template v-else>
      <PageReveal @done="revealDone = true" />

      <div v-if="revealDone">
        <section id="intro">
          <IntroSection
            :name="profile?.name"
            :avatar="profile?.avatar"
            :tagline="profile?.tagline"
            :bio="profile?.bio"
            :contactNumber="profile?.contactNumber"
            :github="profile?.github"
            :linkedin="profile?.linkedin"
            :email="profile?.email"
            :pending="profilePending"
          />
        </section>

        <div
          v-motion
          :initial="{ opacity: 0, y: 64 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        >
          <section id="projects"><ProjectsSection /></section>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, y: 64 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        >
          <section id="education"><EducationSection /></section>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, y: 64 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        >
          <section id="experience"><ExperienceSection /></section>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, y: 64 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        >
          <section id="counters">
            <CountersSection
              :years="profile?.impactYears"
              :projects="profile?.impactProjects"
              :oss="profile?.impactOss"
            />
          </section>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, y: 64 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        >
          <section id="blog"><BlogSection /></section>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, y: 64 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        >
          <section id="contact">
            <ContactSection :email="profile?.email" :phone="profile?.contactNumber" />
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import IntroSection from "~/components/sections/IntroSection.vue";
import ProjectsSection from "~/components/sections/ProjectsSection.vue";
import EducationSection from "~/components/sections/EducationSection.vue";
import ExperienceSection from "~/components/sections/ExperienceSection.vue";
import CountersSection from "~/components/sections/CountersSection.vue";
import BlogSection from "~/components/sections/BlogSection.vue";
import ContactSection from "~/components/sections/ContactSection.vue";
import type { Profile } from "~/types/profile.types";
import { useLogTrafic } from "~/composables/useLogTrafic";
import LockScreen from "~/components/LockScreen.vue";

const { data: profile, pending: profilePending } = useAsyncData("profile", () =>
  $fetch<Profile | null>("/api/profile"),
  { server: false, lazy: true, getCachedData: () => undefined },
);

const isUnlocked = ref(false);
const revealDone = ref(false);

onMounted(() => {
  const sessionUnlocked = sessionStorage.getItem('appUnlocked');
  isUnlocked.value = sessionUnlocked === 'true';
});

const handleUnlock = () => {
  isUnlocked.value = true;
  sessionStorage.setItem('appUnlocked', 'true');
};

if (process.client) {
  useLogTrafic();
}
</script>
