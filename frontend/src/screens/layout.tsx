import cx from "clsx";
import Loading from "../components/loading";
import { FC, ReactNode, useState } from "react";
import { FiChevronLeft, FiLogOut } from "react-icons/fi";
import { NavLink, Outlet } from "react-router-dom";
import { Suspense } from "react";
import {
  FaChartArea,
  FaFighterJet,
  FaHeartbeat,
  FaUserClock,
} from "react-icons/fa";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/clerk-react";
import SignInScreen from "./signin";

interface NavItemProps {
  label?: string;
  path: string;
  icon: ReactNode;
  showLabel?: boolean;
}
const NavItem: FC<NavItemProps> = ({ label, path, icon, showLabel = true }) => {
  return (
    <NavLink
      className="flex items-center gap-2 rounded px-4 py-3 hover:bg-rose-400 [&.active]:bg-rose-400"
      to={path}
    >
      <span className="text-xl">{icon}</span>
      {label && showLabel && <span>{label}</span>}
    </NavLink>
  );
};

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function Layout() {
  const APP_NAME = "RACKET";
  const [collapsed, setCollapsed] = useState(false);

  function toggleSideNav() {
    setCollapsed(!collapsed);
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignedIn>
        <div className="flex h-screen w-screen">
          <div
            className={cx(
              "group relative flex h-full flex-shrink-0 flex-grow-0 flex-col border-r bg-rose-500 text-white transition-all delay-100",
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
                className="absolute -right-2 top-2 hidden rounded-full border border-rose-500 bg-white text-lg text-rose-500 shadow ring-rose-500 group-hover:block"
              >
                <FiChevronLeft className={cx(collapsed && "rotate-180")} />
              </button>
            </div>
            <div className="flex p-2">
              <div className="flex w-full flex-col">
                <SignOutButton>
                  <button className="flex w-full items-center justify-center gap-2 rounded py-2 text-center hover:bg-rose-400">
                    <span className="text-xl">
                      <FiLogOut />
                    </span>
                    {!collapsed && <span>Sign Out</span>}
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-1 bg-slate-300">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInScreen />
      </SignedOut>
    </ClerkProvider>
  );
}

export default Layout;
