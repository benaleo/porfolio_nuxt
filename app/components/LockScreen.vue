<template>
  <div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Enter Password</h2>
        <p v-if="remainingAttempts > 0" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {{ remainingAttempts }} attempts remaining
        </p>
        <p v-else class="text-sm text-red-500">
          Too many attempts. Please try again in {{ Math.ceil(timeRemaining / 60) }} minutes.
        </p>
      </div>
      
      <form @submit.prevent="unlock" class="space-y-4">
        <div>
          <input
            v-model="password"
            type="password"
            :disabled="isLocked"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter secret key"
            autofocus
          />
          <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
        </div>
        
        <button
          type="submit"
          :disabled="isLocked"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLocked ? 'Locked' : 'Unlock' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const emit = defineEmits(['unlocked']);

const password = ref('');
const error = ref('');
const attempts = ref(0);
const maxAttempts = 3;
const lockDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
const unlockTime = ref(0);
const timer = ref<NodeJS.Timeout | null>(null);

onMounted(() => {
  checkLocalStorage();
});

const isLocked = computed(() => {
  return Date.now() < unlockTime.value;
});

const remainingAttempts = computed(() => {
  return Math.max(0, maxAttempts - attempts.value);
});

const timeRemaining = computed(() => {
  const remaining = Math.max(0, Math.ceil((unlockTime.value - Date.now()) / 1000));
  return remaining > 0 ? remaining : 0;
});

const checkLocalStorage = () => {
  const storedLock = localStorage.getItem('appLock');
  if (storedLock) {
    const { unlockTime: storedUnlockTime } = JSON.parse(storedLock);
    if (storedUnlockTime > Date.now()) {
      unlockTime.value = storedUnlockTime;
      startTimer();
    } else {
      localStorage.removeItem('appLock');
    }
  }
};

const startTimer = () => {
  if (timer.value) clearInterval(timer.value);
  
  timer.value = setInterval(() => {
    if (Date.now() >= unlockTime.value) {
      if (timer.value) clearInterval(timer.value);
      localStorage.removeItem('appLock');
    }
  }, 1000);
};

const unlock = async () => {
  if (isLocked.value) return;
  error.value = '';

  try {
    const { data, error: fetchError } = await useFetch<{ ok: boolean; message?: string }>(
      '/api/auth/verify',
      { method: 'POST', body: { password: password.value } }
    );

    if (fetchError.value || !data.value?.ok) {
      attempts.value++;
      error.value = data.value?.message || fetchError.value?.message || 'Incorrect password. Please try again.';

      if (attempts.value >= maxAttempts) {
        unlockTime.value = Date.now() + lockDuration;
        localStorage.setItem('appLock', JSON.stringify({ unlockTime: unlockTime.value }));
        startTimer();
      }
      return;
    }

    localStorage.removeItem('appLock');
    emit('unlocked');
  } catch (e: any) {
    attempts.value++;
    error.value = e?.message || 'An error occurred. Please try again.';

    if (attempts.value >= maxAttempts) {
      unlockTime.value = Date.now() + lockDuration;
      localStorage.setItem('appLock', JSON.stringify({ unlockTime: unlockTime.value }));
      startTimer();
    }
  }
};


onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>
