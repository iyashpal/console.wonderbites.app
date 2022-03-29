<template>
    <button
        @click="toggle"
        :class="{
            'bg-green-100 text-green-800': isSelected,
            'bg-indigo-100 text-indigo-800': !isSelected,
            'inline-flex items-center px-3 py-0.5 mb-2 rounded-full text-sm font-medium': true,
        }"
    >
        <Icon name="check-circle" class="w-3 h-3 mr-1.5" v-if="isSelected" />

        <svg
            v-else
            class="-ml-1 mr-1.5 h-2 w-2 text-indigo-400"
            fill="currentColor"
            viewBox="0 0 8 8"
        >
            <circle cx="4" cy="4" r="3" />
        </svg>
        {{ cuisine.name }}
    </button>
</template>
<script setup>
import axios from 'redaxios';
import { computed, ref } from 'vue';

const props = defineProps({ cuisine: Object, cuisines: Array, route: String, csrf: String })

const updatedToSelect = ref(false)

const isSelected = computed(() => !!props.cuisines.find(cuisine => props.cuisine.id === cuisine.id) || updatedToSelect.value)

const selectedcuisines = computed(() => props.cuisines.filter(({ id }) => id !== props.cuisine.id).map(c => c.id))

function toggle() {
    if (!isSelected.value) {
        selectedcuisines.value.push(props.cuisine.id)
    }

    axios.post(props.route, { _csrf: props.csrf, cuisines: selectedcuisines.value }).then(({ data }) => {
        window.location.reload()
    })
}

</script>
