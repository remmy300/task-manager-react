import NavBar from "./components/Layout/NavBar";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/Layout/AppSidebar";
import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "../src/components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <NavBar />
      <SidebarProvider>
        <SidebarTrigger className="md:hidden w-[44px]" />
        <AppSidebar />
        <Outlet />
      </SidebarProvider>

      <Toaster />
    </>
  );
}

export default App;
