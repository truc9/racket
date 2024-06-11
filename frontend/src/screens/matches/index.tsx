import {
  ActionIcon,
  Button,
  Drawer,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { zodResolver } from "@mantine/form";
import { IoAdd, IoPencil, IoSave, IoTrash } from "react-icons/io5";
import { z } from "zod";
import httpService from "../../common/http-service";
import Page from "../../components/page";
import { useSportCenterValueLabelQuery } from "../../hooks/useQueries";
import { CreateOrUpdateMatchModel } from "../../models";
import { MatchModel } from "./models";

const schema = z.object({
  matchId: z.number().nullable(),
  start: z.date({ message: "Start date is required" }),
  end: z.date({ message: "End date is required" }),
  sportCenterId: z.string({ message: "Sport center is required" }),
  court: z.string(),
});

function Matches() {
  const [
    isMatchDrawerOpened,
    { open: openMatchDrawer, close: closeMatchDrawer },
  ] = useDisclosure(false);

  const { data: matches, refetch } = useQuery({
    queryKey: ["getMatches"],
    queryFn: () => httpService.get<MatchModel[]>("api/v1/matches"),
  });

  const { data: sportCenterOptions } = useSportCenterValueLabelQuery();

  const form = useForm<CreateOrUpdateMatchModel>({
    mode: "uncontrolled",
    initialValues: {
      matchId: null,
      start: dayjs(new Date()).set("hour", 9).set("minute", 0).toDate(),
      end: dayjs(new Date()).set("hour", 11).set("minute", 0).toDate(),
      // Mantine <Select/> received default value as string
      sportCenterId: "0",
      court: "",
    },
    validate: zodResolver(schema),
  });

  const deleteMatch = (matchId: number) =>
    modals.openConfirmModal({
      title: "Delete your match",
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete this match. This action is
          irreversable!
        </Text>
      ),
      labels: { confirm: "Delete Match", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await httpService.del(`api/v1/matches/${matchId}`);
        refetch();
      },
    });

  const editMatch = (match: MatchModel) => {
    console.log(match);
    form.setValues({
      matchId: match.matchId,
      start: new Date(match.start),
      end: new Date(match.end),
      sportCenterId: match.sportCenterId.toString(),
      court: match.court,
    });
    openMatchDrawer();
  };

  return (
    <>
      <Page title="Matches Management">
        <div>
          <Button
            leftSection={<IoAdd />}
            variant="default"
            onClick={openMatchDrawer}
          >
            Create Match
          </Button>
        </div>
        <Table striped withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Sport Center</Table.Th>
              <Table.Th>Court</Table.Th>
              <Table.Th>Start</Table.Th>
              <Table.Th>End</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {matches &&
              matches.map((item) => {
                return (
                  <Table.Tr key={item.matchId}>
                    <Table.Td>{item.sportCenterName || "N/A"}</Table.Td>
                    <Table.Td>{item.court || "N/A"}</Table.Td>
                    <Table.Td>
                      {dayjs(item.start).format("DD/MM/YYYY hh:mm:ss")}
                    </Table.Td>
                    <Table.Td>
                      {item.end &&
                        dayjs(item.end).format("DD/MM/YYYY hh:mm:ss")}
                    </Table.Td>
                    <Table.Td className="flex-end flex justify-end space-x-2 text-right">
                      <ActionIcon
                        size="lg"
                        color="blue"
                        onClick={() => editMatch(item)}
                      >
                        <IoPencil />
                      </ActionIcon>
                      <ActionIcon
                        size="lg"
                        onClick={() => deleteMatch(item.matchId!)}
                        color="red"
                      >
                        <IoTrash />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </Page>
      <Drawer
        position="right"
        opened={isMatchDrawerOpened}
        onClose={closeMatchDrawer}
        title="Create Match"
      >
        <form
          onSubmit={form.onSubmit(async (model) => {
            if (model.matchId) {
              console.log(
                `Updating match ${model.matchId} with values ${JSON.stringify(model)}`,
              );
              await httpService.put(`api/v1/matches/${model.matchId}`, model);
            } else {
              await httpService.post("api/v1/matches", {
                model,
                sportCenterId: +model.sportCenterId,
              });
            }
            refetch();
            form.reset();
            closeMatchDrawer();
          })}
          className="flex flex-col gap-2"
        >
          <DateTimePicker
            label="Start (date/time)"
            required
            {...form.getInputProps("start")}
          />
          <DateTimePicker
            label="End (date/time)"
            required
            {...form.getInputProps("end")}
          />
          <TextInput
            label="Court"
            placeholder="Add court..."
            {...form.getInputProps("court")}
          />
          <Select
            label="Sport center"
            placeholder="Pick value"
            data={sportCenterOptions}
            nothingFoundMessage="No sport center"
            clearable
            searchable
            {...form.getInputProps("sportCenterId")}
          />

          <Button variant="default" leftSection={<IoSave />} type="submit">
            Save changes
          </Button>
        </form>
      </Drawer>
    </>
  );
}

export default Matches;
