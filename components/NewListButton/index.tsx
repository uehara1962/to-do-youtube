"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { createTodoAction } from "@/actions/todo/create-todo-action";

export default function NewListButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Item</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New List</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <form action={createTodoAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Title" />
              </div>
            </div>

            <div className="grid gap-2 mt-6">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description"
              />
            </div>

            <Button type="submit" className="mt-6">Create</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
