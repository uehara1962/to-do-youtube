import { db } from "@/db/drizzle";
import { todos } from "@/db/drizzle/schema";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const allTodos = await db.select().from(todos);
    return NextResponse.json(allTodos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, userId } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newTodo = await db
      .insert(todos)
      .values({
        title,
        description: description || null,
        completed: false,
        userId: userId as string,
      })
      .returning();

    return NextResponse.json(newTodo[0], { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
