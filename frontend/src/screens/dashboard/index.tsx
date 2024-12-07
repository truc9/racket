import { lazy } from "react";
import Page from "../../components/page";
import {
  useArchivedMatchesQuery,
  useFutureMatchesQuery,
  useTodayMatchesQuery,
} from "../../hooks/useQueries";
import {
  IoArchiveOutline,
  IoCalendarClearOutline,
  IoTodayOutline,
} from "react-icons/io5";

const MatchSection = lazy(() => import("./match-section"));

function Dashboard() {
  const { data: archivedMatches, isPending: archivedMatchesLoading } =
    useArchivedMatchesQuery();

  const { data: futureMatches, isPending: futureMatchesLoading } =
    useFutureMatchesQuery();

  const { data: todayMatches, isPending: todayMatchesLoading } =
    useTodayMatchesQuery();

  return (
    <Page title="Dashboard">
      <div className="flex flex-col gap-2">
        <MatchSection
          icon={<IoTodayOutline />}
          title="Today"
          isLoading={todayMatchesLoading}
          matches={todayMatches}
        />

        <MatchSection
          icon={<IoCalendarClearOutline />}
          title="Future"
          isLoading={futureMatchesLoading}
          matches={futureMatches}
        />

        <MatchSection
          icon={<IoArchiveOutline />}
          title="Archived"
          isLoading={archivedMatchesLoading}
          matches={archivedMatches}
        />
      </div>
    </Page>
  );
}

export default Dashboard;
