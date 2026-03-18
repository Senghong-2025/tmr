<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="modal" class="fixed inset-0 h-[100dvh] w-full z-50 bg-black/60 backdrop-blur-sm" @click="emit('close')" role="dialog"
                aria-modal="true">
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="translate-y-full"
                    enter-to-class="translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="translate-y-0"
                    leave-to-class="translate-y-full">
                    <div v-if="modal" class="absolute bottom-0 left-0 right-0 z-50 mx-auto max-w-lg rounded-t-[2rem] bg-white p-5 shadow-2xl sm:bottom-auto sm:top-1/2 sm:rounded-[2rem] sm:border sm:-translate-y-1/2" @click.stop>
                        <!-- Handle bar -->
                        <div class="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-300 sm:hidden"></div>

                        <!-- Content -->
                        <div class="text-center mb-6">
                            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                                <svg class="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 class="mb-1 text-lg font-semibold text-slate-900">Delete item</h3>
                            <p class="text-sm text-slate-500">Are you sure you want to delete this item? This action cannot be undone.</p>
                        </div>

                        <!-- Buttons -->
                        <div class="space-y-3">
                            <button
                                @click="emit('delete')"
                                :disabled="isLoading"
                                class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50">
                                <svg v-if="isLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{{ isLoading ? 'Deleting...' : 'Delete' }}</span>
                            </button>
                            <button
                                @click="emit('close')"
                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>

const props = defineProps<{
    isShowModal: boolean;
    isLoading: boolean;
}>();

const emit = defineEmits<{
    (e: 'delete'): void;
    (e: 'close'): void;
}>();

const modal = computed({
    get: () => props.isShowModal,
    set: (value) => emit('close')
});

</script>
