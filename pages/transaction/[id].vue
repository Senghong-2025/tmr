<template>
    <div class="p-4">
        <BodyHeader route="/transaction" title="Update Transaction" button-name="Back" is-button class="mb-2" />
        <div class="flex justify-center items-center">
            <div :class="['bg-gray-600/20 w-[400px] md:w-[600px] rounded-lg shadow-sm', { 'bg-blue-200': isLoading }]">
                <div class="p-4">
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
                    <div class="flex justify-end mt-4 gap-2">
                        <Button1 @click="updateTransaction(id)" name="Update" :loading="isLoading" />
                        <Button1 @click="isShowModal = true" name="Delete" :loading="isLoading" type="danger" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ModalsDeleteModal :isShowModal="isShowModal" :isLoading="isLoading" @delete="handleDelete()" @close="isShowModal = false" />
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import SelectField from '~/components/formfields/SelectField.vue';
import Button1 from '~/components/buttons/Button1.vue';
import type { ITransaction } from '~/models/transaction';

const isShowModal = ref(false);
const route = useRoute();
const { categories, getCategory, updateTransaction, isLoading, model, transactions, getTranscation, deleteTransaction, transactionGroups } = useTransaction();
const { currencies, getCurrency } = useCurrency();
const id = route.params.id as string;

const handleDelete = () => {
    isShowModal.value = false;
    deleteTransaction(id);
};

onBeforeMount(async () => {
    await getTranscation();
    const transaction = transactions.value.find((transaction: ITransaction) => transaction.id === id);
    if (transaction) {
        Object.assign(model, transaction);
    }
    await getCategory();
    await getCurrency();
});
</script>