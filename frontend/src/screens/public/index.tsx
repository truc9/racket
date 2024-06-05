import { useAuth0 } from "@auth0/auth0-react";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import FullScreenLoading from "../../components/fullscreen-loading";
import Loading from "../../components/loading";
import LogoutButton from "../../components/logout-button";

function Public() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex w-full flex-col items-center justify-center space-y-2">
        <img
          className="rounded-full"
          src={user!.picture}
          alt={user!.name}
          height={60}
          width={60}
        />
        <h3>Welcome {user!.name}</h3>
        <div className="w-full px-2">
          <LogoutButton showLabel={true} />
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default Public;
