import { useAuth0 } from "@auth0/auth0-react";
import { FC } from "react";

interface Prop {
  showLabel: boolean;
}

const Profile: FC<Prop> = ({ showLabel }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="flex items-center justify-start gap-2">
        <img
          className="rounded-full"
          src={user!.picture}
          alt={user!.name}
          height={40}
          width={40}
        />
        {showLabel && (
          <div className="flex flex-col items-start justify-start">
            <h2 className="font-bold">{user!.name}</h2>
            <h5>Administrator</h5>
          </div>
        )}
      </div>
    )
  );
};

export default Profile;
