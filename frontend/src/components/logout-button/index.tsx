import { useAuth0 } from "@auth0/auth0-react";
import { FC } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Prop {
  showLabel: boolean;
}

const LogoutButton: FC<Prop> = ({ showLabel }) => {
  const { logout } = useAuth0();
  const navigate = useNavigate();

  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded bg-red-500 px-3 py-3 text-center text-white active:translate-y-1"
      onClick={() => {
        navigate("/login", { replace: true });
        logout({ logoutParams: { returnTo: window.location.origin } });
      }}
    >
      <FaSignOutAlt />
      {showLabel && <span>Sign Out</span>}
    </button>
  );
};

export default LogoutButton;
