<template>
  <div>
    <LockScreen v-if="!isUnlocked" @unlocked="handleUnlock" />
    <template v-else>
      <PageReveal @done="onRevealDone" />

      <div v-if="revealDone" class="fixed inset-0">
        <SideDots />

        <!-- Back-to-galaxy rocket (hidden on the hub itself) -->
        <button
          v-show="activeIdx > 0"
          type="button"
          aria-label="Back to galaxy"
          class="back-rocket fixed bottom-4 left-4 z-50"
          @click="onBackToHub"
        >
          <span class="flare" aria-hidden="true" />
          <img src="/page_back.png" alt="" class="rocket-img" draggable="false" />
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

/* ── back-to-galaxy rocket ── */
.back-rocket {
  border: 0;
  padding: 0;
  background: transparent;
  line-height: 0;
}

.rocket-img {
  width: 110px;
  height: auto;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 0 10px rgba(255, 90, 40, 0.25));
  transition: filter 0.25s ease;
}

@media (min-width: 768px) {
  .rocket-img {
    width: 150px;
  }
}

/* hover: slight shake + brighter exhaust */
.back-rocket:hover .rocket-img {
  animation: rocket-shake 0.45s ease-in-out infinite;
  filter: brightness(1.18) drop-shadow(0 0 16px rgba(255, 110, 40, 0.65))
    drop-shadow(0 0 34px rgba(255, 60, 20, 0.35));
}

@keyframes rocket-shake {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  20%      { transform: translate(-1.5px, 1px) rotate(-1.2deg); }
  40%      { transform: translate(2px, -1px) rotate(1.1deg); }
  60%      { transform: translate(-2px, -1.5px) rotate(-0.8deg); }
  80%      { transform: translate(1.5px, 1.5px) rotate(1.3deg); }
}

/* exhaust flare — the back rocket points left, flame exits on the right */
.back-rocket .flare {
  position: absolute;
  top: 50%;
  right: -18px;
  width: 84px;
  height: 84px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 214, 130, 0.95) 0%,
    rgba(255, 120, 40, 0.6) 35%,
    rgba(255, 40, 20, 0.3) 60%,
    transparent 78%
  );
  filter: blur(8px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.back-rocket:hover .flare {
  opacity: 1;
  animation: flare-pulse 0.7s ease-in-out infinite alternate;
}

@keyframes flare-pulse {
  from { transform: translateY(-50%) scale(0.85); }
  to   { transform: translateY(-50%) scale(1.25); }
}

@media (prefers-reduced-motion: reduce) {
  .back-rocket:hover .rocket-img,
  .back-rocket:hover .flare {
    animation: none;
  }
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
