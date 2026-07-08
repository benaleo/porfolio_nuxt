<template>
  <div>
    <LockScreen v-if="!isUnlocked" @unlocked="handleUnlock" />
    <template v-else>
      <PageReveal @done="onRevealDone" />

      <div v-if="revealDone" class="fixed inset-0">
        <SideDots />
        <SlideNav />

        <!-- Back-to-galaxy button (hidden on the hub itself) -->
        <button
          v-show="activeIdx > 0"
          type="button"
          aria-label="Back to galaxy"
          class="fixed top-5 right-5 z-50 rounded-full border border-slate-700 bg-slate-900/60 backdrop-blur p-3 text-slate-200 hover:bg-white/10 transition"
          @click="onBackToHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
            <circle cx="12" cy="12" r="3.5" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-25 12 12)" />
          </svg>
        </button>

        <FogTransition ref="fogRef" />

        <div :id="SCROLL_ROOT_ID" class="scroll-root h-dvh overflow-hidden">
          <section
            id="hub"
            class="h-dvh snap-none overflow-hidden flex flex-col justify-center"
          >
            <GalaxyHub
              :avatar="profile?.avatar"
              :name="profile?.name"
              :tagline="profile?.tagline"
              @select="onHubSelect"
            />
          </section>

          <section
            id="intro"
            ref="introEl"
            class="h-dvh snap-none overflow-hidden flex flex-col justify-center"
            :style="revealStyle(introActive)"
          >
            <div class="slide-inner max-h-full overflow-y-auto pt-16">
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
            </div>
          </section>

          <section
            v-if="navVisible.projects"
            id="projects"
            ref="projectsEl"
            class="h-dvh snap-none overflow-hidden flex flex-col justify-center"
            :style="revealStyle(projectsActive)"
          >
            <div class="slide-inner max-h-full overflow-y-auto pt-16">
              <ProjectsSection />
            </div>
          </section>

          <section
            v-if="navVisible.education"
            id="education"
            ref="educationEl"
            class="h-dvh snap-none overflow-hidden flex flex-col justify-center"
            :style="revealStyle(educationActive)"
          >
            <div class="slide-inner max-h-full overflow-y-auto pt-16">
              <EducationSection />
            </div>
          </section>

          <section
            v-if="navVisible.experience"
            id="experience"
            ref="experienceEl"
            class="h-dvh snap-none overflow-hidden flex flex-col justify-center"
            :style="revealStyle(experienceActive)"
          >
            <div class="slide-inner max-h-full overflow-y-auto pt-16">
              <ExperienceSection />
            </div>
          </section>

          <section
            v-if="navVisible.counters"
            id="counters"
            ref="countersEl"
            class="h-dvh snap-none overflow-hidden flex flex-col justify-center"
            :style="revealStyle(countersActive)"
          >
            <div class="slide-inner max-h-full overflow-y-auto pt-16">
              <CountersSection
                :years="profile?.impactYears"
                :projects="profile?.impactProjects"
                :oss="profile?.impactOss"
              />
            </div>
          </section>

          <section
            v-if="navVisible.blog"
            id="blog"
            ref="blogEl"
            class="h-dvh snap-none overflow-hidden flex flex-col justify-center"
            :style="revealStyle(blogActive)"
          >
            <div class="slide-inner max-h-full overflow-y-auto pt-16">
              <BlogSection />
            </div>
          </section>

          <section
            id="contact"
            ref="contactEl"
            class="h-dvh snap-none overflow-hidden flex flex-col justify-center"
            :style="revealStyle(contactActive)"
          >
            <div class="slide-inner max-h-full overflow-y-auto pt-16">
              <ContactSection :email="profile?.email" :phone="profile?.contactNumber" />
              <p class="text-center text-sm text-slate-500 pt-8">
                © {{ new Date().getFullYear() }} Beno. All rights reserved.
              </p>
            </div>
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
import SideDots from "~/components/SideDots.vue";
import SlideNav from "~/components/SlideNav.vue";
import GalaxyHub from "~/components/GalaxyHub.vue";
import FogTransition from "~/components/FogTransition.vue";
import type { Profile } from "~/types/profile.types";
import { useLogTrafic } from "~/composables/useLogTrafic";
import { useSlideScroll, SCROLL_ROOT_ID } from "~/composables/useSlideScroll";
import { useReveal } from "~/composables/useReveal";
import LockScreen from "~/components/LockScreen.vue";

