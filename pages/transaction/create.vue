<template>
    <div class="p-6 shadow-2xl m-2">
        <span class="text-[18px] font-medium">Create Transaction</span>
        <form>
            <div class="grid gap-2 mb-2">
                <div v-for="field in formFields" :key="field.model">
                    <InputField v-model="model[field.model]" :label="field.label" :placeholder="field.placeholder" />
                </div>
            </div>
            <Button1 type="button" @click="addTranscation" />
        </form>
    </div>
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import Button1 from '~/components/buttons/Button1.vue';

const { getCurrency } = useCurrency();
const {
    formFields,
    model,
    addTranscation,
} = useTransaction();

onMounted(() => {
    getCurrency();
})
</script>
