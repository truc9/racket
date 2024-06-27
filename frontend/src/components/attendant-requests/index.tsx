import { useAuth0 } from "@auth0/auth0-react";
import cx from "clsx";
import { FiCalendar, FiClock, FiGift, FiMapPin } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import formatter from "../../common/formatter";
import httpService from "../../common/http";
import {
  useAttendantRequestsQuery,
  useUpcomingMatches,
} from "../../hooks/useQueries";
import { MatchSummaryModel } from "../../models";
import dayjs from "dayjs";

export default function AttendantRequests() {
  const { user } = useAuth0();
  const { data: attendantRequests, refetch: refetchAttendants } =
    useAttendantRequestsQuery(user?.sub ?? "");

  const { data: matches, refetch: refetchMatches } = useUpcomingMatches();

  const toggleAttendantClick = async (match: MatchSummaryModel) => {
    await httpService.post("api/v1/registrations/attendant-requests", {
      externalUserId: user?.sub,
      lastName: user?.family_name,
      firstName: user?.given_name,
      email: user?.email,
      matchId: match.matchId,
    });

    refetchAttendants();
    refetchMatches();
  };

  return (
    <div className="flex h-full w-full flex-col gap-3 px-2 py-5 lg:w-2/3">
      {matches &&
        matches.map((m) => {
          const isAttended = attendantRequests
            ?.map((r) => r.matchId)
            ?.includes(m.matchId);
          return (
            <div
              key={m.matchId}
              className="flex items-center justify-between rounded bg-slate-100 px-3 py-3"
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
                {isAttended && (
                  <div className="flex items-center space-x-2 font-bold text-pink-500">
                    <FiGift />
                    <span>{formatter.currency(m.individualCost)}</span>
                  </div>
                )}
              </div>

              {!dayjs(new Date()).isSame(m.start, "day") && (
                <button
                  onClick={() => toggleAttendantClick(m)}
                  className={cx(
                    "rounded-full ring-2 ring-offset-1 transition-all active:translate-y-1",
                    isAttended
                      ? "animate-pulse text-green-500 ring-green-500"
                      : "text-slate-300 ring-slate-300",
                  )}
                >
                  <IoCheckmarkCircle size={50} />
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
}
