<template>
    <span @click="enableMedia = !enableMedia">
        <slot />
    </span>
    <v-dialog-modal :show="enableMedia" @close="enableMedia = false">
        <template #title>
            <h2>Upload Media</h2>
        </template>

        <template #content>
            <div class="flex items-center">
                <img src alt />
            </div>
            <div
                class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
                <div class="space-y-1 text-center">
                    <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                        <label
                            for="file-upload"
                            class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                            <span>Upload a file</span>
                            <input
                                id="file-upload"
                                @change="onChange"
                                name="file-upload"
                                type="file"
                                class="sr-only"
                                multiple
                            />
                        </label>
                        <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
        </template>

        <template #footer>
            <button class="tw:btn tw:btn-primary">Save</button>
        </template>
    </v-dialog-modal>
</template>
<script setup>
import axios from 'redaxios'
import { reactive, ref, render } from 'vue';
import Input from './Form/Input.vue'
import Label from './Form/Label.vue'

const props = defineProps({ objectType: String, objectId: String })

const enableMedia = ref(false)


const mediaForm = reactive({
    title: '',
    objectId: props.objectId,
    objectType: props.objectType,
    caption: "",
    file: null
})


function renderImages(images) {

}


function onChange(event) {

    renderImages(event.target.files)

    console.log(event.target.files.length)

    let files = new FormData()

    files.append('_csrf', csrf)
    files.append('objectId', props.objectId)
    files.append('objectType', props.objectType)


    for (let i in event.target.files) {
        files.append(`files[]`, event.target.files[i])
    }


    axios.post('/products/5/media', files).then(({ data }) => {
        window.location.reload()
    })

}

</script>
