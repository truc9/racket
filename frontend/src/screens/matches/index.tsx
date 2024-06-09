import { ActionIcon, Button, Drawer, Select, Table, Text } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { zodResolver } from "mantine-form-zod-resolver";
import { IoAdd, IoSave, IoTrash } from "react-icons/io5";
import { z } from "zod";
import httpService from "../../common/http-service";
import Page from "../../components/page";
import { useSportCenterValueLabelQuery } from "../../hooks/useQueries";
import { MatchModel } from "./models";

const schema = z.object({
  start: z.date({ message: "Start date is required" }),
  end: z.date({ message: "End date is required" }),
  sportCenterId: z.string({ message: "Sport center is required" }),
});

function Matches() {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: matches, refetch } = useQuery({
    queryKey: ["getMatches"],
    queryFn: () => httpService.get<MatchModel[]>("api/v1/matches"),
  });

  const { data: sportCenterOptions } = useSportCenterValueLabelQuery();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      start: dayjs(new Date()).set("hour", 9).set("minute", 0).toDate(),
      end: dayjs(new Date()).set("hour", 11).set("minute", 0).toDate(),
      sportCenterId: "0",
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

  return (
    <>
      <Page title="Matches Management">
        <div>
          <Button leftSection={<IoAdd />} variant="default" onClick={open}>
            Create Match
          </Button>
        </div>
        <Table striped withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Sport Center</Table.Th>
              <Table.Th>Start</Table.Th>
              <Table.Th>End</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {matches?.map((item) => {
              return (
                <Table.Tr key={item.matchId}>
                  <Table.Td>{item.sportCenterName || "N/A"}</Table.Td>
                  <Table.Td>
                    {dayjs(item.start).format("DD/MM/YYYY hh:mm:ss")}
                  </Table.Td>
                  <Table.Td>
                    {item.end && dayjs(item.end).format("DD/MM/YYYY hh:mm:ss")}
                  </Table.Td>
                  <Table.Td className="text-right">
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
        opened={opened}
        onClose={close}
        title="Create Match"
      >
        <form
          onSubmit={form.onSubmit(async (model) => {
            await httpService.post("api/v1/matches", {
              ...model,
              sportCenterId: +model.sportCenterId,
            });
            refetch();
            form.reset();
            close();
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
          <Select
            defaultValue={form.getInputProps("sportCenterId")}
            label="Sport center"
            placeholder="Pick value"
            data={sportCenterOptions}
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
