export function validateRequiredFields<T extends Record<string, any>>(
  model: T,
  requiredFields: (keyof T)[]
): void {
  for (const field of requiredFields) {
    const value = model[field];

    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      throw new Error(`Please enter ${String(field)} is required.`);
    }
  }
}
