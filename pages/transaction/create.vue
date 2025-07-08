<template>
    <div class="p-4">
        <BodyHeader title="Transaction" route="/transaction" buttonName="Back" :is-button="true" />
        <div class="flex justify-center ">
            <form class="max-w-sm p-2 min-w-sm">
                <div class="grid gap-2 mb-2">
                    <div v-for="field in formFields" :key="field.model">
                        <SelectField v-if="field.model === 'currency'" v-model="model[field.model]" :label="field.label"
                            :options="currencies.map(v => ({ label: v.code, value: v.code }))" />
                        <SelectField v-else-if="field.model === 'type'" v-model="model[field.model]" :label="field.label"
                            :options="[{ label: 'Income', value: 'Income' }, { label: 'Outcome', value: 'Outcome' }]" />
                        <InputField v-else v-model="model[field.model]" :label="field.label"
                            :type="field.type ?? 'text'" :placeholder="field.placeholder" />
                    </div>
                </div>
                <Button1 type="button" @click="addTranscation" />
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
} = useTransaction();

onBeforeMount( async () => {
    await getCurrency();
    model.currency = currencies.value[0]?.code || '';
})
</script>
