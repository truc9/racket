import dayjs from "dayjs";
import { lazy, Suspense, useMemo } from "react";
import Loading from "../../components/loading";
import Page from "../../components/page";
import { useMatchesQuery } from "../../hooks/useQueries";

const MatchSection = lazy(() => import("./match-section"));

function Dashboard() {
  const { data: matches } = useMatchesQuery();

  const todayMatches = useMemo(() => {
    if (!matches) return null;
    return matches.filter((m) => dayjs(m.start).isSame(new Date(), "date"));
  }, [matches]);

  const upcomingMatches = useMemo(() => {
    if (!matches) return null;
    return matches.filter((m) => dayjs(m.start).isAfter(new Date(), "date"));
  }, [matches]);

  const historyMatches = useMemo(() => {
    if (!matches) return null;
    return matches.filter((m) =>
      dayjs(m.start).isAfter(dayjs(new Date()).subtract(1, "month")),
    );
  }, [matches]);

  return (
    <Page title="Dashboard">
      <div className="flex flex-col gap-2">
        <Suspense fallback={<Loading />}>
          {todayMatches && (
            <MatchSection title="Today" matches={todayMatches} />
          )}
        </Suspense>
        <Suspense fallback={<Loading />}>
          {upcomingMatches && (
            <MatchSection title="Upcoming" matches={upcomingMatches} />
          )}
        </Suspense>
        <Suspense fallback={<Loading />}>
          {historyMatches && (
            <MatchSection title="Last month" matches={historyMatches} />
          )}
        </Suspense>
      </div>
    </Page>
  );
}

export default Dashboard;
