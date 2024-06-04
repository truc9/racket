import { useAuth0 } from "@auth0/auth0-react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import formatter from "../../../common/formatter";
import httpService from "../../../common/http-service";
import { useMatchesQuery } from "../../../hooks/queries";
import { MatchSummaryModel } from "../../../models";

export default function AttendantRequest() {
  const { data: matches } = useMatchesQuery();
  const { user } = useAuth0();

  const toggleAttendantClick = async (match: MatchSummaryModel) => {
    await httpService.post("api/v1/registrations/attendant-requests", {
      externalUserId: user?.sub,
      lastName: user?.family_name,
      firstName: user?.given_name,
      email: user?.email,
      matchId: match.matchId,
    });
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
                className="animate-pulse rounded-full text-emerald-500 ring-2 ring-emerald-500 ring-offset-1 transition-all active:translate-y-1"
              >
                <IoCheckmarkCircle size={50} />
              </button>
            </div>
          );
        })}
    </div>
  );
}
