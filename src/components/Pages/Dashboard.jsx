import { TaskContext } from "@/context/TaskContext";
import React, { useContext, useEffect, useState } from "react";
import TaskCharts from "../Layout/TaskCharts";
import { GetTaskStats } from "@/utils/GetTasks";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const Dashboard = () => {
  const { tasks } = useContext(TaskContext);
  const taskStats = GetTaskStats(tasks);
  const [sortOption, setSortOption] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const urgentTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate <= today;
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "dueSoon":
        return (
          new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity)
        );
      case "dueLatest":
        return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

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
        <motion.h1
          className="text-2xl font-bold"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Task Dashboard
        </motion.h1>

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

      <div className="flex gap-6 m-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="dueSoon">Due Soon</SelectItem>
              <SelectItem value="dueLatest">Due Latest</SelectItem>
              <SelectItem value="az">Title A-Z</SelectItem>
              <SelectItem value="za">Title Z-A</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks match your search.</p>
        ) : (
          sortedTasks.map((task) => (
            <div key={task.id} className="mb-3 p-2 border-b last:border-b-0">
              <div className="flex justify-between">
                <span className="font-medium">{task.title}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    task.status === "completed"
                      ? "bg-yellow-400 "
                      : task.status === "inProgress"
                      ? "bg-pink-400 "
                      : "bg-blue-400 "
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
