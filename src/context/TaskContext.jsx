import { createContext, useEffect, useState } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing tasks from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    const completeTask = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedSubtasks: newTask.completedSubtasks || 0,
      totalSubtasks: newTask.totalSubtasks || 0,
      status: newTask.status || "pending",

      "due date": newTask["due date"]?.toISOString?.() || newTask["due date"],
      "start date":
        newTask["start date"]?.toISOString?.() || newTask["start date"],
    };

    setTasks([...tasks, completeTask]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updatedTask,

              "due date":
                updatedTask["due date"]?.toISOString?.() ||
                updatedTask["due date"],
              "start date":
                updatedTask["start date"]?.toISOString?.() ||
                updatedTask["start date"],
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
