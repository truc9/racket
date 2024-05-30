import React from "react";
import { ActionIcon } from "@mantine/core";
import { FiEdit } from "react-icons/fi";

interface Prop {
  label: string;
  figure?: string;
  icon?: React.ReactNode;
  onEdit?: () => void;
}

const MatchFigure: React.FC<Prop> = ({ figure, label, icon, onEdit }) => {
  return (
    <div className="relative flex h-28 w-full items-end justify-end gap-2 rounded bg-slate-100 p-5">
      <div className="absolute left-2 top-2 flex items-center gap-2">
        {icon}
        {label}
      </div>
      {onEdit && (
        <div className="absolute right-2 top-2">
          <ActionIcon variant="transparent" onClick={() => onEdit()}>
            <FiEdit color="black" />
          </ActionIcon>
        </div>
      )}
      <span className="text-3xl font-bold">{figure}</span>
    </div>
  );
};

export default MatchFigure;
