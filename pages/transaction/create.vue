<template>
    <div class="p-4">
        <BodyHeader title="Create Transaction" route="/transaction" buttonName="Back" :is-button="true" class="mb-4" />
        <div class="flex justify-center w-full">
            <form class="md:w-[1000px] w-full bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6 md:px-10 rounded-2xl">
                <div class="grid gap-4 mb-6">
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
                <Button1 @click="addTranscation" :loading="isLoading('add')">
                    <span class="flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Transaction
                    </span>
                </Button1>
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
