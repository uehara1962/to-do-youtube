"use server";

import { db } from "@/db/drizzle";
import {
  todos as todosTable,
  TodoTableInsertModel,
  TodoTableSelectModel,
} from "@/db/drizzle/schema";
import { getSession } from "@/lib/auth-server";
import { eq, asc } from "drizzle-orm";

export async function createTodo(
  todo: TodoTableInsertModel
): Promise<TodoTableSelectModel[]> {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    const newTodo = await db
      .insert(todosTable)
      .values({ ...todo, userId: session.user.id })
      .returning();
    return newTodo;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create todo");
  }
}

export async function getTodoById(id: string): Promise<TodoTableSelectModel[]> {
  try {
    const todo = await db
      .select()
      .from(todosTable)
      .where(eq(todosTable.id, id));
    return todo;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get todo by id");
  }
}

export async function updateTodo(
  id: string,
  todo: TodoTableInsertModel
): Promise<TodoTableSelectModel[]> {
  try {
    const updatedTodo = await db
      .update(todosTable)
      .set(todo)
      .where(eq(todosTable.id, id))
      .returning();
    return updatedTodo;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update todo");
  }
}

export async function deleteTodo(id: string): Promise<TodoTableSelectModel[]> {
  try {
    const deletedTodo = await db
      .delete(todosTable)
      .where(eq(todosTable.id, id))
      .returning();
    return deletedTodo;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete todo");
  }
}

export async function getAllTodos(): Promise<TodoTableSelectModel[]> {

  const session = await getSession();
  console.log("session", session);
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    const todos: TodoTableSelectModel[] = (await db
      .select()
      .from(todosTable)
      .where(eq(todosTable.userId, session.user.id))
      .orderBy(asc(todosTable.createdAt))) as TodoTableSelectModel[];
    return todos;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get all todos");
  }
}
