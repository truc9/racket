import cx from "clsx";
import FullScreenLoading from "../components/fullscreen-loading";
import Loading from "../components/loading";
import LogoutButton from "../components/logout-button";
import UserProfile from "../components/profile";
import { FC, ReactNode, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { Suspense } from "react";
import { Tooltip } from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";

import {
  IoBarChart,
  IoBasketball,
  IoChevronBackCircle,
  IoHeart,
  IoPersonAdd,
  IoSettings,
  IoStorefront,
} from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import constant from "../common/constant";

interface NavItemProps {
  label?: string;
  path: string;
  icon: ReactNode;
  showLabel?: boolean;
}
const NavItem: FC<NavItemProps> = ({ label, path, icon, showLabel = true }) => {
  return (
    <NavLink
      className="flex items-center gap-2 rounded px-4 py-3 hover:bg-blue-600 [&.active]:bg-blue-600"
      to={path}
    >
      {showLabel ? (
        <span className="text-xl">{icon}</span>
      ) : (
        <Tooltip label={label} position="right-end">
          <span className="text-xl">{icon}</span>
        </Tooltip>
      )}
      {label && showLabel && <span>{label}</span>}
    </NavLink>
  );
};

function Layout() {
  const APP_NAME = "RACKET";
  const [collapsed, setCollapsed] = useState(true);

  const {
    user,
    isAuthenticated,
    isLoading: isLoading,
    getIdTokenClaims,
  } = useAuth0();

  const { data: isAdmin, isLoading: isCheckingRole } = useQuery({
    queryKey: ["getUserRoles"],
    queryFn: async () => {
      const res: any = await getIdTokenClaims();
      const roles = res["https://api.tns.com/roles"] as string[];
      return roles.includes(constant.roles.admin);
    },
  });

  function toggleSideNav() {
    setCollapsed(!collapsed);
  }

  if (isLoading) {
    return <FullScreenLoading text="Authenticating" />;
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace={true} />;
  }

  // Not an admin, redirect to public layout
  if (!isAdmin) {
    return <Navigate to="/public" replace={true} />;
  }

  return (
    <div className="flex h-screen w-screen">
      <div
        className={cx(
          "group relative flex h-full flex-shrink-0 flex-grow-0 flex-col border-r bg-blue-700 text-white transition-all delay-100",
          !collapsed && "w-[300px]",
          collapsed && "w-16",
        )}
      >
        <div className="flex flex-1 flex-col">
          {collapsed ? (
            <div className="p-2 text-center text-2xl font-bold">
              {APP_NAME.substring(0, 1)}
            </div>
          ) : (
            <div className="p-2 text-2xl font-bold">{APP_NAME}</div>
          )}
          <div className={cx("flex flex-col p-2", collapsed && "items-center")}>
            <UserProfile showLabel={!collapsed} />
          </div>
          <div className="flex flex-col p-2">
            <NavItem
              showLabel={!collapsed}
              path="/"
              label="Dashboard"
              icon={<IoBarChart />}
            />
            <NavItem
              showLabel={!collapsed}
              path="/matches"
              label="Matches"
              icon={<IoBasketball />}
            />
            <NavItem
              showLabel={!collapsed}
              path="/players"
              label="Players"
              icon={<IoPersonAdd />}
            />
            <NavItem
              showLabel={!collapsed}
              path="/sportcenters"
              label="Sport Centers"
              icon={<IoStorefront />}
            />
            <NavItem
              showLabel={!collapsed}
              path="/health"
              label="Health"
              icon={<IoHeart />}
            />
            <NavItem
              showLabel={!collapsed}
              path="/settings"
              label="Settings"
              icon={<IoSettings />}
            />
          </div>
          <button
            onClick={toggleSideNav}
            className="absolute -right-2 top-2 hidden rounded-full border border-blue-500 bg-white text-lg text-blue-500 shadow ring-blue-500 group-hover:block"
          >
            <IoChevronBackCircle className={cx(collapsed && "rotate-180")} />
          </button>
        </div>
        <div className="p-2">
          <LogoutButton showLabel={!collapsed} />
        </div>
      </div>
      <div className="flex w-full flex-1 bg-slate-300">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default Layout;
