"use server";

import { TodoTableInsertModel } from "@/db/drizzle/schema";
import { verifySession } from "@/lib/dal";
import { createTodo } from "@/server/todo";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export async function createTodoAction(formData: FormData): Promise<void> {
  // Verificar autenticação
  const session = await verifySession();

  const title = formData.get("title");
  const description = formData.get("description");
  const imageUrl = formData.get("imageUrl") as string | null; // URL do Cloudinary

  const newTodo: TodoTableInsertModel = {
    title: title as string,
    description: description as string,
    imageUrl: imageUrl || null,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: session.user.id,
  };
  console.log(newTodo);

  try {
    const result = await createTodo(newTodo);
    console.log(result);

    revalidatePath("/");
    revalidateTag("todos", "max");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create todo");
  }
}

// -------------------------
// "use server";

// import { TodoTableInsertModel } from "@/db/drizzle/schema";
// import { verifySession } from "@/lib/dal";
// import { createTodo } from "@/server/todo";
// import { revalidatePath } from "next/cache";
// import { revalidateTag } from "next/cache";

// export async function createTodoAction(formData: FormData): Promise<void> {
//   // Verificar autenticação
//   const session = await verifySession();

//   const title = formData.get("title");
//   const description = formData.get("description");

//   const newTodo: TodoTableInsertModel = {
//     title: title as string,
//     description: description as string,
//     completed: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     userId: session.user.id,
//   };
//   console.log(newTodo);

//   try {
//     const result = await createTodo(newTodo);
//     console.log(result);

//     revalidatePath("/");
//     revalidateTag("todos", "max");
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to create todo");
//   }
// }

// -------------------------
// "use server";

// import { TodoTableInsertModel } from "@/db/drizzle/schema";
// import { getSession } from "@/lib/auth-server";
// import { createTodo } from "@/server/todo";
// import { revalidatePath } from "next/cache";
// import { revalidateTag } from "next/cache";

// export async function createTodoAction(formData: FormData): Promise<void> {
//   const session = await getSession();
//   if (!session?.user) {
//     throw new Error("User not authenticated");
//   }

//   const title = formData.get("title");
//   const description = formData.get("description");

//   const newTodo: TodoTableInsertModel = {
//     title: title as string,
//     description: description as string,
//     completed: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     userId: session.user.id,
//   };
//   console.log(newTodo);

//   try {
//     const result = await createTodo(newTodo);
//     console.log(result);

//     revalidatePath("/");
//     revalidateTag("todos", "max");
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to create todo");
//   }
// }
