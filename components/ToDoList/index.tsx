// "use cache";

import { TodoTableSelectModel } from "@/db/drizzle/schema";
import { getAllTodos } from "@/server/todo";
import ListView from "../ListView";

export default async function ToDoList() {

  const todos: TodoTableSelectModel[] = await getAllTodos();
  console.log(todos);

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center pt-4">
    {todos.length > 0 ? (
      todos.map((todo) => (
        <ListView key={todo.id} todo={todo} />
      ))
    ) : (
      <p>No todos found</p>
    )}
  </div>
  );
}