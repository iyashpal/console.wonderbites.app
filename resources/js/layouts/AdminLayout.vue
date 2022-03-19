<template>
  <div>
    <Sidebar />
    <div class="md:pl-64 flex flex-col">
      <TopNavigation />

      <main class="flex-1">
        <div class="py-6">
          <div
            class="max-w-7xl flex items-center justify-between mx-auto px-4 sm:px-6 md:px-8"
            v-if="$slots.title"
          >
            <h1 class="text-2xl font-semibold text-gray-900">
              <slot name="title" />
            </h1>
            <div>
              <slot name="actions" />
            </div>
          </div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
            <slot name="content" />
          </div>
        </div>
      </main>
    </div>
  </div>
  <slot />
</template>
<script setup>
import { useLayoutStore } from '../store';
import Sidebar from './Components/Sidebar.vue'
import TopNavigation from './Components/TopNavigation.vue';

const { user } = defineProps({ user: Object })

console.log(user)
</script>
