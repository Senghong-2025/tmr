<template>
    <div>
        <div class="app-grid">
            <InputField v-model="model.name" type="text" placeholder="Category Name" />
            <InputField v-model="model.type" type="text" placeholder="Category Type" />
            <Button1 v-if="!isEdit" @click="addCategory" class="w-full" :name="isEdit ? 'Update' : 'Save'" :disabled="isLoading"
                    :loading="isLoading" />
            <div v-else class="flex gap-2 items-center w-full">
                <Button1 @click="[isEdit = false, model.name = '', model.type = '']" class="w-full" name="Cancel" type="info" :disabled="isLoading"
                    :loading="isLoading" />
                <Button1 @click="updateCategory" class="w-full" :name="isEdit ? 'Update' : 'Save'" :disabled="isLoading"
                    :loading="isLoading" />
            </div>
        </div>
        <div class="border-b my-2 border-gray-400"></div>
        <div class="app-grid">
            <div v-if="isLoading" v-for="item in 5"
                class="flex justify-between bg-gray-600/20 p-4 rounded-sm animate-pulse h-[52px]">
            </div>
            <div v-else v-for="category in categories"
                class="flex justify-between bg-gray-600/20 p-4 rounded-sm relative">
                <div class="font-semibold">{{ category.name }}</div>
                <div class="text-gray-500">({{ category.type }})</div>
                <button type="button"
                    class="absolute -top-2 flex justify-center items-center right-6 cursor-pointer w-6 h-6 rounded-full border border-gray-400"
                    @click="onClickDelete(category.id || '')">
                    <TrashIcon class="w-4 h-4 text-red-500 hover:text-red-700 transition-colors" />
                </button>
                <button type="button"
                    class="absolute -top-2 flex justify-center items-center -right-2 cursor-pointer w-6 h-6 rounded-full border border-gray-400"
                    @click="onClickEdit(category)">
                    <PencilIcon class="w-4 h-4 text-blue-500 hover:text-blue-700 transition-colors" />
                </button>
            </div>
        </div>
    </div>
    <div v-if="isShowModal" class="fixed bottom-0 rounded-t-xl left-0 right-0 bg-gray-600/60 p-4 grid gap-4">
        <Button1 @click="deleteCategory(id), isShowModal = false" name="Ok" type="danger" :loading="isLoading" />
        <Button1 @click="isShowModal = false" name="No" type="info" />
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import InputField from '~/components/formfields/InputField.vue';
import Button1 from '~/components/buttons/Button1.vue';
import { TrashIcon, PencilIcon } from '@heroicons/vue/24/solid';
import useCategory from '~/composables/useCategory';

const id = ref('');
const isShowModal = ref(false);
const onClickDelete = (categoryId: string) => {
    id.value = categoryId;
    isShowModal.value = true;
};
const { 
    categories, 
    getCategory, 
    isLoading, 
    model, 
    addCategory, 
    deleteCategory, 
    isEdit, 
    onClickEdit, 
    updateCategory 
} = useCategory();

onMounted(() => {
    getCategory();
});
</script>