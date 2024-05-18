import httpClient from "../../common/httpClient";
import React, { useMemo } from "react";
import ToggleButton from "../../components/toggleButton";
import { IoCash, IoWalk } from "react-icons/io5";
import { MatchModel, RegistrationModel } from "../../models";
import { useMutation } from "@tanstack/react-query";
import { useRegistrationsByMatchQuery } from "../../hooks/queries";
import { Badge } from "@mantine/core";

interface Prop {
  match: MatchModel;
}

const MatchRegistration: React.FC<Prop> = ({ match }) => {
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
      httpClient.post("api/v1/registrations", model),
  });

  const unregisterMut = useMutation({
    onSuccess: refetch,
    mutationFn: (id: number) => httpClient.del(`api/v1/registrations/${id}`),
  });

  const paidMutation = useMutation({
    onSuccess: refetch,
    mutationFn: (registrationId: number) => {
      return httpClient.put(`api/v1/registrations/${registrationId}/paid`, {});
    },
  });

  const unPaidMutation = useMutation({
    onSuccess: refetch,
    mutationFn: (registrationId: number) => {
      return httpClient.put(
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
              className="my-1 grid grid-cols-3 items-center justify-center gap-x-2 rounded px-2 py-2 align-middle transition-all odd:bg-violet-50 hover:bg-violet-200"
            >
              <span className="font-bold text-violet-500">
                {reg.playerName}
              </span>
              <div>
                {!!reg.registrationId ? (
                  <ToggleButton
                    label="Attend"
                    isActive={true}
                    onClick={() => unregisterMut.mutate(reg.registrationId)}
                    icon={<IoWalk />}
                  />
                ) : (
                  <ToggleButton
                    label="Not attend"
                    isActive={false}
                    onClick={() =>
                      registerMut.mutate({
                        matchId: match.id,
                        playerId: reg.playerId,
                      })
                    }
                    icon={<IoWalk />}
                  />
                )}
              </div>

              {!!reg.registrationId ? (
                <div>
                  <ToggleButton
                    label={reg.isPaid ? "Paid" : "Not pay yet"}
                    isActive={reg.isPaid}
                    onClick={() =>
                      reg.isPaid
                        ? unPaidMutation.mutate(reg.registrationId)
                        : paidMutation.mutate(reg.registrationId)
                    }
                    icon={<IoCash />}
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

export default MatchRegistration;
