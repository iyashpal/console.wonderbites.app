<template>
    <slot></slot>
</template>
<script setup>
import { useAuthStore, useLayoutStore } from 'Js/store';
import { onMounted } from 'vue';

const props = defineProps({
    user: {
        type: Object,
        default: () => ({})
    },

    title: {
        type: String,
        default: "Page Title"
    },

    breadcrumb: {
        type: Object,
        default: () => ({})
    }
})

const Auth = useAuthStore()

const Layout = useLayoutStore()


onMounted(() => {
    Auth.syncUser(props.user)

    Layout.syncTitle(props.title)

    Layout.syncBreadcrumb(props.breadcrumb)
})
</script>
