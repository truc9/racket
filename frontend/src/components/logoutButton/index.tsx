import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mantine/core";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      size="lg"
      color="lime"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
