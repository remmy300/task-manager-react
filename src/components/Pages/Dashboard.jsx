import { TaskContext } from "@/context/TaskContext";
import React from "react";
import { useContext } from "react";
import TaskCharts from "../Layout/TaskCharts";
import { GetTaskStats } from "@/utils/GetTasks";

const Dashboard = () => {
  const { tasks } = useContext(TaskContext);
  const taskStats = GetTaskStats(tasks);
  console.log(tasks);

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
    <div className="p-2 w-full ">
      <div className="h-24 shadow rounded bg-white/95 ">
        <p>
          {new Date().toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="flex text-lg gap-3 items-center justify-around">
          <p className="bg-blue-600 px-4 text-sm flex items-center gap-2">
            <span>All</span>
            <span>{taskStats.total}</span>
          </p>
          <p className="bg-amber-300 px-3 text-sm flex items-center gap-2">
            <span>In Progress</span>
            <span>{taskStats.inProgress}</span>
          </p>
          <p className="bg-blue-400 px-3 text-sm flex items-center gap-2">
            <span>Completed</span>
            <span>{taskStats.completed}</span>
          </p>
          <p className="bg-pink-500 text-sm px-3 flex items-center gap-2">
            <span>Pending</span>
            <span>{taskStats.pending}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-4 ">
        <TaskCharts />
      </div>
    </div>
  );
};

export default Dashboard;
