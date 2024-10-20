import {
  ActionIcon,
  Button,
  Drawer,
  Skeleton,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoAdd, IoMail, IoPencil, IoSave, IoTrash } from "react-icons/io5";
import { z } from "zod";
import formatter from "../../common/formatter";
import httpService from "../../common/httpservice";
import Page from "../../components/page";
import { PlayerSummaryModel, UpdatePlayerModel } from "./models";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import DataTableSkeleton from "../../components/skeleton/data-table-skeleton";

const schema = z.object({
  id: z.number().nullable(),
  firstName: z.string({ message: "First name is required" }).min(1),
  lastName: z.string({ message: "Last name is required" }).min(1),
});

function Players() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: 0,
      firstName: "",
      lastName: "",
    },
    validate: zodResolver(schema),
  });

  const [opened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const {
    isPending,
    data: players,
    refetch,
  } = useQuery({
    queryKey: ["getPlayers"],
    queryFn: () => httpService.get<PlayerSummaryModel[]>("api/v1/players"),
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: (model: UpdatePlayerModel) => {
      if (model.id) {
        return httpService.put(`api/v1/players/${model.id}`, model);
      }
      return httpService.post("api/v1/players", model);
    },
    onSuccess(_data, _variables, _context) {
      form.reset();
      refetch();
      closeDrawer();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (model: PlayerSummaryModel) => {
      return httpService.del(`api/v1/players/${model.id}`);
    },
    onSuccess(_data, _variables, _context) {
      refetch();
    },
    onError(err, _) {
      notifications.show({
        title: "Error",
        message: "Unable to delete player.",
        color: "red",
      });
    },
  });

  const editClick = (model: PlayerSummaryModel) => {
    form.setValues(model);
    openDrawer();
  };

  const deleteClick = (model: PlayerSummaryModel) => {
    modals.openConfirmModal({
      title: "Delete Player ?",
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete {model.firstName}. This action is
          irreversable!
        </Text>
      ),
      labels: { confirm: "Yes", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        deleteMutation.mutate(model);
      },
    });
  };

  const sendWelcomeEmail = async (model: PlayerSummaryModel) => {
    await httpService.post(`api/v1/players/${model.id}/welcome-email`, {
      to: [model.email],
    });
  };

  return (
    <>
      <Page title="Players Management">
        <div>
          <Button
            leftSection={<IoAdd />}
            variant="default"
            onClick={openDrawer}
          >
            Create Player
          </Button>
        </div>
        <Table striped withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>First Name</Table.Th>
              <Table.Th>Last Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>SSO</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isPending && <DataTableSkeleton row={3} col={6} />}
            {!isPending &&
              players?.map((item) => {
                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.firstName}</Table.Td>
                    <Table.Td>{item.lastName}</Table.Td>
                    <Table.Td>{item.email}</Table.Td>
                    <Table.Td>{formatter.formatDate(item.createdAt)}</Table.Td>
                    <Table.Td>
                      {item.externalUserId?.substring(
                        0,
                        item.externalUserId.lastIndexOf("|"),
                      )}
                    </Table.Td>
                    <Table.Td className="flex items-center justify-end gap-2">
                      <Tooltip label="Welcome Email" position="top">
                        <ActionIcon
                          disabled={!item.email}
                          color="pink"
                          onClick={() => sendWelcomeEmail(item)}
                          size="lg"
                        >
                          <IoMail />
                        </ActionIcon>
                      </Tooltip>

                      <ActionIcon onClick={() => editClick(item)} size="lg">
                        <IoPencil />
                      </ActionIcon>

                      <ActionIcon
                        size="lg"
                        color="red"
                        onClick={() => deleteClick(item)}
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
        onClose={closeDrawer}
        title="Create Player"
      >
        <form
          onSubmit={form.onSubmit((model) =>
            createOrUpdateMutation.mutate(model),
          )}
          className="flex flex-col gap-2"
        >
          <TextInput label="First name" {...form.getInputProps("firstName")} />
          <TextInput label="Last name" {...form.getInputProps("lastName")} />
          <Button leftSection={<IoSave />} type="submit">
            Save changes
          </Button>
        </form>
      </Drawer>
    </>
  );
}

export default Players;
