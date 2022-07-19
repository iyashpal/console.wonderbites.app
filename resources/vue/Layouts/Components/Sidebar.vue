<template>
    <transition leave-active-class="duration-300">
        <div
            v-show="LayoutStore.isSidebarEnabled"
            class="fixed inset-0 flex z-40 md:hidden"
            role="dialog"
            aria-modal="true"
        >
            <transition
                enter-from-class="opacity-0"
                enter-active-class="transition-opacity ease-linear duration-300"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-active-class="transition-opacity ease-linear duration-300"
                leave-to-class="opacity-0"
            >
                <div
                    v-show="LayoutStore.isSidebarEnabled"
                    class="fixed inset-0 bg-gray-600 bg-opacity-75"
                    aria-hidden="true"
                ></div>
            </transition>

            <transition
                enter-from-class="-translate-x-full"
                enter-active-class="transition ease-in-out duration-300 transform"
                enter-to-class="translate-x-0"
                leave-from-class="translate-x-0"
                leave-active-class="transition ease-in-out duration-300 transform"
                leave-to-class="-translate-x-full"
            >
                <div
                    v-show="LayoutStore.isSidebarEnabled"
                    class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white"
                >
                    <transition
                        enter-from-class="opacity-0"
                        enter-active-class="ease-in-out duration-300"
                        enter-to-class="opacity-100"
                        leave-from-class="opacity-100"
                        leave-active-class="ease-in-out duration-300"
                        leave-to-class="opacity-0"
                    >
                        <div class="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                @click="LayoutStore.toggleSidebar()"
                                type="button"
                                class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <span class="sr-only">Close sidebar</span>
                                <Icon name="close" class="h-6 w-6 text-white" />
                            </button>
                        </div>
                    </transition>

                    <div class="flex-shrink-0 flex items-center px-4">
                        <img class="h-7 w-auto" src="/images/logo.png" alt="Wonderbites" />
                    </div>
                    <div class="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav class="px-2 space-y-1">
                            <SidebarLink
                                v-bind="{ link, key }"
                                v-for="(link, key) in SidebarLinks"
                            />
                        </nav>
                    </div>
                </div>
            </transition>

            <div class="flex-shrink-0 w-14" aria-hidden="true">
                <!-- Dummy element to force sidebar to shrink to fit close icon -->
            </div>
        </div>
    </transition>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
            <div class="flex items-center flex-shrink-0 px-4">
                <img class="h-7 w-auto" src="/images/logo.png" alt="Wonderbites" />
            </div>
            <div class="mt-5 flex-grow flex flex-col">
                <nav class="flex-1 px-2 pb-4 space-y-1">
                    <SidebarLink v-bind="{ link, key }" v-for="(link, key) in SidebarLinks" />
                </nav>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import SidebarLinks from './SidebarLinks'
import SidebarLink from './SidebarLink.vue'
import { useLayoutStore } from './../../store'

const LayoutStore = useLayoutStore()
</script>
