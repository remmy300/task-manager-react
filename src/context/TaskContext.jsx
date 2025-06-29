import { createContext, useEffect, useState, useContext } from "react";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../auth/firebase";
import { useAuth } from "../auth/AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user?.uid) {
      console.log("No user UID found yet.");
      return;
    }

    console.log("Setting up Firestore listener for UID:", user.uid);

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate?.toDate?.() ?? null,
          startDate: data.startDate?.toDate?.() ?? null,
        };
      });

      setTasks(fetchedTasks);
      console.log(
        "Tasks from Firestore:",
        fetchedTasks.map((t) => t.id)
      );
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (task) => {
    if (!user?.uid) return;

    const newTask = {
      ...task,
      createdAt: serverTimestamp(),
      completedSubtasks: task.completedSubtasks || 0,
      totalSubtasks: task.totalSubtasks || 0,
      status: task.status || "pending",
      dueDate: task.dueDate || null,
      startDate: task.startDate || null,
    };

    await addDoc(collection(db, "users", user.uid, "tasks"), newTask);
  };

  const updateTask = async (id, updatedTask) => {
    if (!user?.uid) return;

    const taskRef = doc(db, "users", user.uid, "tasks", id);
    console.log("Attempting to update task ID:", id);
    console.log(
      "Existing task IDs:",
      tasks.map((t) => t.id)
    );

    await updateDoc(taskRef, {
      ...updatedTask,
      startDate: updatedTask.startDate
        ? Timestamp.fromDate(new Date(updatedTask.startDate))
        : null,
      dueDate: updatedTask.dueDate
        ? Timestamp.fromDate(new Date(updatedTask.dueDate))
        : null,
    });

    console.log("Updated to Firestore:", updatedTask);
  };

  const deleteTask = async (id) => {
    if (!user?.uid) return;
    console.log("Deleting task ID:", id);

    const taskRef = doc(db, "users", user.uid, "tasks", id);
    try {
      await deleteDoc(taskRef);
      console.log("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
