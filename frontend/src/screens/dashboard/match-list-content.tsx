import { Alert, Button, Modal } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import cx from "clsx";
import React, { useMemo, useRef } from "react";
import { FaCashRegister } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import {
  IoBan,
  IoBaseball,
  IoCash,
  IoChatbox,
  IoCopy,
  IoHeartCircle,
  IoPersonSharp,
  IoTime,
} from "react-icons/io5";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import formatter from "../../common/formatter";
import httpService from "../../common/http-service";
import ToggleButton from "../../components/toggle-button";
import {
  useMatchAdditionalCostQuery,
  useMesssageTemplateQuery,
  useRegistrationsByMatchQuery,
} from "../../hooks/useQueries";
import {
  AdditionalCost,
  MatchSummaryModel,
  RegistrationModel,
} from "../../models";
import AdditionalCostEditor from "./additional-cost-editor";
import MatchFigure from "./match-figure";

interface Prop {
  match: MatchSummaryModel;
}

const MatchListContent: React.FC<Prop> = ({ match }) => {
  const clipboard = useClipboard({ timeout: 500 });
  const clipboardRef = useRef<HTMLDivElement>(null!);

  const [
    additionalCostOpened,
    { open: openAdditionalCost, close: closeAdditionalCost },
  ] = useDisclosure(false);

  const { data: registrations, refetch: reload } = useRegistrationsByMatchQuery(
    match.matchId,
  );

  const { data: additionalCost, refetch: reloadAdditionalCost } =
    useMatchAdditionalCostQuery(match.matchId);

  const { data: messageTemplate } = useMesssageTemplateQuery();

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
    const total = (match.cost ?? 0) + (additionalCost ?? 0);
    const totalPlayer =
      registrations?.filter((r) => !!r.registrationId)?.length ?? 0;
    return totalPlayer === 0 ? 0 : total / totalPlayer;
  }, [match.cost, additionalCost, registrations]);

  const handleSaveAdditionalCosts = async (costs: AdditionalCost[]) => {
    await httpService.put(
      `api/v1/matches/${match.matchId}/additional-costs`,
      costs,
    );
    closeAdditionalCost();
    reloadAdditionalCost();
  };

  const costMessage = useMemo(() => {
    const bindTemplate = (template: string, data: any) => {
      return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()]);
    };

    return bindTemplate(messageTemplate ?? "", {
      cost: match?.cost?.toFixed(2),
      customSection: match?.customSection,
      additionalCost: additionalCost?.toFixed(2),
      individualCost: individualCost?.toFixed(2),
      totalPlayer:
        registrations?.filter((r) => !!r.registrationId)?.length ?? 0,
    });
  }, [
    match?.cost,
    additionalCost,
    individualCost,
    registrations,
    messageTemplate,
  ]);

  const registerMut = useMutation({
    onSuccess: reload,
    mutationFn: (model: RegistrationModel) =>
      httpService.post("api/v1/registrations", model),
  });

  const unregisterMut = useMutation({
    onSuccess: reload,
    mutationFn: (registrationId: number) =>
      httpService.del(`api/v1/registrations/${registrationId}`),
  });

  const paidMut = useMutation({
    onSuccess: reload,
    mutationFn: (registrationId: number) => {
      return httpService.put(`api/v1/registrations/${registrationId}/paid`, {});
    },
  });

  const unpaidMut = useMutation({
    onSuccess: reload,
    mutationFn: (registrationId: number) => {
      return httpService.put(
        `api/v1/registrations/${registrationId}/unpaid`,
        {},
      );
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div>
            <Alert
              className="relative"
              variant="light"
              color="green"
              title="Message"
              icon={<IoChatbox />}
            >
              <div ref={clipboardRef}>
                <Markdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                >
                  {costMessage}
                </Markdown>
              </div>
              <Button
                className="absolute right-2 top-2"
                variant="light"
                leftSection={<IoCopy />}
                color={clipboard.copied ? "red" : "green"}
                onClick={() => clipboard.copy(clipboardRef.current.innerText)}
              >
                {clipboard.copied ? "Copied" : "Copy"}
              </Button>
            </Alert>
          </div>

          <div className="grid grid-cols-1 justify-between gap-3 md:grid-cols-2 xl:grid-cols-3">
            <MatchFigure
              icon={<IoTime />}
              label="Duration"
              figure={formatter.duration(match.start, match.end)}
            ></MatchFigure>

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
              figure={formatter.currency(match.cost ?? 0)}
            ></MatchFigure>

            <MatchFigure
              icon={<FaCashRegister />}
              label="Addtional cost"
              figure={formatter.currency(additionalCost ?? 0)}
              onActionClick={openAdditionalCost}
            ></MatchFigure>
          </div>
        </div>

        <div className="flex flex-col">
          {registrations &&
            registrations.map((reg) => {
              return (
                <div
                  key={reg.playerId}
                  className="grid grid-cols-3 items-center justify-center gap-x-2 rounded from-green-300 to-green-50 px-2 py-2 align-middle transition-all odd:bg-slate-50 hover:bg-gradient-to-r"
                >
                  <span className={cx({ "font-bold": !!reg.registrationId })}>
                    {reg.playerName || reg.email}
                  </span>
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

      <Modal
        opened={additionalCostOpened}
        onClose={closeAdditionalCost}
        title="Add Additional Cost"
      >
        <AdditionalCostEditor onSaveClick={handleSaveAdditionalCosts} />
      </Modal>
    </div>
  );
};

export default MatchListContent;
