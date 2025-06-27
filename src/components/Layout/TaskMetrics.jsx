import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";

const TaskMetrics = () => {
  const { tasks } = useContext(TaskContext);

  //  Total Subtask Progress
  const totalCompleted = tasks.reduce(
    (sum, task) => sum + (task.completedSubtasks || 0),
    0
  );
  const totalSubtasks = tasks.reduce(
    (sum, task) => sum + (task.totalSubtasks || 0),
    0
  );

  //  Average Completion Rate per Task
  const avgCompletion =
    tasks.length > 0 ? ((totalCompleted / totalSubtasks) * 100).toFixed(1) : 0;

  //  Progress by Status (Pending/In Progress/Completed)
  const statusProgress = {
    pending: { completed: 0, total: 0 },
    inProgress: { completed: 0, total: 0 },
    completed: { completed: 0, total: 0 },
  };

  //  Progress by Priority(Low/Medium/High)
  const priorityProgress = {
    low: { completed: 0, total: 0 },
    medium: { completed: 0, total: 0 },
    high: { completed: 0, total: 0 },
  };

  tasks.forEach((task) => {
    const status = task.status || "pending";
    const priority = task.priority || "medium";

    statusProgress[status].completed += task.completedSubtasks || 0;
    statusProgress[status].total += task.totalSubtasks || 0;
    priorityProgress[priority].completed += task.completedSubtasks || 0;
    priorityProgress[priority].total += task.totalSubtasks || 0;
  });

  //  Upcoming Deadlines (tasks due in next 3 days)
  const upcomingDeadlines = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return (
      dueDate > today && dueDate <= new Date(today.setDate(today.getDate() + 3))
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Global Progress */}
      <div className="bg-white/90 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-2">Total Progress</h3>
        <p className="text-gray-700 mb-1">
          {totalCompleted} / {totalSubtasks} subtasks
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: `${
                totalSubtasks > 0 ? (totalCompleted / totalSubtasks) * 100 : 0
              }%`,
            }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Avg. completion: <span className="font-medium">{avgCompletion}%</span>
        </p>
      </div>

      {/* Card 2: Status Breakdown */}
      <div className="bg-white/90 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-2">By Status</h3>
        {Object.entries(statusProgress).map(
          ([status, { completed, total }]) => (
            <div key={status} className="mb-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{status}</span>
                <span>
                  {completed}/{total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    status === "pending"
                      ? "bg-purple-500"
                      : status === "inProgress"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>

      {/* Card 3: Priority Analysis */}
      <div className="bg-white/90 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-2">By Priority</h3>
        {Object.entries(priorityProgress).map(
          ([priority, { completed, total }]) => (
            <div key={priority} className="mb-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{priority}</span>
                <span>
                  {completed}/{total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    priority === "low"
                      ? "bg-green-500"
                      : priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>

      {/* Card 4: Upcoming Deadlines */}
      <div className="bg-white/90 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-2">Upcoming</h3>
        {upcomingDeadlines.length > 0 ? (
          upcomingDeadlines.map((task) => (
            <div key={task.id} className="flex justify-between text-sm mb-1">
              <span className="truncate">{task["task-title"]}</span>
              <span className="text-gray-500">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No deadlines in next 3 days</p>
        )}
      </div>
    </div>
  );
};

export default TaskMetrics;
