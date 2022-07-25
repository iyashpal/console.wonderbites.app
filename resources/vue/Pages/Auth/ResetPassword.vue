<script setup lang="ts">
import { useForm } from '@inertiajs/inertia-vue3';
import Input from 'VueApp/Components/Form/Input.vue';
import Button from 'VueApp/components/Form/Button.vue';
import AuthenticationCard from 'VueApp/components/AuthenticationCard.vue'

const props = defineProps({ email: String, token: String })

const form = useForm(<{ token: string, email: string, password: string, password_confirmation: string }>{
    token: props.token, email: props.email, password: '', password_confirmation: ''
})

function handler () {
    form.clearErrors()
    form.post('/reset-password')
}
</script>
<template>
    <AuthenticationCard>
        <template #logo>
            <img src="/images/logo.svg" />
        </template>

        <form @submit.prevent="handler" method="post">
            <div class="flex flex-col items-center justify-center gap-4 max-w-xs mx-auto pt-3">
                <div class="w-full">
                    <Input readonly type="text" placeholder="Email Address" class="w-full rounded-none disabled:bg-gray-50 disabled:text-gray-400 disabled:select-none" :value="email" disabled />
                </div>
                <div class="w-full">
                    <Input v-model="form.password" autocomplete="off" type="password" placeholder="New Password" class="w-full rounded-none" :class="{ 'border-red-600 text-red-600': form.errors.password }" />
                    <p v-if="form.errors.password" class="text-red-600 text-xs pl-1 mt-1">{{ form.errors.password }}</p>
                </div>
                <div class="w-full">
                    <Input v-model="form.password_confirmation" type="password" autocomplete="off" placeholder="Confirm Password" class="w-full rounded-none" :class="{ 'border-red-600 text-red-600': form.errors.password_confirmation }" />
                    <p v-if="form.errors.password_confirmation" class="text-red-600 text-xs pl-1 mt-1">{{ form.errors.password_confirmation }}</p>
                </div>
                <div class="w-full">
                    <Button class="w-full">{{ form.processing ? 'Processing...' : 'Reset Password' }}</Button>
                </div>
            </div>
        </form>
    </AuthenticationCard>
</template>
