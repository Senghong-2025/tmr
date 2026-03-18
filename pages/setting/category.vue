<template>
    <div class="space-y-6">
        <!-- Add/Edit Form -->
        <div class="space-y-3">
            <h2 class="section-title">
                {{ isEdit ? 'Edit Category' : 'Add New Category' }}
            </h2>
            <div class="surface-card-muted p-4 space-y-4">
                <InputField v-model="model.name" type="text" label="Name" placeholder="Category name" />
                <InputField v-model="model.type" type="text" label="Type" placeholder="Expense or income" />
                <div class="pt-2">
                    <button
                        v-if="!isEdit"
                        @click="addCategory"
                        :disabled="isLoading('add')"
                        class="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50">
                        {{ isLoading('add') ? 'Saving...' : 'Add Category' }}
                    </button>
                    <div v-else class="flex gap-2">
                        <button
                            @click="() => { isEdit = false; model.name = ''; model.type = ''; }"
                            class="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
                            Cancel
                        </button>
                        <button
                            @click="updateCategory"
                            :disabled="isLoading('update')"
                            class="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
                            {{ isLoading('update') ? 'Updating...' : 'Update' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category List -->
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <h2 class="section-title">Your Categories</h2>
                <span class="text-xs text-slate-500">{{ categories.length }} categories</span>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading('get')" class="space-y-2">
                <div v-for="item in 5" :key="item" class="surface-card-muted flex items-center justify-between p-4 animate-pulse">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-xl bg-slate-200"></div>
                        <div class="space-y-1">
                            <div class="h-4 w-24 rounded-full bg-slate-200"></div>
                            <div class="h-3 w-16 rounded-full bg-slate-200"></div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="h-8 w-8 rounded-lg bg-slate-200"></div>
                        <div class="h-8 w-8 rounded-lg bg-slate-200"></div>
                    </div>
                </div>
            </div>

            <!-- Category Items -->
            <div v-else class="space-y-2">
                <div
                    v-for="category in categories"
                    :key="category.id"
                    class="surface-card-muted group flex items-center justify-between p-4 transition-colors hover:bg-slate-50">
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <span class="text-sm font-bold text-blue-700">
                                {{ category.name?.charAt(0)?.toUpperCase() || 'C' }}
                            </span>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-slate-900">{{ category.name }}</p>
                            <p class="text-xs text-slate-500">{{ category.type }}</p>
                        </div>
                    </div>
                    <div class="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                            @click="onClickEdit(category)"
                            class="rounded-lg bg-blue-50 p-2 transition-colors hover:bg-blue-100">
                            <PencilIcon class="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                            @click="onClickDelete(category.id || '')"
                            class="rounded-lg bg-red-50 p-2 transition-colors hover:bg-red-100">
                            <TrashIcon class="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!isLoading('get') && categories.length === 0" class="text-center py-8">
                <p class="text-sm text-slate-500">No categories yet. Add your first category above.</p>
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
