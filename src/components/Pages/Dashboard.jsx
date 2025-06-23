import { TaskContext } from "@/context/TaskContext";
import React from "react";
import { useContext } from "react";
import TaskCharts from "../Layout/TaskCharts";

const Dashboard = () => {
  const { tasks } = useContext(TaskContext);
  console.log(tasks);

  const taskStats = {
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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">No tasks yet</h2>
        <p className="text-gray-600 mb-4">
          Get started by adding your first task
        </p>
        <button className="btn-primary">Add Task</button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="w-full h-24 shadow rounded bg-white/95">
        <p>{new Date().toString()}</p>
        <div className="flex text-lg gap-3 items-center">
          <p>{taskStats.total}All</p>
          <p>{taskStats.inProgress}In Progress</p>
          <p>{taskStats.completed} Completed</p>
          <p>{taskStats.pending} Pending</p>
        </div>
        <div className="flex gap-3">
          <TaskCharts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
