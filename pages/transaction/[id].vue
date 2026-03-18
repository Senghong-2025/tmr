<template>
    <div class="page-shell">
        <BodyHeader route="/transaction" title="Update transaction" button-name="Back" is-button class="mb-6" />
        <div class="flex justify-center items-center" :class="{'pointer-events-none opacity-50': isGetting}">
            <form class="surface-card w-full max-w-2xl p-6 md:p-8" @submit.prevent="updateTransaction(id)">
                <div class="mb-6">
                    <p class="section-title mb-2">Transaction details</p>
                    <p class="text-sm text-slate-500">Edit the values below or remove the transaction if it is no longer needed.</p>
                </div>
                <div class="flex flex-col gap-4">
                    <input-field required label="Title" mode="text" v-model="model.title" type="text" />
                    <input-field required label="Amount" mode="decimal" v-model="model.amount" type="text" />
                    <select-field required label="Currency" v-model="model.currency"
                        :options="currencies.map((currency) => ({ label: currency.code, value: currency.code }))" />
                    <input-field required label="Date" v-model="model.date" type="datetime-local" />
                    <select-field required label="Type" v-model="model.type"
                        :options="[{ label: 'Income', value: 'Income' }, { label: 'Outcome', value: 'Outcome' }]" />
                    <select-field required label="Category" v-model="model.category"
                        :options="categories.map((v) => ({ label: v.name, value: v.name }))" />
                    <input-field required label="Note" v-model="model.note" type="text" />
                    <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button1 name="Save changes" :loading="isLoading('update')" native-type="submit" />
                        <Button1 @click="isShowModal = true" name="Delete" :loading="isLoading('delete')" type="danger" native-type="button" />
                    </div>
                </div>
            </form>
        </div>
    </div>
    <ModalsDeleteModal :isShowModal="isShowModal" :isLoading="isLoading('delete')" @delete="handleDelete()" @close="isShowModal = false" />
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import SelectField from '~/components/formfields/SelectField.vue';
import Button1 from '~/components/buttons/Button1.vue';
import type { ITransaction } from '~/models/transaction';

const isShowModal = ref(false);
const route = useRoute();
const { categories, getCategory, updateTransaction, isLoading, model, getTransaction, deleteTransaction, allTransactions, getTransactionById } = useTransaction();
const { currencies, getCurrency } = useCurrency();
const id = route.params.id as string;

const handleDelete = () => {
    isShowModal.value = false;
    deleteTransaction(id);
};

const isGetting = ref(false);
onBeforeMount(async () => {
    isGetting.value = true;
    const [ data ] = await Promise.all([
    getTransactionById(id),
    getCategory(),
    getCurrency(),
    ])
    isGetting.value = false;
    Object.assign(model, data);
});
</script>
