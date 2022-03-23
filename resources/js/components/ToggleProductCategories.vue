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
        {{ category.name }}
    </button>
</template>
<script setup>
import axios from 'redaxios';
import { computed, ref } from 'vue';

const props = defineProps({ category: Object, categories: Array, route: String, csrf: String })

const updatedToSelect = ref(false)

const isSelected = computed(() => !!props.categories.find(category => props.category.id === category.id) || updatedToSelect.value)

const selectedCategories = computed(() => props.categories.filter(({ id }) => id !== props.category.id).map(c => c.id))

function toggle() {
    if (!isSelected.value) {
        selectedCategories.value.push(props.category.id)
    }

    axios.post(props.route, { _csrf: props.csrf, categories: selectedCategories.value }).then(({ data }) => {
        window.location.reload()
    })
}

</script>
