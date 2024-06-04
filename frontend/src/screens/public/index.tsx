import cx from "clsx";
import { FC, ReactNode, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
import FullScreenLoading from "../../components/fullscreen-loading";
import UserProfile from "../../components/profile";
import LogoutButton from "../../components/logout-button";
import Loading from "../../components/loading";

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

function Public() {
  const APP_NAME = "RACKET";
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading: isCheckingUser } = useAuth0();

  function toggleSideNav() {
    setCollapsed(!collapsed);
  }

  if (isCheckingUser) {
    return <FullScreenLoading />;
  }

  if (!isAuthenticated && !user) {
    navigate("/login", { replace: true });
    return <div></div>;
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
              path="/public"
              label="Attendant Request"
              icon={<IoBarChart />}
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

export default Public;
