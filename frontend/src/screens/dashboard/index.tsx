import dayjs from "dayjs";
import formatter from "../../common/formatter";
import Loading from "../../components/loading";
import Page from "../../components/page";
import { Accordion } from "@mantine/core";
import { FiClock, FiMapPin } from "react-icons/fi";
import { lazy, Suspense } from "react";
import { useMatchesQuery } from "../../hooks/queries";

const MatchRegistration = lazy(() => import("./matchRegistration"));

function Dashboard() {
  const { data: matches } = useMatchesQuery();

  return (
    <Page title="Dashboard">
      <div className="flex flex-col gap-2">
        <Accordion variant="separated">
          {matches &&
            matches.map((match) => {
              return (
                <Accordion.Item key={match.id} value={`${match.id}`}>
                  <Accordion.Control icon={<FiMapPin />}>
                    <div className="flex items-center justify-between px-5">
                      <div className="flex items-center gap-2">
                        <span>
                          {dayjs(match.start).format("dddd")} - {match.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock />
                        <span>
                          {formatter.formatDateRange(match.start, match.end)}
                        </span>
                      </div>
                    </div>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Suspense fallback={<Loading />}>
                      <MatchRegistration matchId={match.id} />
                    </Suspense>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
        </Accordion>
      </div>
    </Page>
  );
}

export default Dashboard;
