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
} from "firebase/firestore";
import { db } from "../auth/firebase";
import { useAuth } from "../auth/AuthContext"; // import your auth context

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
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
      dueDate: task.dueDate?.toISOString?.() || null,
      startDate: task.startDate?.toISOString?.() || null,
    };

    await addDoc(collection(db, "users", user.uid, "tasks"), newTask);
  };

  const updateTask = async (id, updatedTask) => {
    if (!user?.uid) return;

    const taskRef = doc(db, "users", user.uid, "tasks", id);

    await updateDoc(taskRef, {
      ...updatedTask,
      dueDate:
        updatedTask["dueDate"]?.toISOString?.() ||
        updatedTask["dueDate"] ||
        null,
      startDate:
        updatedTask["startDate"]?.toISOString?.() ||
        updatedTask["startDate"] ||
        null,
    });
  };

  const deleteTask = async (id) => {
    if (!user?.uid) return;

    const taskRef = doc(db, "users", user.uid, "tasks", id);
    await deleteDoc(taskRef);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
