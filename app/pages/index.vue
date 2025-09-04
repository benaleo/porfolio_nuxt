<template>
  <div>
    <section id="intro"><IntroSection /></section>
    <section id="projects"><ProjectsSection /></section>
    <section id="education"><EducationSection /></section>
    <section id="experience"><ExperienceSection /></section>
    <section id="counters"><CountersSection /></section>
    <section id="blog"><BlogSection /></section>
    <section id="contact"><ContactSection /></section>
  </div>
</template>

<script setup lang="ts">
import IntroSection from '~/components/sections/IntroSection.vue'
import ProjectsSection from '~/components/sections/ProjectsSection.vue'
import EducationSection from '~/components/sections/EducationSection.vue'
import ExperienceSection from '~/components/sections/ExperienceSection.vue'
import CountersSection from '~/components/sections/CountersSection.vue'
import BlogSection from '~/components/sections/BlogSection.vue'
import ContactSection from '~/components/sections/ContactSection.vue'
</script>
