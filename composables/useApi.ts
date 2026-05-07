export function getAuthHeaders() {
  if (!import.meta.client) return {} as Record<string, string>;

  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : ({} as Record<string, string>);
}

export function getApiErrorMessage(error: any, fallback: string) {
  return (
    error?.data?.statusMessage ||
    error?.statusMessage ||
    error?.message ||
    fallback
  );
}
