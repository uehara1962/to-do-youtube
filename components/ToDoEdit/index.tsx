import { Dialog } from "../ui/dialog";
import { DialogTrigger } from "../ui/dialog";
import { PencilIcon, TrashIcon } from "lucide-react";
import { DialogContent } from "../ui/dialog";
import { DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { deleteTodoAction } from "@/actions/todo/delete-todo-action";
import { editTodoAction } from "@/actions/todo/edit-todo-action";
import { TodoTableSelectModel } from "@/db/drizzle/schema";

export default function ToDoEdit({ todo }: { todo: TodoTableSelectModel }) {
  return (
    <div>
        <div className="flex gap-4 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <PencilIcon className="size-4 text-blue-300 hover:text-blue-600 transition" />
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Edit List</DialogTitle>
              <div className="flex flex-col gap-4">
                <form action={editTodoAction}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        type="hidden"
                        id="id"
                        name="id"
                        defaultValue={todo.id}
                      />
                      <Input
                        id="title"
                        name="title"
                        defaultValue={todo.title ?? ""}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 mt-6">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={todo.description ?? ""}
                    />
                  </div>

                  <Button type="submit" className="mt-6">
                    Update
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
          <form action={deleteTodoAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input type="hidden" id="id" name="id" defaultValue={todo.id} />
                <Button type="submit" className="mt-0">
                  <TrashIcon className="size-4 text-red-500 hover:text-red-600 transition" />
                </Button>
              </div>
            </div>
          </form>
        </div>
    </div>
  );
}