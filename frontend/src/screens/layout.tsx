import cx from "clsx";
import Loading from "../components/loading";
import { FaChartArea, FaCog, FaFighterJet, FaUserClock } from "react-icons/fa";
import { FC, ReactNode, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { NavLink, Outlet } from "react-router-dom";
import { Suspense } from "react";

interface NavItemProps {
  label?: string;
  path: string;
  icon: ReactNode;
  showLabel?: boolean;
}
const NavItem: FC<NavItemProps> = ({ label, path, icon, showLabel = true }) => {
  return (
    <NavLink
      className="hover:bg-gradient-to-r hover:font-bold [&.active]:bg-gradient-to-r [&.active]:font-bold from-green-300 to-green-400 px-4 py-3 rounded flex items-center gap-2"
      to={path}
    >
      <span className="text-xl">{icon}</span>
      {label && showLabel && <span>{label}</span>}
    </NavLink>
  );
};

function Layout() {
  const APP_NAME = "RACKET";
  const [collapsed, setCollapsed] = useState(true);

  function toggleSideNav() {
    setCollapsed(!collapsed);
  }

  return (
    <div className="flex w-screen h-screen">
      <div
        className={cx(
          "group transition-all delay-100 relative h-full bg-green-400 text-white flex-shrink-0 flex-grow-0 border-r",
          !collapsed && "w-[250px]",
          collapsed && "w-16"
        )}
      >
        {collapsed ? (
          <div className="text-2xl font-bold p-2 text-center">
            {APP_NAME.substring(0, 1)}
          </div>
        ) : (
          <div className="text-2xl font-bold p-2 text-center">{APP_NAME}</div>
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
            path="/settings"
            label="Settings"
            icon={<FaCog />}
          />
        </div>
        <button
          onClick={toggleSideNav}
          className="hidden group-hover:block absolute top-2 -right-2 text-lg rounded-full ring-green-500 bg-white text-green-500 shadow border border-green-500"
        >
          <FiChevronLeft className={cx(collapsed && "rotate-180")} />
        </button>
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
