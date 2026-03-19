<template>
    <div class="page-shell">
        <BodyHeader title="Create transaction" route="/transaction" button-name="Back" :is-button="true" class="mb-6" />
        <div class="flex justify-center w-full">
            <form class="surface-card w-full max-w-4xl p-5 md:px-8" @submit.prevent="addTranscation">
                <div class="mb-5">
                    <p class="section-title mb-2">New entry</p>
                    <p class="text-sm text-slate-500">Keep each transaction clear and complete so it is easier to review later.</p>
                </div>
                <div class="mb-5 grid gap-3.5 md:grid-cols-2">
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
                <Button1 :loading="isLoading('add')" name="Create transaction" native-type="submit" />
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
