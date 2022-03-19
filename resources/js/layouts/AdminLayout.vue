<template>
  <div>
    <Sidebar />
    <div class="md:pl-64 flex flex-col">
      <TopNavigation />

      <main class="flex-1">
        <div class="pb-6">
          <div class="max-w-7xl mx-auto p-4 sm:px-6 md:px-8">
            <Breadcrumb />

            <div class="mt-2 md:flex md:items-center md:justify-between">
              <div class="flex-1 min-w-0">
                <h2
                  class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
                >{{ Layout.title }}</h2>
              </div>
              <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
                <slot name="actions" />
              </div>
            </div>
          </div>

          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
            <slot name="content" />

            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script setup>
import { useLayoutStore } from 'Js/store';
import Sidebar from './Components/Sidebar.vue'
import Breadcrumb from './Components/Breadcrumb.vue';
import TopNavigation from './Components/TopNavigation.vue';

const Layout = useLayoutStore()
</script>
