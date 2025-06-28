import {
  LayoutDashboard,
  BookCheck,
  ClipboardPlus,
  LogOut,
  Pencil,
} from "lucide-react";
import { logout } from "@/auth/Auth";
import { useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { use } from "react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Tasks",
    url: "/tasks",
    icon: BookCheck,
  },
  {
    title: "Create Task",
    url: "/create-tasks",
    icon: ClipboardPlus,
  },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      alert("Logged out Succesfully" + err.message);
    }
  };
  return (
    <Sidebar
      side="left"
      collapsible="icon"
      variant="floating"
      className="top-[64px] h-[calc(100vh-64px)] bg-white/90"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span className="text-lg font-semibold">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Button onClick={handleLogOut}>
                <LogOut />{" "}
                <span className="text-lg font-semibold">Log Out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
