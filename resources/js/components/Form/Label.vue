<template>
    <label class="block font-medium text-sm text-gray-700">
        <span v-if="value">{{ value }}</span>
        <span v-else-if="label">{{ label }}</span>
        <span v-else>
            <slot></slot>
        </span>
        <span v-if="required !== undefined" class="text-red-500">*</span>
    </label>
</template>

<script>
export default {
    props: ['value', 'label', 'required']
}
</script>
