import cx from "clsx";
import Loading from "../components/loading";
import { FC, ReactNode, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import {
  FaChartArea,
  FaFighterJet,
  FaHeartbeat,
  FaUserClock,
} from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/logoutButton";
import Profile from "../components/profile";

interface NavItemProps {
  label?: string;
  path: string;
  icon: ReactNode;
  showLabel?: boolean;
}
const NavItem: FC<NavItemProps> = ({ label, path, icon, showLabel = true }) => {
  return (
    <NavLink
      className="flex items-center gap-2 rounded px-4 py-3 hover:bg-pink-400 [&.active]:bg-pink-400"
      to={path}
    >
      <span className="text-xl">{icon}</span>
      {label && showLabel && <span>{label}</span>}
    </NavLink>
  );
};

function Layout() {
  const APP_NAME = "RACKET";
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  function toggleSideNav() {
    setCollapsed(!collapsed);
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated && !user) {
    navigate("/login", { replace: true });
    return;
  }

  return (
    <div className="flex h-screen w-screen">
      <div
        className={cx(
          "group relative flex h-full flex-shrink-0 flex-grow-0 flex-col border-r bg-pink-500 text-white transition-all delay-100",
          !collapsed && "w-[250px]",
          collapsed && "w-16",
        )}
      >
        <div className="flex flex-1 flex-col text-center">
          {collapsed ? (
            <div className="p-2 text-2xl font-bold">
              {APP_NAME.substring(0, 1)}
            </div>
          ) : (
            <div className="p-2 text-2xl font-bold">{APP_NAME}</div>
          )}
          <div className="flex flex-col p-2">
            <NavItem
              showLabel={!collapsed}
              path="/"
              label="Dashboard"
              icon={<FaChartArea />}
            />
            <NavItem
              showLabel={!collapsed}
              path="/matches"
              label="Matches"
              icon={<FaFighterJet />}
            />
            <NavItem
              showLabel={!collapsed}
              path="/players"
              label="Players"
              icon={<FaUserClock />}
            />
            <NavItem
              showLabel={!collapsed}
              path="/health"
              label="Health"
              icon={<FaHeartbeat />}
            />
          </div>
          <button
            onClick={toggleSideNav}
            className="absolute -right-2 top-2 hidden rounded-full border border-pink-500 bg-white text-lg text-pink-500 shadow ring-pink-500 group-hover:block"
          >
            <FiChevronLeft className={cx(collapsed && "rotate-180")} />
          </button>
        </div>
        <div className="flex p-2">
          <div className="flex w-full flex-col gap-3 rounded bg-pink-400 p-3 shadow">
            <Profile />
            <LogoutButton />
          </div>
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
