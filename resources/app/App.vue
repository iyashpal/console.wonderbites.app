<template>
    <div class="flex flex-col h-screen items-center justify-center">
        <div class="flex py-10 text-red-500 font-semibold text-5xl">
            {{ counter }}
        </div>

        <div class="flex gap-10">
            <button @click="increase" class="rounded-md px-3 py-2 bg-gray-200 shadow-md">+</button>
            <button @click="decrease" class="rounded-md px-3 py-2 bg-gray-200 shadow-md">-</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const counter = ref(0)

onMounted(() => {
    console.log('App Initialized +1')
})


function increase () {
    counter.value++
}

function decrease () {
    if (counter.value > 1) {
        counter.value--
    }
}
</script>
