import { TodoTableSelectModel } from "@/db/drizzle/schema";
import { getAllTodos } from "@/server/todo";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ToDoEdit from "../ToDoEdit";
import { DateFormat } from "../DateFormat";

export default async function ToDoListTable() {
  const todos: TodoTableSelectModel[] = await getAllTodos();
  console.log(todos);

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell className="font-medium">{todo.title}</TableCell>
                <TableCell>{todo.description}</TableCell>
                <TableCell>
                  {todo.completed ? "Completed" : "Not Completed"}
                </TableCell>
                <TableCell className="text-right">
                  <DateFormat date={todo.createdAt} />
                </TableCell>
                <TableCell>
                  <ToDoEdit todo={todo} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No todos found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// This is the old version of the component, it is not used anymore
// "use cache";

// import { TodoTableSelectModel } from "@/db/drizzle/schema";
// import { getAllTodos } from "@/server/todo";
// import ListViewTable from "../ListViewTable";

// export default async function ToDoListTable() {

//   const todos: TodoTableSelectModel[] = await getAllTodos();
//   console.log(todos);

//   return (
//     <div className="w-full flex flex-col gap-4 items-center justify-center">
//     {todos.length > 0 ? (
//       todos.map((todo) => (
//         <ListViewTable key={todo.id} todo={todo} />
//       ))
//     ) : (
//       <p>No todos found</p>
//     )}
//   </div>
//   );
// }
