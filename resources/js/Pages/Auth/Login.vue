<script setup>
import AuthenticationCard from 'JS/components/AuthenticationCard.vue'
import Input from 'JS/components/Form/Input.vue';
import Button from 'JS/components/Form/Button.vue';
</script>
<template>
    <AuthenticationCard>
        <template #logo>
            <img src="/images/logo.svg" />
        </template>

        <div class="flex flex-col items-center justify-center gap-4 max-w-xs mx-auto pt-3">
            <div class="w-full">
                <Input type="text" class="w-full rounded-none" />
            </div>
            <div class="w-full">
                <Input type="password" class="w-full rounded-none" />
            </div>
            <div class="w-full">
                <Button class="w-full">Log In</Button>
            </div>
            <a class="text-sm text-red-600 hover:text-red-500 underline">Forgot Password?</a>
        </div>
    </AuthenticationCard>
</template>
