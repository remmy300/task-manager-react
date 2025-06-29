import { useContext, useRef } from "react";
import { TaskContext } from "@/context/TaskContext";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { toast } from "@/components/ui/use-toast"; // Update this path if needed

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const { deleteTask } = useContext(TaskContext);

  const {
    status,
    priority,
    description,
    completedSubtasks = task.completedSubtasks ?? 0,
    totalSubtasks = task.totalSubtasks ?? 0,
    title,
    ["dueDate"]: dueDate,
    ["startDate"]: startDate,
  } = task;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleEdit = () => {
    navigate(`/edit-tasks`, { state: { task } });
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast({
        title: "Task Deleted",
        description: `"${task.title}" was removed successfully.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete the task.",
        variant: "destructive",
      });
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
      className="bg-white/90 shadow-md rounded-lg border-t-4 p-4 flex flex-col gap-2 w-[350px] relative"
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
        <div className="flex gap-2">
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
        {task.tags?.map((tag, index) => (
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
        <div onClick={handleEdit}>
          <Pencil size={20} />
        </div>
        <div onClick={handleDelete}>
          <Trash2 size={20} />
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
