import { useAuth0 } from "@auth0/auth0-react";
import cx from "clsx";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import formatter from "../../../common/formatter";
import httpService from "../../../common/http-service";
import {
  useAttendantRequestsQuery,
  useMatchesQuery,
} from "../../../hooks/queries";
import { AttendantRequestModel, MatchSummaryModel } from "../../../models";
import { notifications } from "@mantine/notifications";
import { MatchModel } from "../../matches/models";

export default function AttendantRequest() {
  const { user } = useAuth0();
  const { data: attendantRequests, refetch } = useAttendantRequestsQuery(
    user?.sub ?? "",
  );

  const { data: matches } = useMatchesQuery();

  const toggleAttendantClick = async (match: MatchSummaryModel) => {
    await httpService.post("api/v1/registrations/attendant-requests", {
      externalUserId: user?.sub,
      lastName: user?.family_name,
      firstName: user?.given_name,
      email: user?.email,
      matchId: match.matchId,
    });

    refetch();
  };

  return (
    <div className="flex h-full flex-col gap-3 px-2 py-5">
      {matches &&
        matches.map((m) => {
          return (
            <div
              key={m.matchId}
              className="flex w-full items-center justify-between rounded bg-slate-100 px-3 py-3"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 font-bold">
                  <FiCalendar />
                  <span>{formatter.formatWeekDay(m.start, false)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin />
                  <span>{m.sportCenterName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock />
                  <span>{formatter.formatTime(m.start)}</span>
                  <span>-</span>
                  <span>{formatter.formatTime(m.end)}</span>
                </div>
              </div>
              <button
                onClick={() => toggleAttendantClick(m)}
                className={cx(
                  "animate-pulse rounded-full ring-2 ring-offset-1 transition-all active:translate-y-1",
                  attendantRequests?.map((r) => r.matchId)?.includes(m.matchId)
                    ? "text-emerald-500 ring-emerald-500"
                    : "text-orange-500 ring-orange-500",
                )}
              >
                <IoCheckmarkCircle size={50} />
              </button>
            </div>
          );
        })}
    </div>
  );
}
