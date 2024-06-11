import dayjs from "dayjs";
import { useMemo } from "react";
import Page from "../../components/page";
import { useMatchesQuery } from "../../hooks/useQueries";
import MatchList from "./match-list";

function Dashboard() {
  const { data: matches } = useMatchesQuery();

  const currentMatch = useMemo(() => {
    if (!matches) return null;
    return matches.find((m) => dayjs(m.start).isSame(new Date(), "date"));
  }, [matches]);

  return (
    <Page title="Dashboard">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Today Match</h3>
          <MatchList matches={[currentMatch!]}></MatchList>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Upcoming Matches</h3>
          {matches && (
            <MatchList
              matches={matches.filter((m) =>
                dayjs(m.start).isAfter(new Date(), "date"),
              )}
            ></MatchList>
          )}
        </div>
      </div>
    </Page>
  );
}

export default Dashboard;
