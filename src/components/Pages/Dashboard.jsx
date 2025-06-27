import { TaskContext } from "@/context/TaskContext";
import React, { useContext, useState } from "react";
import TaskCharts from "../Layout/TaskCharts";
import { GetTaskStats } from "@/utils/GetTasks";
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { tasks } = useContext(TaskContext);
  const taskStats = GetTaskStats(tasks);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const urgentTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate <= today;
  });

  const filteredTasks = tasks.filter(
    (task) =>
      task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (tasks.length === 0) {
    return (
      <div className="bg-white/90 min-h-screen flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-xl font-semibold mb-2">No tasks yet</h2>
        <p className="text-gray-600 mb-4">
          Get started by adding your first task
        </p>
        <button
          onClick={() => navigate("/create-tasks")}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={() => navigate("/create-tasks")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <Plus size={24} />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<CheckCircle2 size={20} />}
          title="Completed"
          value={taskStats.completed}
          color="bg-yellow-400"
        />
        <StatCard
          icon={<Clock size={20} />}
          title="In Progress"
          value={taskStats.inProgress}
          color="bg-pink-400"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          title="Pending"
          value={taskStats.pending}
          color="bg-blue-400"
        />
        <StatCard
          icon={<Calendar size={20} />}
          title="Urgent"
          value={urgentTasks.length}
          color="bg-red-100 text-red-800"
        />
      </div>

      <div className="flex justify-between items-center gap-3 mb-6">
        <TaskCharts />
      </div>

      <div className="mb-6">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks match your search.</p>
        ) : (
          filteredTasks.slice(0, 5).map((task) => (
            <div key={task.id} className="mb-3 p-2 border-b last:border-b-0">
              <div className="flex justify-between">
                <span className="font-medium">{task.title}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Due:{" "}
                {task.dueDate && !isNaN(new Date(task.dueDate))
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div
    className={`p-4 rounded-lg shadow-sm flex items-center justify-between ${color}`}
  >
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <span>{icon}</span>
  </div>
);

export default Dashboard;
