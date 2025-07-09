<template>
    <div>
        <div class="app-grid">
            <InputField v-model="model.name" type="text" placeholder="Category Name" />
            <InputField v-model="model.type" type="text" placeholder="Category Type" />
            <Button1 @click="addCategory" class="w-full" title="Add Category" :disabled="isLoading" :loading="isLoading" />
        </div>
        <div class="border-b my-2 border-gray-400"></div>
        <div class="app-grid">
            <div v-if="isLoading" v-for="item in 5" class="flex justify-between bg-gray-600/20 p-4 rounded-sm animate-pulse h-[52px]">
            </div>
            <div v-else v-for="category in categories" class="flex justify-between bg-gray-600/20 p-4 rounded-sm relative">
                <div class="font-semibold">{{ category.name }}</div>
                <div class="text-gray-500">({{ category.type }})</div>
                <button type="button" class="absolute -top-2 -right-2 cursor-pointer" @click="deleteCategory(category.id || '')">delete</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import Button1 from '~/components/buttons/Button1.vue';

const { categories, getCategory, isLoading, model, addCategory, deleteCategory } = useCategory();

onMounted(() => {
    getCategory();
});
</script>