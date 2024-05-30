import dayjs from "dayjs";
import formatter from "../../common/formatter";
import Loading from "../../components/loading";
import React, { lazy, Suspense } from "react";
import { Accordion } from "@mantine/core";
import { FiMapPin } from "react-icons/fi";
import { MatchSummaryModel } from "../../models";

const MatchListContent = lazy(() => import("./match-list-content"));

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
        matches.map((m) => {
          return !m ? (
            <span>Match not available</span>
          ) : (
            <Accordion.Item key={m.matchId} value={`${m.matchId}`}>
              <Accordion.Control icon={<FiMapPin />}>
                <div className="flex items-center justify-between px-5">
                  <div className="flex items-center gap-2">
                    <span>{dayjs(m.start).format("dddd")} -</span>
                    <span>{m.sportCenterName || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{formatter.formatDateRange(m.start, m.end)}</span>
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
