"use client";
import { Plus, X } from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "~/components/ui/checkbox";

// TODO: Move task position

let updateTimeout: NodeJS.Timeout | null = null;
export function Tasks({ userId }: { userId: string }) {
  // Create
  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      console.log("Task created");
      toast.success("Task created");
      await tasksQuery.refetch();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error creating task. Check console for details.");
    },
  });

  // Read
  const tasksQuery = api.task.getAll.useQuery({ userId: userId });

  // Update
  const updateTaskMutationOptions = {
    onSuccess: async () => {
      console.log("Task updated");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Error updating task. Check console for details.");
    },
  };

  const updateCompletion = api.task.updateCompletion.useMutation(
    updateTaskMutationOptions,
  );
  const updateContent = api.task.updateContent.useMutation(
    updateTaskMutationOptions,
  );
  // const updatePosition = api.task.updatePosition.useMutation(
  //   updateTaskMutationOptions,
  // );

  // Delete
  const deleteTask = api.task.delete.useMutation({
    onSuccess: async () => {
      toast.success("Task deleted");
      await tasksQuery.refetch();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error deleting task. Check console for details.");
    },
  });

  return (
    <>
      <h2 className="mb-1 w-full max-w-full text-center text-3xl font-semibold tracking-tight xl:max-w-96">
        Tasks
      </h2>
      <div className="custom-scrollbar flex w-full max-w-full flex-col justify-end gap-2 overflow-y-auto px-3 xl:max-w-96">
        {tasksQuery.data?.map((task) => (
          <div
            key={task.id}
            className="flex w-full flex-row items-center gap-2"
          >
            <div className="relative w-full">
              <div className="flex items-center">
                <Checkbox
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform"
                  aria-label="Mark task as complete"
                  defaultChecked={task.completed ?? false}
                  onCheckedChange={(checked) => {
                    updateCompletion.mutate({
                      id: task.id,
                      userId: userId,
                      completed: checked as boolean,
                    });
                  }}
                />
                <Input
                  className="pl-8 pr-10"
                  type="text"
                  placeholder="Do X"
                  defaultValue={task.content ?? ""}
                  onChange={(e) => {
                    if (updateTimeout) clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(() => {
                      updateContent.mutate({
                        id: task.id,
                        userId: userId,
                        content: e.target.value,
                      });
                      updateTimeout = null;
                    }, 200);
                  }}
                />
                <Button
                  className="absolute right-0 top-0 h-full"
                  aria-label="Delete"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    deleteTask.mutate({ id: task.id, userId: userId });
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            createTask.mutate({ userId: userId });
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="ms-1">Add Task</span>
        </Button>
      </div>
    </>
  );
}
