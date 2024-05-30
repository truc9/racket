import httpService from "../../common/http-service";
import MatchFigure from "./match-figure";
import React, { useMemo } from "react";
import ToggleButton from "../../components/toggle-button";
import { Alert, Button, Modal, NumberInput } from "@mantine/core";
import { FaCashRegister } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { MatchSummaryModel, RegistrationModel } from "../../models";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  IoBan,
  IoBaseball,
  IoCash,
  IoHeartCircle,
  IoPersonSharp,
} from "react-icons/io5";
import {
  useMatchAdditionalCostQuery,
  useMatchCostQuery,
  useRegistrationsByMatchQuery,
} from "../../hooks/queries";
import { useState } from "react";

interface Prop {
  match: MatchSummaryModel;
}

const MatchListContent: React.FC<Prop> = ({ match }) => {
  const [currentCost, setCurrentCost] = useState(0);

  const [costOpened, { open: openCost, close: closeCost }] =
    useDisclosure(false);

  const [
    additionalCostOpened,
    { open: openAdditionalCost, close: closeAdditionalCost },
  ] = useDisclosure(false);

  const { data: registrations, refetch: refetchRegistrations } =
    useRegistrationsByMatchQuery(match.matchId);

  const { data: cost, refetch: refetchCost } = useMatchCostQuery(match.matchId);
  const { data: additionalCost } = useMatchAdditionalCostQuery(match.matchId);

  const statPercentage = useMemo(() => {
    return Math.round(
      ((registrations?.filter((r) => !!r.registrationId).length ?? 0) /
        (registrations?.length ?? 0)) *
        100,
    );
  }, [registrations]);

  const statPaid = useMemo(() => {
    return registrations?.filter((r) => r.registrationId && !!r.isPaid).length;
  }, [registrations]);

  const statUnpaid = useMemo(() => {
    return registrations?.filter((r) => r.registrationId && !r.isPaid).length;
  }, [registrations]);

  const statTotalPlayer = useMemo(() => {
    return registrations?.filter((r) => !!r.registrationId).length;
  }, [registrations]);

  const individualCost = useMemo(() => {
    const total = (cost ?? 0) + (additionalCost ?? 0);
    const totalPlayer =
      registrations?.filter((r) => !!r.registrationId)?.length ?? 0;
    return totalPlayer === 0 ? 0 : total / totalPlayer;
  }, [cost, additionalCost, registrations]);

  const registerMut = useMutation({
    onSuccess: refetchRegistrations,
    mutationFn: (model: RegistrationModel) =>
      httpService.post("api/v1/registrations", model),
  });

  const unregisterMut = useMutation({
    onSuccess: refetchRegistrations,
    mutationFn: (registrationId: number) =>
      httpService.del(`api/v1/registrations/${registrationId}`),
  });

  const paidMut = useMutation({
    onSuccess: refetchRegistrations,
    mutationFn: (registrationId: number) => {
      return httpService.put(`api/v1/registrations/${registrationId}/paid`, {});
    },
  });

  const unpaidMut = useMutation({
    onSuccess: refetchRegistrations,
    mutationFn: (registrationId: number) => {
      return httpService.put(
        `api/v1/registrations/${registrationId}/unpaid`,
        {},
      );
    },
  });

  const updateCostMut = useMutation({
    onSuccess() {
      refetchCost();
      closeCost();
    },
    mutationFn: (model: { matchId: number; cost: number }) => {
      return httpService.put(`api/v1/matches/${model.matchId}/costs`, {
        cost: model.cost,
      });
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex w-1/2 flex-col gap-3">
          <div>
            <Alert
              variant="light"
              color="pink"
              title="Cost Notification"
              icon={<FiDollarSign />}
            >
              Hey, today match cost is £{cost}, with additional costs is £
              {additionalCost}. We have {statTotalPlayer} players, so we each
              player need to pay £{individualCost}
            </Alert>
          </div>

          <div className="grid grid-cols-4 justify-between gap-3">
            <MatchFigure
              icon={<IoPersonSharp />}
              label="Total players"
              figure={statTotalPlayer?.toString()}
            ></MatchFigure>

            <MatchFigure
              icon={<IoCash />}
              label="Paid"
              figure={statPaid?.toString()}
            ></MatchFigure>

            <MatchFigure
              icon={<IoBan />}
              label="Unpaid"
              figure={statUnpaid?.toString()}
            ></MatchFigure>

            <MatchFigure
              icon={<IoBaseball />}
              label="Attendant percent"
              figure={`${statPercentage}%`}
            ></MatchFigure>

            <MatchFigure
              icon={<FiDollarSign />}
              label="Cost"
              figure={`£${cost ?? 0}`}
              onEdit={openCost}
            ></MatchFigure>

            <MatchFigure
              icon={<FaCashRegister />}
              label="Addtional Cost"
              figure={`£${additionalCost}`}
              onEdit={openAdditionalCost}
            ></MatchFigure>
          </div>
        </div>

        <div className="flex w-1/2 flex-col">
          {registrations &&
            registrations.map((reg) => {
              return (
                <div
                  key={reg.playerId}
                  className="grid grid-cols-3 items-center justify-center gap-x-2 rounded from-green-300 to-green-50 px-2 py-2 align-middle transition-all odd:bg-slate-50 hover:bg-gradient-to-r"
                >
                  <span>{reg.playerName}</span>
                  <div>
                    {!!reg.registrationId ? (
                      <ToggleButton
                        isActive={true}
                        activeColor="pink"
                        onClick={() => unregisterMut.mutate(reg.registrationId)}
                        icon={<IoHeartCircle />}
                      />
                    ) : (
                      <ToggleButton
                        activeColor="pink"
                        isActive={false}
                        onClick={() =>
                          registerMut.mutate({
                            matchId: match.matchId,
                            playerId: reg.playerId,
                          })
                        }
                        icon={<IoHeartCircle />}
                      />
                    )}
                  </div>

                  {!!reg.registrationId ? (
                    <div>
                      <ToggleButton
                        activeColor="green"
                        isActive={reg.isPaid}
                        onClick={() =>
                          reg.isPaid
                            ? unpaidMut.mutate(reg.registrationId)
                            : paidMut.mutate(reg.registrationId)
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
      </div>

      <Modal opened={costOpened} onClose={closeCost} title="Update Cost">
        <div className="flex flex-col gap-2">
          <NumberInput onChange={(val) => setCurrentCost(+val)} />
          <Button
            onClick={() =>
              updateCostMut.mutate({
                matchId: match.matchId,
                cost: currentCost,
              })
            }
          >
            Save
          </Button>
        </div>
      </Modal>

      <Modal
        opened={additionalCostOpened}
        onClose={closeAdditionalCost}
        title="Update Additional Costs"
      >
        <NumberInput />
      </Modal>
    </div>
  );
};

export default MatchListContent;
