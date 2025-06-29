import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";
import CreateTask from "./CreateTask";

export default function EditTaskPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { updateTask } = useContext(TaskContext);

  if (!state?.task) {
    navigate("/tasks", { replace: true });
    return null;
  }

  const handleSubmit = (updatedTask) => {
    console.log("Submitting update for ID:", updatedTask.id);
    updateTask(state.task.id, updatedTask);
    navigate("/tasks");
  };

  return (
    <div className="edit-page">
      <h2>Edit Task</h2>
      <CreateTask onSubmit={handleSubmit} initialValues={state.task} />
    </div>
  );
}
