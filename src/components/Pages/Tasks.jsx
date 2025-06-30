import { useContext, useState, useRef } from "react";
import { TaskContext } from "@/context/TaskContext";
import TaskMetrics from "../Layout/TaskMetrics";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { toast } from "sonner";

// Animation Variants
const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const TaskCard = ({ task }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const navigate = useNavigate();
  const { deleteTask } = useContext(TaskContext);

  if (!task) return null;

  const {
    status = "pending",
    priority = "medium",
    description = "",
    completedSubtasks = 0,
    totalSubtasks = 0,
    title = "Untitled Task",
    ["dueDate"]: dueDate,
    ["startDate"]: startDate,
    tags = [],
  } = task;

  const handleEdit = () => {
    navigate(`/edit-tasks`, { state: { task } });
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      exit="exit"
      transition={{ duration: 0.4 }}
      layout
      className="bg-white/90 shadow-md rounded-lg border-t-4 p-4 flex flex-col gap-2 w-full max-w-full sm:max-w-[350px] relative"
      style={{
        borderColor:
          status === "pending"
            ? "#A78BFA"
            : status === "inProgress"
            ? "#60A5FA"
            : "#34D399",
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              status === "pending"
                ? "bg-purple-100 text-purple-700"
                : status === "inProgress"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              priority === "high"
                ? "bg-red-100 text-red-700"
                : priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {priority} Priority
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="text-sm font-medium text-gray-600">
        Task Done: {completedSubtasks} / {totalSubtasks}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                totalSubtasks > 0
                  ? (completedSubtasks / totalSubtasks) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <p>Start: {startDate?.toLocaleDateString?.() ?? "N/A"}</p>
        <p>Due: {dueDate?.toLocaleDateString?.() ?? "N/A"}</p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <button onClick={handleEdit} className="hover:text-blue-500">
          <Pencil size={20} />
        </button>
        <button onClick={handleDelete} className="hover:text-red-500">
          <Trash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const Tasks = () => {
  const { tasks } = useContext(TaskContext);
  const [filter, setFilter] = useState("all");

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const filters = ["all", "pending", "inProgress", "completed"];

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">No tasks found.</div>
    );
  }

  return (
    <div className="p-4 overflow-auto h-full">
      <TaskMetrics />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap gap-2 justify-center md:justify-evenly mb-4"
      >
        <h1 className="text-xl font-semibold w-full text-center md:text-left">
          My Tasks
        </h1>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 text-sm rounded-full border transition ${
              filter === f
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {f === "all" ? "All Tasks" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Tasks;
