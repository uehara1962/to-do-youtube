"use server";

import { TodoTableInsertModel } from "@/db/drizzle/schema";
import { updateTodo } from "@/server/todo";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";


export async function editTodoAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const title = formData.get("title");
  const description = formData.get("description");
  const userId = formData.get("userId");

console.log("editTodoAction", "id", id, "title", title, "description", description, "userId", userId);

  const updatedTodo: TodoTableInsertModel = {
    id: id as string,
    title: title as string,
    description: description as string,
    userId: userId as string,
  };

  try {
    const result = await updateTodo(id as string, updatedTodo);
    console.log(result);

    revalidatePath("/");
    revalidateTag("todos", "max");

  } catch (error) {
    console.error(error);
    throw new Error("Failed to update todo");
  }
}