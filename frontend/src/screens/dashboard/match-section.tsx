import dayjs from "dayjs";
import React from "react";
import { MatchSummaryModel } from "../../models";
import MatchList from "./match-list";

interface Props {
  title: string;
  matches: MatchSummaryModel[];
}

const MatchSection: React.FC<Props> = ({ title, matches }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold">{title}</h3>
      {matches && (
        <MatchList
          matches={matches.filter((m) =>
            dayjs(m.start).isAfter(new Date(), "date"),
          )}
        ></MatchList>
      )}
    </div>
  );
};

export default MatchSection;
