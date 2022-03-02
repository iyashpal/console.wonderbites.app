<template>
    <a
        :href="link.url"
        class="group flex items-center px-2 py-2 text-sm font-semibold rounded-md"
        :class="[isActive ? 'bg-gray-100 text-gray-900 ' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
    >
        <Icon
            :name="link.icon"
            class="mr-3 flex-shrink-0 h-6 w-6"
            :class="[isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500']"
        />
        {{ link.label }}
    </a>
</template>

<script setup>
import { computed } from 'vue';
const { link } = defineProps({ link: Object })

const isActive = computed(() => {
    if (window.location.pathname !== "/" && link.url !== "/") {
        return window.location.pathname.startsWith(link.url)
    }

    if (["/"].includes(window.location.pathname) && ["/"].includes(link.url)) {
        return true
    }

    return false;
})
</script>
