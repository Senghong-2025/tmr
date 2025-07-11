<template>
    <div v-if="modal" class="fixed bottom-0 rounded-t-xl left-0 right-0 bg-gray-600/60 p-4 grid gap-4">
        <Button1 @click="handleDelete" name="Ok" type="danger" :loading="isLoading" />
        <Button1 @click="modal = false" name="No" type="info" />
    </div>
</template>

<script lang="ts" setup>
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
