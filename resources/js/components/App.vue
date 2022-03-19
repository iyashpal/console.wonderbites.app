<template>
    <slot></slot>
</template>
<script setup>
import { useAuthStore } from 'Js/store';
import { onMounted } from 'vue';

const props = defineProps( { user: Object } )

const Auth = useAuthStore()

onMounted(() => {
    Auth.syncUser(props.user)
})
</script>