const { data: profile, pending: profilePending } = useAsyncData("profile", () =>
  $fetch<Profile | null>("/api/profile"),
  { server: false, lazy: true, getCachedData: () => undefined },
);

const isUnlocked = ref(false);
const revealDone = ref(false);
const route = useRoute();

const { visible: navVisible } = useNavVisibility();
const { init, measure, goTo, activeIdx } = useSlideScroll();

const fogRef = ref<{ play: (m: () => void | Promise<void>) => Promise<void> } | null>(null);

/** Planet click / sun click on the hub: fog in -> instant jump -> fog out. */
const onHubSelect = (id: string) => {
  fogRef.value?.play(() => goTo(id, false));
};

/** Back-to-galaxy button: fog transition home to the hub slide. */
const onBackToHub = () => {
  fogRef.value?.play(() => goTo("hub", false));
};

// One reveal per slide. `xxxEl` is the template ref; `xxxActive` toggles the
// replay-on-enter fade-up. Both are exposed to the template by destructuring.
const { el: introEl, active: introActive } = useReveal();
const { el: projectsEl, active: projectsActive } = useReveal();
const { el: educationEl, active: educationActive } = useReveal();
const { el: experienceEl, active: experienceActive } = useReveal();
const { el: countersEl, active: countersActive } = useReveal();
const { el: blogEl, active: blogActive } = useReveal();
const { el: contactEl, active: contactActive } = useReveal();

/** Fade-up entrance that replays whenever a slide re-enters view. */
const revealStyle = (active: boolean) => ({
  opacity: active ? 1 : 0,
  transform: active ? "translateY(0)" : "translateY(64px)",
  transition: "opacity 700ms ease-out, transform 700ms ease-out",
});

let destroySlides: (() => void) | undefined;

// The slide list is dynamic (data loads late, empty sections drop out) —
// re-measure as visibility flags settle so dots/nav stay accurate. Only
// active once the slides are mounted (revealDone).
watch(
  navVisible,
  () => {
    if (revealDone.value) nextTick().then(measure);
  },
  { deep: true },
);

const onRevealDone = async () => {
  revealDone.value = true;
  await nextTick();
  destroySlides = init();
  // Honor deep links (e.g. arriving at /#blog). Instant jump on first load.
  const hash = route.hash;
  if (hash) {
    await nextTick();
    goTo(hash.slice(1), false);
  }
};

onMounted(async () => {
  const sessionUnlocked = sessionStorage.getItem('appUnlocked');
  if (sessionUnlocked === 'true') {
    isUnlocked.value = true;
    return;
  }

  const unlockParam = route.query.unlock as string | undefined;
  if (unlockParam) {
    try {
      const res = await $fetch<{ valid: boolean }>('/api/unlock', {
        method: 'POST',
        body: { token: unlockParam },
      });
      if (res.valid) {
        isUnlocked.value = true;
        sessionStorage.setItem('appUnlocked', 'true');
      }
    } catch {
      // invalid token — fall through to lock screen
    }
  }
});

onBeforeUnmount(() => {
  destroySlides?.();
});

const handleUnlock = () => {
  isUnlocked.value = true;
  sessionStorage.setItem('appUnlocked', 'true');
};

if (process.client) {
  useLogTrafic();
}
</script>

<style scoped>
.scroll-root {
  scrollbar-width: none;
}
.scroll-root::-webkit-scrollbar {
  display: none;
}
/* Internal per-slide scroll for over-tall content; thin/hidden scrollbar. */
.slide-inner {
  scrollbar-width: thin;
}
.slide-inner::-webkit-scrollbar {
  width: 6px;
}
.slide-inner::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 9999px;
}
.slide-inner::-webkit-scrollbar-track {
  background: transparent;
}
</style>
