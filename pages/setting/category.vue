<template>
    <div class="space-y-6">
        <!-- Add/Edit Form -->
        <div class="space-y-3">
            <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ isEdit ? 'Edit Category' : 'Add New Category' }}
            </h2>
            <div class="p-4 bg-gray-700/20 rounded-xl space-y-3">
                <InputField v-model="model.name" type="text" placeholder="Category Name" />
                <InputField v-model="model.type" type="text" placeholder="Category Type (e.g., Expense, Income)" />
                <div class="pt-2">
                    <button
                        v-if="!isEdit"
                        @click="addCategory"
                        :disabled="isLoading('add')"
                        class="w-full py-3 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium transition-all duration-200 disabled:opacity-50 active:scale-[0.98]">
                        {{ isLoading('add') ? 'Saving...' : 'Add Category' }}
                    </button>
                    <div v-else class="flex gap-2">
                        <button
                            @click="() => { isEdit = false; model.name = ''; model.type = ''; }"
                            class="flex-1 py-3 px-4 bg-gray-600/30 hover:bg-gray-600/40 border border-gray-500/30 rounded-xl text-gray-300 font-medium transition-all duration-200 active:scale-[0.98]">
                            Cancel
                        </button>
                        <button
                            @click="updateCategory"
                            :disabled="isLoading('update')"
                            class="flex-1 py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-all duration-200 disabled:opacity-50 active:scale-[0.98]">
                            {{ isLoading('update') ? 'Updating...' : 'Update' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category List -->
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">Your Categories</h2>
                <span class="text-xs text-gray-500">{{ categories.length }} categories</span>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading('get')" class="space-y-2">
                <div v-for="item in 5" :key="item" class="flex items-center justify-between p-4 bg-gray-700/20 rounded-xl animate-pulse">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-600/50 rounded-xl"></div>
                        <div class="space-y-1">
                            <div class="h-4 bg-gray-600/50 rounded-full w-24"></div>
                            <div class="h-3 bg-gray-600/50 rounded-full w-16"></div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="w-8 h-8 bg-gray-600/50 rounded-lg"></div>
                        <div class="w-8 h-8 bg-gray-600/50 rounded-lg"></div>
                    </div>
                </div>
            </div>

            <!-- Category Items -->
            <div v-else class="space-y-2">
                <div
                    v-for="category in categories"
                    :key="category.id"
                    class="flex items-center justify-between p-4 bg-gray-700/20 rounded-xl hover:bg-gray-700/30 transition-colors group">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <span class="text-sm font-bold text-emerald-400">
                                {{ category.name?.charAt(0)?.toUpperCase() || 'C' }}
                            </span>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-100">{{ category.name }}</p>
                            <p class="text-xs text-gray-500">{{ category.type }}</p>
                        </div>
                    </div>
                    <div class="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                            @click="onClickEdit(category)"
                            class="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                            <PencilIcon class="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                            @click="onClickDelete(category.id || '')"
                            class="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                            <TrashIcon class="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!isLoading('get') && categories.length === 0" class="text-center py-8">
                <p class="text-gray-500 text-sm">No categories yet. Add your first category above.</p>
            </div>
        </div>
    </div>

    <DeleteModal :is-show-modal="isShowModal" :is-loading="isLoading('delete')" @delete="deleteCategory"
        @close="isShowModal = false" />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import InputField from '~/components/formfields/InputField.vue';
import { TrashIcon, PencilIcon } from '@heroicons/vue/24/solid';
import useCategory from '~/composables/useCategory';
import DeleteModal from '~/components/Modals/DeleteModal.vue';

const {
    categories,
    getCategory,
    isLoading,
    model,
    addCategory,
    deleteCategory,
    isEdit,
    onClickEdit,
    updateCategory,
    isShowModal,
    onClickDelete,
} = useCategory();

onMounted(() => {
    getCategory();
});
</script>
