<template>
    <div v-if="modal" class="fixed inset-0 w-full h-[100dvh] z-10 bg-black/10" @click="$emit('close')" role="dialog"
        aria-modal="true">
        <div class="absolute bottom-0 left-0 right-0 z-20 bg-gray-600/60 p-4 grid gap-4 rounded-t-xl" @click.stop
            @touchstart.stop aria-labelledby="dialog-title">
            <Button1 @click="handleDelete" name="OK" type="danger" :loading="isLoading" />
            <Button1 @click="$emit('close')" name="Cancel" type="info" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { stop } from 'vue';
import Button1 from '~/components/buttons/Button1.vue';

const props = defineProps<{
    isShowModal: boolean;
    isLoading: boolean;
}>();

const emit = defineEmits<{
    (e: 'delete'): void;
    (e: 'close'): void;
}>();

const handleDelete = () => {
    emit('delete');
    emit('close');
};

const modal = computed({
    get: () => props.isShowModal,
    set: (value) => emit('close')
});

</script>
