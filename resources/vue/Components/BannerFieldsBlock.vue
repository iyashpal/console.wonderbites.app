<template>
    <div class="border rounded-md p-3 relative">
        <span
            class="inline-block absolute top-[-10.5px] left-2 font-medium text-sm text-gray-700 bg-white rounded-lg px-1 py-0.5"
        >
            Banner Data
            <sup class="text-red-500">*</sup>
        </span>

        <div class="divide-y space-y-3 mt-4">
            <div class="flex items-center space-x-3" v-for="(field, index) in fields" :key="index">
                <div class="flex-auto">
                    <InputLabel :value="[field.title, 'key'].join(' ')" />
                    <InputField type="text" class="w-full" v-model="field.key" />
                </div>
                <div class="flex-auto">
                    <InputLabel :value="[field.title, 'value'].join(' ')" />
                    <InputField type="text" class="w-full" v-model="field.value" />
                </div>
                <div class="flex-none">
                    <InputLabel value="&nbsp;" />
                    <button
                        @click="removeField(index)"
                        type="button"
                        class="p-2 border rounded-lg bg-red-100 text-red-500 border-red-300 hover:bg-red-50 hover:text-red-400"
                    >
                        <Icon name="delete" solid class="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div v-if="fields.length === 0">
                <Alert name="warning">Fields not found.</Alert>
            </div>
            <div class="flex items-center space-x-3 mt-3 border-t p-3 bg-gray-100 rounded-md">
                <div class="flex-1">
                    <InputField
                        type="text"
                        v-model="newField.title"
                        placeholder="Field Title"
                        class="w-full"
                    />
                </div>
                <div class="flex-1">
                    <InputField
                        type="text"
                        v-model="newField.key"
                        placeholder="Field Key"
                        class="w-full"
                    />
                </div>
                <div class="flex-1">
                    <select
                        v-model="newField.type"
                        class="block w-full pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                        <option value>Field Type</option>
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="file">File</option>
                    </select>
                </div>
                <div class="flex-none">
                    <button
                        type="button"
                        @click="addField"
                        class="p-2 border rounded-lg bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-400"
                    >
                        <Icon name="add-circle" solid class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import Alert from './Alert.vue'
import InputLabel from './Form/Label.vue'
import InputField from './Form/Input.vue'

const fields = ref([])

const newField = ref(fieldSchema())

function addField () {
    fields.value.push(JSON.parse(JSON.stringify(newField.value)))

    newField.value = fieldSchema()
}

function fieldSchema () {
    return { type: 'text', key: '', title: '', value: "" };
}

function removeField (index) {
    fields.value = fields.value.filter((a, i) => i !== index)
}
</script>
