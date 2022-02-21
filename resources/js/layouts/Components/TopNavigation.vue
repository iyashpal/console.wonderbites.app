<template>
    <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <button
            @click="$store.commit('layout/toggleSidebar')"
            type="button"
            class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        >
            <span class="sr-only">Open sidebar</span>
            <Icon name="menu" class="h-6 w-6" />
        </button>
        <div class="flex-1 px-4 flex justify-between">
            <div class="flex-1 flex"></div>
            <div class="ml-4 flex items-center md:ml-6">
                <button
                    type="button"
                    class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <span class="sr-only">View notifications</span>
                    <Icon name="notifications" class="h-6 w-6" />
                </button>

                <UserDropdown />
            </div>
        </div>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import UserDropdown from './UserDropdown.vue';
</script>
