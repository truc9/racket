import httpClient from "../../common/httpClient";
import React from "react";
import ToggleButton from "../../components/toggleButton";
import { IoCash, IoWalk } from "react-icons/io5";
import { RegistrationModel } from "../../models";
import { useMutation } from "@tanstack/react-query";
import { useRegistrationsByMatchQuery } from "../../hooks/queries";

interface Prop {
  matchId: number;
}

const MatchRegistration: React.FC<Prop> = ({ matchId }) => {
  const { data: registrations, refetch } =
    useRegistrationsByMatchQuery(matchId);

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
              className="grid h-16 grid-cols-3 items-center gap-5"
            >
              <span>{reg.playerName}</span>
              <div>
                {!!reg.registrationId ? (
                  <ToggleButton
                    label="Un-register"
                    isActive={true}
                    onClick={() => unregisterMut.mutate(reg.registrationId)}
                    icon={<IoWalk />}
                  />
                ) : (
                  <ToggleButton
                    label="Register"
                    isActive={false}
                    onClick={() =>
                      registerMut.mutate({ matchId, playerId: reg.playerId })
                    }
                    icon={<IoWalk />}
                  />
                )}
              </div>

              {!!reg.registrationId ? (
                <div>
                  <ToggleButton
                    label={reg.isPaid ? "Unpaid" : "Paid"}
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
    </div>
  );
};

export default MatchRegistration;
