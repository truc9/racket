import { useAuth0 } from "@auth0/auth0-react";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import FullScreenLoading from "../../components/fullscreen-loading";
import Loading from "../../components/loading";
import { Menu, rem } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

function PublicLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <div className="mt-5 flex w-full flex-col items-center justify-center gap-3 lg:w-1/3">
            <img
              className="rounded-full ring-4 ring-rose-500 ring-offset-2"
              src={user!.picture}
              alt={user!.name}
              height={60}
              width={60}
            />
            <h3 className="rounded-full bg-blue-500 p-1 text-white">
              {user!.name}
            </h3>
            <h3 className="text-2xl font-bold">Welcome to Racket</h3>
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={() => logout()}
            color="red"
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Signout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default PublicLayout;
