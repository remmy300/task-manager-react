import { SidebarTrigger } from "../ui/sidebar";
import { useAuth } from "@/auth/AuthContext";
import { motion } from "framer-motion";

const NavBar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white/95 shadow sticky top-0 w-full z-40 px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <h1 className="text-2xl">Task Manager</h1>

      {user && (
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mt-2 md:mt-0">
          <motion.h2
            className="text-lg md:text-xl font-bold text-center md:text-left"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-blue-400">Welcome</span> {user.email}!
          </motion.h2>

          <motion.div
            className="flex items-center gap-2 justify-center md:justify-start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {user.photoURL ? (
              <motion.img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {(user.displayName
                ? user.displayName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                : user.email?.[0]
              )?.toUpperCase()}
            </span>
          </motion.div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
