import React from "react";
import { IoPlanetOutline } from "react-icons/io5";
import { MatchSummaryModel } from "../../models";
import MatchList from "./match-list";
import { Skeleton } from "@mantine/core";

interface Props {
  title: string;
  matches?: MatchSummaryModel[];
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const MatchSection: React.FC<Props> = ({ title, matches, isLoading, icon }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2 text-lg font-bold">
        {icon || <IoPlanetOutline />}
        <h3>{title}</h3>
      </div>
      {isLoading && (
        <div className="flex items-center gap-2">
          <Skeleton height={40} className="w-1/5" />
          <Skeleton height={40} className="w-2/5" />
          <Skeleton height={40} />
        </div>
      )}
      {matches && <MatchList matches={matches} />}
    </div>
  );
};

export default MatchSection;
