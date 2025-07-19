import { ref } from 'vue';

export default function useLoading() {
  const loadingState = ref<Record<string, boolean>>({});

  const setLoading = (key: string, value: boolean) => {
    loadingState.value[key] = value;
  };

  const isLoading = (key: string) => !!loadingState.value[key];

  const resetLoading = () => {
    loadingState.value = {};
  };

  return {
    setLoading,
    isLoading,
    resetLoading,
    loadingState,
  };
}
