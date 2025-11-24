"use server";

import { deleteTodo } from "@/server/todo";
import { revalidatePath, revalidateTag } from "next/cache";


export async function deleteTodoAction(formData: FormData): Promise<void> {
  const id = formData.get("id");

  try {
    const result = await deleteTodo(id as string);
    console.log(result);

    revalidatePath("/");
    revalidateTag("todos", "max");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete todo");
  }
}