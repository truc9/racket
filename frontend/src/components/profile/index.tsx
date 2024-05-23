import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="flex flex-col">
        <img
          className="rounded-full"
          src={user!.picture}
          alt={user!.name}
          height={80}
          width={80}
        />
        <div className="flex flex-col">
          <h2>{user!.name}</h2>
          <p>{user!.email}</p>
        </div>
      </div>
    )
  );
};

export default Profile;
