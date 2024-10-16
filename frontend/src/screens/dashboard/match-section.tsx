import React from "react";
import { IoPlanetOutline } from "react-icons/io5";
import { MatchSummaryModel } from "../../models";
import MatchList from "./match-list";
import { Skeleton } from "@mantine/core";

interface Props {
  title: string;
  matches?: MatchSummaryModel[];
  isLoading?: boolean;
}

const MatchSection: React.FC<Props> = ({ title, matches, isLoading }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2 text-lg font-bold">
        <IoPlanetOutline />
        <h3>{title}</h3>
      </div>
      {isLoading && (
        <>
          <Skeleton height={40} />
          <Skeleton height={40} mt={1} />
        </>
      )}
      {matches && <MatchList matches={matches} />}
    </div>
  );
};

export default MatchSection;
