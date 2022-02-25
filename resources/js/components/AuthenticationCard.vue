<template>
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
        <div>
            <slot name="logo"></slot>
        </div>

        <div
            :class="[container, 'w-full mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg']"
        >
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
defineProps({ container: { default: 'sm:max-w-md', type: String } })
</script>
