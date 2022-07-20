<script setup lang="ts">
import { useForm, Link } from '@inertiajs/inertia-vue3';
import Input from 'VueApp/Components/Form/Input.vue';
import Button from 'VueApp/components/Form/Button.vue';
import AuthenticationCard from 'VueApp/components/AuthenticationCard.vue'

const form = useForm(<{ email: string, password: string }>{ email: '', password: '' })

function handler () {
    form.clearErrors()
    form.post('/forgot-password')
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
                    <Input v-model="form.email" type="email" placeholder="Email Address" class="w-full rounded-none" :class="{ 'border-red-600 text-red-600': form.errors.email }" />
                    <p v-if="form.errors.email" class="text-red-600 text-xs pl-1 mt-1">{{ form.errors.email }}</p>
                </div>
                <div class="w-full">
                    <Button class="w-full">{{ form.processing ? 'Processing...' : 'Email Password Reset Link' }}</Button>
                </div>

                <div class="my-4 w-full">

                    <div class="relative">


                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-slate-300"></div>
                        </div>


                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-slate-500">
                                Or
                            </span>
                        </div>
                    </div>


                    <div class="mt-4 text-center">

                        <Link href="/login" class="text-sm text-red-600 hover:text-red-500 underline">Login to your account</Link>

                    </div>

                </div>
            </div>
        </form>
    </AuthenticationCard>
</template>
