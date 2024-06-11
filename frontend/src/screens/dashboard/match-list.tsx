import { Accordion, Badge } from "@mantine/core";
import dayjs from "dayjs";
import React, { Suspense } from "react";
import { FiClock, FiMapPin } from "react-icons/fi";
import formatter from "../../common/formatter";
import Loading from "../../components/loading";
import { MatchSummaryModel } from "../../models";
import MatchListContent from "./match-list-content";

interface Prop {
  matches: MatchSummaryModel[];
}

const MatchList: React.FC<Prop> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return <div>No matches</div>;
  }
  return (
    <Accordion variant="separated">
      {matches &&
        matches.map((m, idx) => {
          return !m ? (
            <span key={idx}>Match not available</span>
          ) : (
            <Accordion.Item key={m.matchId} value={`${m.matchId}`}>
              <Accordion.Control icon={<FiMapPin />}>
                <div className="flex items-center justify-between px-5">
                  <div className="flex items-center space-x-2">
                    <span>{dayjs(m.start).format("dddd")}</span>
                    <span>|</span>
                    <span className="font-bold">
                      {m.sportCenterName || "N/A"}
                    </span>
                    <Badge color="green">{m.court}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock />
                    <span>{formatter.formatDate(m.start)}</span>
                  </div>
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <Suspense fallback={<Loading />}>
                  <MatchListContent match={m} />
                </Suspense>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
    </Accordion>
  );
};

export default MatchList;
