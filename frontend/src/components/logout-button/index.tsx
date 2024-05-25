import { FaSignOutAlt } from "react-icons/fa";
import { FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface Prop {
  showLabel: boolean;
}

const LogoutButton: FC<Prop> = ({ showLabel }) => {
  const { logout } = useAuth0();

  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-3 py-3 text-center active:translate-y-1"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <FaSignOutAlt />
      {showLabel && <span>Sign Out</span>}
    </button>
  );
};

export default LogoutButton;
