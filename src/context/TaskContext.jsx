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

      dueDate: newTask.dueDate?.toISOString?.(),
      startDate: newTask.startDate?.toISOString?.(),
    };

    setTasks([...tasks, completeTask]);
    console.log("📦 Task added to localStorage:", completeTask);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updatedTask,

              dueDate:
                updatedTask["dueDate"]?.toISOString?.() ||
                updatedTask["dueDate"],
              startDate:
                updatedTask["startDate"]?.toISOString?.() ||
                updatedTask["startDate"],
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
