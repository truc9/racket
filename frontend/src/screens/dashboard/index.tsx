import dayjs from "dayjs";
import formatter from "../../common/formatter";
import Loading from "../../components/loading";
import Page from "../../components/page";
import { Accordion } from "@mantine/core";
import { FiClock, FiMapPin } from "react-icons/fi";
import { lazy, Suspense, useMemo } from "react";
import { useMatchesQuery } from "../../hooks/queries";
import clsx from "clsx";

const MatchRegistration = lazy(() => import("./matchRegistration"));

function Dashboard() {
  const { data: matches } = useMatchesQuery();

  const todayMatch = useMemo(() => {
    if (!matches) return null;
    return matches.find((m) => dayjs(m.start).isSame(new Date(), "date"));
  }, [matches]);

  return (
    <Page title="Dashboard">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Today Match</h3>
          {todayMatch && (
            <Accordion variant="separated" value={`${todayMatch.id}`}>
              <Accordion.Item key={todayMatch.id} value={`${todayMatch.id}`}>
                <Accordion.Control icon={<FiMapPin />}>
                  <div className="flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                      <span>
                        {dayjs(todayMatch.start).format("dddd")} -{" "}
                        {todayMatch.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>
                        {formatter.formatDateRange(
                          todayMatch.start,
                          todayMatch.end,
                        )}
                      </span>
                    </div>
                  </div>
                </Accordion.Control>
                <Accordion.Panel>
                  <Suspense fallback={<Loading />}>
                    <MatchRegistration match={todayMatch} />
                  </Suspense>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Upcoming Matches</h3>
          <Accordion variant="separated">
            {matches &&
              matches
                .filter((m) => dayjs(m.start).isAfter(new Date(), "date"))
                .map((match) => {
                  return (
                    <Accordion.Item key={match.id} value={`${match.id}`}>
                      <Accordion.Control icon={<FiMapPin />}>
                        <div
                          className={clsx(
                            dayjs(match.start).isSame(new Date(), "date")
                              ? "text-pink-500"
                              : "text-slate-300",
                            "flex items-center justify-between px-5",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span>
                              {dayjs(match.start).format("dddd")} -{" "}
                              {match.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiClock />
                            <span>
                              {formatter.formatDateRange(
                                match.start,
                                match.end,
                              )}
                            </span>
                          </div>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Suspense fallback={<Loading />}>
                          <MatchRegistration match={match} />
                        </Suspense>
                      </Accordion.Panel>
                    </Accordion.Item>
                  );
                })}
          </Accordion>
        </div>
      </div>
    </Page>
  );
}

export default Dashboard;
