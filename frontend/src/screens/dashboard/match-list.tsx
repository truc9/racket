import dayjs from "dayjs";
import formatter from "../../common/formatter";
import Loading from "../../components/loading";
import React, { lazy, Suspense } from "react";
import { Accordion } from "@mantine/core";
import { FiClock, FiMapPin } from "react-icons/fi";
import { MatchSummaryModel } from "../../models";

const MatchRegistration = lazy(() => import("./match-list-item"));

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
            <Accordion.Item key={m.id} value={`${m.id}`}>
              <Accordion.Control icon={<FiMapPin />}>
                <div className="flex items-center justify-between px-5">
                  <div className="flex items-center gap-2">
                    <span>
                      {dayjs(m.start).format("dddd")} - {m.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock />
                    <span>{formatter.formatDateRange(m.start, m.end)}</span>
                  </div>
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <Suspense fallback={<Loading />}>
                  <MatchRegistration match={m} />
                </Suspense>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
    </Accordion>
  );
};

export default MatchList;
