import { TaskContext } from "@/context/TaskContext";
import { GetTaskStats } from "@/utils/GetTasks";
import { useContext } from "react";

const TaskCard = ({ task }) => {
  const taskStats = GetTaskStats(task);
  return (
    <div
      className="bg-white/90 shadow-md rounded-lg border-t-4 p-4 flex flex-col gap-2 w-[350px] h-[200px] relative"
      style={{
        borderColor:
          taskStats.status === "pending"
            ? "#A78BFA"
            : taskStats.status === "inProgress"
            ? "#60A5FA"
            : "#34D399",
      }}
    >
      {/* Badges */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              taskStats.status === "pending"
                ? "bg-purple-100 text-purple-700"
                : taskStats.status === "inProgress"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {task.status}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              task.priority === "high"
                ? "bg-red-100 text-red-700"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {task.priority} Priority
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-lg">{task.title}</h3>

      <p className="text-sm text-gray-600">{task.description}</p>

      <div className="text-sm font-medium text-gray-600">
        Task Done: {task.completedSubtasks} / {task.totalSubtasks}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${
                (task.completedSubtasks / task.totalSubtasks) * 100 || 0
              }%`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 m-3">
        <p>Start: {task.startDate}</p>
        <p>Due: {task.dueDate}</p>
      </div>
    </div>
  );
};

const Tasks = () => {
  const { tasks } = useContext(TaskContext);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">No tasks found.</div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default Tasks;
