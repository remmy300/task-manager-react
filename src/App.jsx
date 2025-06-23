import NavBar from "./components/Layout/NavBar";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/Layout/AppSidebar";
import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "../src/components/ui/sidebar";
function App() {
  return (
    <>
      <NavBar />
      <SidebarProvider>
        <SidebarTrigger className="md:hidden w-[44px]" />
        <AppSidebar />
        <Outlet />
      </SidebarProvider>
    </>
  );
}

export default App;
