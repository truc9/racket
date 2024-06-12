import React from "react";
import { IoPlanetOutline } from "react-icons/io5";
import { MatchSummaryModel } from "../../models";
import MatchList from "./match-list";

interface Props {
  title: string;
  matches: MatchSummaryModel[];
}

const MatchSection: React.FC<Props> = ({ title, matches }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2 text-lg font-bold">
        <IoPlanetOutline />
        <h3>{title}</h3>
      </div>
      {matches && <MatchList matches={matches} />}
    </div>
  );
};

export default MatchSection;
