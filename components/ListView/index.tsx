"use client";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { PencilIcon, TrashIcon } from "lucide-react";
import { TodoTableSelectModel } from "@/db/drizzle/schema";
import { deleteTodoAction } from "@/actions/todo/delete-todo-action";
import { editTodoAction } from "@/actions/todo/edit-todo-action";

export default function ListView({ todo }: { todo: TodoTableSelectModel }) {
  return (
    <Card className="w-1/2">
      <CardContent className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">{todo.title}</h1>

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
                      <Input type="hidden" id="userId" name="userId" defaultValue={todo.userId} />
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
                  <TrashIcon className="size-4 text-red-300 hover:text-red-600 transition" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
