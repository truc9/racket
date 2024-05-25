import httpService from "../../common/http-service";
import React, { useMemo } from "react";
import ToggleButton from "../../components/toggle-button";
import { Badge } from "@mantine/core";
import { FaBan, FaMoneyBillWave, FaWalking } from "react-icons/fa";
import { MatchSummaryModel, RegistrationModel } from "../../models";
import { useMutation } from "@tanstack/react-query";
import { useRegistrationsByMatchQuery } from "../../hooks/queries";

interface Prop {
  match: MatchSummaryModel;
}

const MatchListItem: React.FC<Prop> = ({ match }) => {
  const { data: registrations, refetch } = useRegistrationsByMatchQuery(
    match.id,
  );

  const attendantPercentage = useMemo(() => {
    return Math.round(
      ((registrations?.filter((r) => !!r.registrationId).length ?? 0) /
        (registrations?.length ?? 0)) *
        100,
    );
  }, [registrations]);

  const registerMut = useMutation({
    onSuccess: refetch,
    mutationFn: (model: RegistrationModel) =>
      httpService.post("api/v1/registrations", model),
  });

  const unregisterMut = useMutation({
    onSuccess: refetch,
    mutationFn: (id: number) => httpService.del(`api/v1/registrations/${id}`),
  });

  const paidMutation = useMutation({
    onSuccess: refetch,
    mutationFn: (registrationId: number) => {
      return httpService.put(`api/v1/registrations/${registrationId}/paid`, {});
    },
  });

  const unPaidMutation = useMutation({
    onSuccess: refetch,
    mutationFn: (registrationId: number) => {
      return httpService.put(
        `api/v1/registrations/${registrationId}/unpaid`,
        {},
      );
    },
  });

  return (
    <div className="flex flex-col">
      {registrations &&
        registrations.map((reg) => {
          return (
            <div
              key={reg.playerId}
              className="my-1 grid grid-cols-3 items-center justify-center gap-x-2 rounded from-green-300 to-green-50 px-2 py-2 align-middle transition-all odd:bg-violet-50 hover:bg-gradient-to-r"
            >
              <span className="font-bold">{reg.playerName}</span>
              <div>
                {!!reg.registrationId ? (
                  <ToggleButton
                    label="Interested"
                    isActive={true}
                    onClick={() => unregisterMut.mutate(reg.registrationId)}
                    icon={<FaWalking />}
                  />
                ) : (
                  <ToggleButton
                    label="Not interested"
                    isActive={false}
                    onClick={() =>
                      registerMut.mutate({
                        matchId: match.id,
                        playerId: reg.playerId,
                      })
                    }
                    icon={<FaBan />}
                  />
                )}
              </div>

              {!!reg.registrationId ? (
                <div>
                  <ToggleButton
                    label={reg.isPaid ? "Paid" : "Unpaid"}
                    isActive={reg.isPaid}
                    onClick={() =>
                      reg.isPaid
                        ? unPaidMutation.mutate(reg.registrationId)
                        : paidMutation.mutate(reg.registrationId)
                    }
                    icon={<FaMoneyBillWave />}
                  />
                </div>
              ) : (
                <ToggleButton disabled={true} />
              )}
            </div>
          );
        })}

      <div className="flex justify-between">
        <div className="flex items-center gap-2 p-2 font-bold">
          <div>Total Player</div>
          <Badge color="grape">
            {registrations?.filter((r) => !!r.registrationId).length}
          </Badge>
        </div>

        <div className="flex items-center gap-2 p-2 font-bold">
          <div>Paid</div>
          <Badge color="orange">
            {registrations?.filter((r) => !!r.isPaid).length}
          </Badge>
        </div>
        <div className="flex items-center gap-2 p-2 font-bold">
          <div>Unpaid</div>
          <Badge color="red">
            {registrations?.filter((r) => !r.isPaid).length}
          </Badge>
        </div>
        <div className="flex items-center gap-2 p-2 font-bold">
          <div>Attendant Percentage</div>
          <Badge color={attendantPercentage > 50 ? "violet" : "red"}>
            {attendantPercentage}%
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MatchListItem;
