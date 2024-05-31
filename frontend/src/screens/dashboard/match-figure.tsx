import React from "react";
import { ActionIcon } from "@mantine/core";
import { FiEdit } from "react-icons/fi";

interface Prop {
  label: string;
  figure?: string;
  icon?: React.ReactNode;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
}

const MatchFigure: React.FC<Prop> = ({
  figure,
  label,
  icon,
  onActionClick,
  actionIcon,
}) => {
  return (
    <div className="relative flex h-28 w-full items-end justify-end gap-2 rounded bg-slate-100 p-5 ring-rose-500 ring-offset-2 hover:ring-2">
      <div className="absolute left-2 top-2 flex items-center gap-2">
        {icon}
        {label}
      </div>
      {onActionClick && (
        <div className="absolute right-2 top-2">
          <ActionIcon variant="transparent" onClick={() => onActionClick()}>
            {actionIcon ? actionIcon : <FiEdit color="black" />}
          </ActionIcon>
        </div>
      )}
      <span className="text-3xl font-bold">{figure}</span>
    </div>
  );
};

export default MatchFigure;
