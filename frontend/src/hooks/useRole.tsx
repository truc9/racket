import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import constant from "../common/constant";

export const useRoles = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchRoles = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const userRoles = decodedToken[constant.auth0.roleNamespace] || [];
          setRoles(userRoles);
        } catch (error) {
          console.error("Error fetching roles: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRoles();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return {
    roles,
    isAdmin: roles.includes(constant.auth0.roles.ADMIN),
    isLoading,
  };
};
