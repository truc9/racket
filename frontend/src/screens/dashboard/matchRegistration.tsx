import httpClient from "../../common/httpClient";
import React from "react";
import ToggleButton from "../../components/toggleButton";
import { IoCash, IoWalk } from "react-icons/io5";
import { MatchModel, RegistrationModel } from "../../models";
import { useMutation } from "@tanstack/react-query";
import { useRegistrationsByMatchQuery } from "../../hooks/queries";

interface Prop {
  match: MatchModel;
}

const MatchRegistration: React.FC<Prop> = ({ match }) => {
  const { data: registrations, refetch } = useRegistrationsByMatchQuery(
    match.id,
  );

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
    <div className="flex flex-col gap-5">
      {registrations &&
        registrations.map((reg) => {
          return (
            <div
              key={reg.playerId}
              className="grid h-16 grid-cols-3 items-center gap-5"
            >
              <span>{reg.playerName}</span>
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

              <div className="flex items-center justify-center gap-2 text-center"></div>
            </div>
          );
        })}
    </div>
  );
};

export default MatchRegistration;
