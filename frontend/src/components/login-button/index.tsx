import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mantine/core";
import React from "react";
import { FiLogIn } from "react-icons/fi";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      fullWidth
      leftSection={<FiLogIn />}
      size="lg"
      onClick={() => loginWithRedirect()}
    >
      Login
    </Button>
  );
};

export default LoginButton;
