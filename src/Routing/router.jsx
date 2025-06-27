import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../components/Pages/Dashboard";
import Tasks from "../components/Pages/Tasks";
import CreateTask from "../components/Pages/CreateTask";
import ErrorPage from "@/Error/ErrorPage";
import EditTaskPage from "@/components/Pages/EditTask";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "tasks", element: <Tasks /> },
      { path: "create-tasks", element: <CreateTask /> },
      { path: "edit-tasks", element: <EditTaskPage /> },
    ],
  },
]);
