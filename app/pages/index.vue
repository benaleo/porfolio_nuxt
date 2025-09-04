<template>
  <div>
    <section id="intro">
      <IntroSection
        :name="profile?.name"
        :avatar="profile?.avatar"
        :bio="profile?.bio"
        :contactNumber="profile?.contactNumber"
        :github="profile?.github"
        :linkedin="profile?.linkedin"
        :email="profile?.email"
      />
    </section>
    <section id="projects"><ProjectsSection /></section>
    <section id="education"><EducationSection /></section>
    <section id="experience"><ExperienceSection /></section>
    <section id="counters">
      <CountersSection
        :years="profile?.impactYears"
        :projects="profile?.impactProjects"
        :oss="profile?.impactOss"
      />
    </section>
    <section id="blog"><BlogSection /></section>
    <section id="contact">
      <ContactSection :email="profile?.email" :phone="profile?.contactNumber" />
    </section>
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

const { data: profile } = await useAsyncData("profile", () =>
  $fetch<Profile | null>("/api/profile")
);

// Log traffic on client mount
useLogTrafic()
</script>
