import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/DatePicker";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TaskContext } from "@/context/TaskContext";

const taskSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    tags: z.array(z.string()).default([]),
    description: z.string().min(5, "Description must be at least 5 characters"),
    priority: z.enum(["low", "medium", "high"]),
    dueDate: z.preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    ),
    startDate: z.preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    ),
    status: z.enum(["pending", "inProgress", "completed"]).default("pending"),
    completedSubtasks: z.number().default(0),
    totalSubtasks: z.number().default(0),
  })
  .refine((data) => data.dueDate > data.startDate, {
    message: "Due date must be after start date",
    path: ["dueDate"],
  });

export default function CreateTask({ onSubmit, initialValues }) {
  const { addTask } = useContext(TaskContext);
  const isEditing = !!initialValues;

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          startDate: new Date(initialValues.startDate),
          dueDate: new Date(initialValues.dueDate),
        }
      : {
          title: "",
          description: "",
          priority: "medium",
          startDate: new Date(),
          dueDate: new Date(Date.now() + 86400000),
          status: "pending",
          completedSubtasks: 0,
          totalSubtasks: 0,
          tags: [],
        },
  });

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      startDate: new Date(data.startDate),
      dueDate: new Date(data.dueDate),
    };

    if (onSubmit) {
      onSubmit({ ...payload, id: initialValues?.id });
    } else {
      addTask(payload);
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8 m-4 bg-white/90 rounded shadow w-full max-w-4xl p-4"
      >
        <h1 className="text-xl font-semibold text-center">
          {isEditing ? "Edit Task" : "Create New Task"}
        </h1>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a task"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task description"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inProgress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={(date) =>
                      new Date(date) < new Date(form.getValues("startDate"))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="totalSubtasks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Subtasks</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="completedSubtasks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completed Subtasks</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    value={field.value?.join(", ") ?? ""}
                    placeholder="e.g., work, urgent"
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      field.onChange(tags);
                    }}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {isEditing ? "Save Changes" : "Create Task"}
        </Button>
      </form>
    </Form>
  );
}
