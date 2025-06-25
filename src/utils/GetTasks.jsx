import { TaskContext } from "@/context/TaskContext";
import { useContext } from "react";

export const GetTaskStats = () => {
  const { tasks } = useContext(TaskContext);
  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    inProgress: tasks.filter((task) => task.status === "inProgress").length,
    pending: tasks.filter((task) => task.status === "pending").length,
    dueDate: tasks.filter(
      (task) =>
        task.overdue &&
        new Date(task.overdue) < new Date() &&
        task.status !== "completed"
    ),
  };
};
