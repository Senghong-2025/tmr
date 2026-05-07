import * as categoryRepository from "~/server/repositories/categoryRepository";

function validateCategory(payload: { name?: string; type?: string }) {
  const name = payload.name?.trim() || "";
  const type = payload.type?.trim() || "";

  if (!name || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Category name and type are required.",
    });
  }

  return { name, type };
}

export async function listCategories(userId: string) {
  return categoryRepository.listCategories(userId);
}

export async function createCategory(userId: string, payload: { name?: string; type?: string }) {
  return categoryRepository.createCategory({
    userId,
    ...validateCategory(payload),
  });
}

export async function updateCategory(
  id: string,
  userId: string,
  payload: { name?: string; type?: string }
) {
  const category = await categoryRepository.updateCategory(
    id,
    userId,
    validateCategory(payload)
  );

  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: "Category not found.",
    });
  }

  return category;
}

export async function deleteCategory(id: string, userId: string) {
  const deleted = await categoryRepository.deleteCategory(id, userId);

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: "Category not found.",
    });
  }
}
