<script setup>
defineProps({ name: { type: String, default: 'success' }, message: { type: String, default: '' }, icon: { type: String, default: null } })
</script>
<template>
    <div
        :class="{
            'border-l-4 p-4': true,
            'bg-yellow-50 border-yellow-400': name === 'warning',
            'bg-green-50 border-green-400': name === 'success',
        }"
    >
        <div class="flex">
            <div class="flex-shrink-0">
                <slot name="icon" v-if="icon || $slots.icon">
                    <Icon
                        :name="icon"
                        :class="{
                            'h-5 w-5': true,
                            'text-yellow-400': name === 'warning',
                            'text-green-400': name === 'success',
                        }"
                    />
                </slot>
            </div>
            <div :class="icon ? 'ml-3' : ''">
                <p
                    :class="{
                        'text-sm': true,
                        'text-yellow-700': name === 'warning',
                        'text-green-700': name === 'success',
                    }"
                >
                    <slot v-if="$slots.message" name="message"></slot>
                    <slot v-else>{{ message }}</slot>
                </p>
            </div>
        </div>
    </div>
</template>
