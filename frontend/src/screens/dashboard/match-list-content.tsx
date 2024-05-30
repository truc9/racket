import httpService from "../../common/http-service";
import MatchFigure from "./match-figure";
import React, { useMemo } from "react";
import ToggleButton from "../../components/toggle-button";
import { Alert, Modal, NumberInput } from "@mantine/core";
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

interface Prop {
  match: MatchSummaryModel;
}

const MatchListContent: React.FC<Prop> = ({ match }) => {
  const [costOpened, { open: openCost, close: closeCost }] =
    useDisclosure(false);

  const [
    additionalCostOpened,
    { open: openAdditionalCost, close: closeAdditionalCost },
  ] = useDisclosure(false);

  const { data: registrations, refetch } = useRegistrationsByMatchQuery(
    match.matchId,
  );

  const { data: cost } = useMatchCostQuery(match.matchId);
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
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. At
              officiis, quae tempore necessitatibus placeat saepe.
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
      </div>

      <Modal opened={costOpened} onClose={closeCost} title="Update Cost">
        <NumberInput />
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
