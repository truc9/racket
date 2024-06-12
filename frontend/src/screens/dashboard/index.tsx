import dayjs from "dayjs";
import { useMemo } from "react";
import Page from "../../components/page";
import { useMatchesQuery } from "../../hooks/useQueries";
import MatchSection from "./match-section";

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

  return (
    <Page title="Dashboard">
      <div className="flex flex-col gap-2">
        {todayMatches && (
          <MatchSection title="Today Match" matches={todayMatches} />
        )}

        {upcomingMatches && (
          <MatchSection title="Upcoming Matches" matches={upcomingMatches} />
        )}
      </div>
    </Page>
  );
}

export default Dashboard;
