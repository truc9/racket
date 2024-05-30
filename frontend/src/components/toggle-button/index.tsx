import clsx from "clsx";
import React from "react";
import { IoBan } from "react-icons/io5";

interface Prop extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  activeColor?: "green" | "pink" | "red";
  isActive?: boolean;
  disabled?: boolean;
}

const ToggleButton: React.FC<Prop> = ({
  disabled,
  icon,
  activeColor = "green",
  isActive,
  ...props
}) => {
  const activeBg = {
    green: "bg-green-500",
    pink: "bg-pink-500",
    red: "bg-red-500",
  };

  return disabled ? (
    <div className="flex h-8 w-8 items-center justify-center gap-1 rounded-full bg-slate-300 text-center text-white">
      <IoBan />
    </div>
  ) : (
    <button
      {...props}
      className={clsx(
        isActive ? activeBg[activeColor] : "bg-slate-300",
        "flex h-8 w-8 items-center justify-center gap-1 rounded-full text-center text-white",
      )}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );
};

export default ToggleButton;
