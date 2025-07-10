<template>
    <div class="p-4">
        <BodyHeader title="Transaction" route="/transaction" buttonName="Back" :is-button="true" class="mb-2" />
        <div class="flex justify-center w-full">
            <form class="md:w-[1000px] p-4 w-full bg-gray-600/20 shadow-xl shadow-gray-800 md:px-10 rounded-sm">
                <div class="grid gap-2 mb-2">
                    <div v-for="field in formFields" :key="field.model">
                        <SelectField required v-if="field.model === 'currency'" v-model="model[field.model]"
                            :label="field.label" :options="currencies.map(v => ({ label: v.code, value: v.code }))" />
                        <SelectField required v-else-if="field.model === 'type'" v-model="model[field.model]"
                            :label="field.label"
                            :options="[{ label: 'Income', value: 'Income' }, { label: 'Outcome', value: 'Outcome' }]" />
                        <SelectField required v-else-if="field.model === 'category'" v-model="model[field.model]"
                            :label="field.label" :options="categories.map(v => ({ label: v.name, value: v.name }))" />
                        <InputField :required="field.model !== 'note'" v-else v-model="model[field.model]"
                            :label="field.label" :type="field.type ?? 'text'" :placeholder="field.placeholder"
                            :mode="field.mode" />
                    </div>
                </div>
                <Button1 type="primary" @click="addTranscation" :loading="isLoading" />
            </form>
        </div>
    </div>
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import Button1 from '~/components/buttons/Button1.vue';
import BodyHeader from '~/components/BodyHeader.vue';
import SelectField from '~/components/formfields/SelectField.vue';

const { getCurrency, currencies } = useCurrency();
const {
    formFields,
    model,
    addTranscation,
    categories,
    getCategory,
    isLoading
} = useTransaction();

onBeforeMount(async () => {
    await getCurrency();
    await getCategory();
    model.currency = currencies.value[0]?.code || '';
    model.category = categories.value[0]?.name || '';
})
</script>
