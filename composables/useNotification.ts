import { reactive } from 'vue';

export const notifications = reactive<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }[]>([]);

export function notify(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  notifications.push({ message, type });
  setTimeout(() => notifications.shift(), 3000);
}