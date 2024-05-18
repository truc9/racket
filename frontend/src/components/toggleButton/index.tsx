import clsx from "clsx";
import React from "react";

interface Prop extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  isActive?: boolean;
  disabled?: boolean;
}

const ToggleButton: React.FC<Prop> = ({
  disabled,
  icon,
  label,
  isActive,
  ...props
}) => {
  return disabled ? (
    <div className="flex w-full items-center justify-center gap-1 rounded bg-gradient-to-r from-orange-500 to-orange-300 px-3 py-2 text-center text-white">
      Not Available
    </div>
  ) : (
    <button
      {...props}
      className={clsx(
        isActive
          ? "bg-gradient-to-r from-green-500 to-green-300"
          : "bg-slate-300",
        "flex w-full items-center justify-center gap-1 rounded px-3 py-2 text-center text-white",
      )}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};

export default ToggleButton;
