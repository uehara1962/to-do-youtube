import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TodoTableSelectModel } from "@/db/drizzle/schema";

export default function ListViewTable({
  todo,
}: {
  todo: TodoTableSelectModel;
}) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Completed</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key={todo.id}>
          <TableCell className="font-medium">{todo.title}</TableCell>
          <TableCell>{todo.description}</TableCell>
          <TableCell>
            {todo.completed ? "Completed" : "Not Completed"}
          </TableCell>
          <TableCell className="text-right">
            {todo.createdAt.toISOString()}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
