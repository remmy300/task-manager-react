import React from "react";
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
import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";

const taskSchema = z.object({
  "task-title": z.string().min(1, "Title is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority is required",
  }),
  "due date": z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  "start date": z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  status: z
    .enum(["pending", "inProgress", "completed"], {
      required_error: "Status is required",
    })
    .default("pending"),
  completedSubtasks: z.number().default(0),
  totalSubtasks: z.number().default(0),
});

export default function CreateTask({ onSubmit, initialValues }) {
  const { addTask } = useContext(TaskContext);
  const isEditing = !!initialValues;

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          "start date": initialValues["start date"]
            ? new Date(initialValues["start date"])
            : undefined,
          "due date": initialValues["due date"]
            ? new Date(initialValues["due date"])
            : undefined,
        }
      : {
          "task-title": "",
          description: "",
          priority: "medium",
          "due date": undefined,
          "start date": undefined,
          status: "pending",
          completedSubtasks: 0,
          totalSubtasks: 0,
        },
  });

  const handleFormSubmit = (data) => {
    const processedData = {
      ...data,
      "due date": data["due date"]?.toISOString?.(),
      "start date": data["start date"]?.toISOString?.(),
    };

    if (onSubmit) {
      onSubmit(processedData);
    } else {
      addTask({ ...processedData, id: crypto.randomUUID() });
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8 m-4 bg-white-90 rounded shadow w-full max-w-4xl p-4"
      >
        <h1 className="text-xl font-semibold text-center">
          {isEditing ? "Edit Task" : "Create New Task"}
        </h1>
        {/* Task Title Field */}
        <FormField
          control={form.control}
          name="task-title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a task" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Priority + Due Date */}
        <div className="flex gap-3 items-center">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
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
            name="start date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="due date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="totalSubtasks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Subtasks</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                    placeholder="e.g., 2"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          {isEditing ? "Save Changes" : "Create Task"}
        </Button>
      </form>
    </Form>
  );
}
