<script setup lang="ts">
import { useForm, Link } from '@inertiajs/inertia-vue3';
import Input from 'VueApp/Components/Form/Input.vue';
import Button from 'VueApp/components/Form/Button.vue';
import AuthenticationCard from 'VueApp/components/AuthenticationCard.vue'

const form = useForm(<{ email: string, password: string }>{ email: '', password: '' })

function handler () {
    form.clearErrors()
    form.post(`/login`)
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
                    <Input v-model="form.email" type="email" class="w-full rounded-none" :class="{ 'border-red-600 text-red-600': form.errors.email }" />
                    <p v-if="form.errors.email" class="text-red-600 text-xs pl-1 mt-1">{{ form.errors.email }}</p>
                </div>
                <div class="w-full">
                    <Input v-model="form.password" type="password" class="w-full rounded-none" :class="{ 'border-red-600 text-red-600': form.errors.password }" />
                    <p v-if="form.errors.password" class="text-red-600 text-xs pl-1 mt-1">{{ form.errors.password }}</p>
                </div>
                <div class="w-full">
                    <Button class="w-full">{{ form.processing ? 'Processing...' : 'Log In' }}</Button>
                </div>
                <Link href="/forgot-password" class="text-sm text-red-600 hover:text-red-500 underline">Forgot Password?</Link>
            </div>
        </form>
    </AuthenticationCard>
</template>
