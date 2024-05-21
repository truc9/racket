import httpClient from "../../common/httpClient";
import Page from "../../components/page";
import { FaPlusSquare, FaSave, FaTrash, FaUserEdit } from "react-icons/fa";
import { PlayerModel } from "./models";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ActionIcon,
  Button,
  Drawer,
  Skeleton,
  Table,
  TextInput,
} from "@mantine/core";

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
    refetch: refetchPlayers,
  } = useQuery({
    queryKey: ["getPlayers"],
    queryFn: () => httpClient.get<PlayerModel[]>("api/v1/players"),
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: (model: PlayerModel) => {
      if (model.id) {
        return httpClient.put(`api/v1/players/${model.id}`, model);
      }
      return httpClient.post("api/v1/players", model);
    },
    onSuccess(data, variables, context) {
      form.reset();
      refetchPlayers();
      closeDrawer();
    },
  });

  const editClick = (model: PlayerModel) => {
    form.setValues(model);
    openDrawer();
  };

  const deleteClick = (model: PlayerModel) => {};

  return (
    <>
      <Page title="Players Management">
        <div>
          <Button
            leftSection={<FaPlusSquare />}
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
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isPending && <Skeleton />}
            {!isPending &&
              players?.map((item) => {
                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.firstName}</Table.Td>
                    <Table.Td>{item.lastName}</Table.Td>
                    <Table.Td className="flex items-center justify-end gap-2">
                      <ActionIcon onClick={() => editClick(item)}>
                        <FaUserEdit />
                      </ActionIcon>
                      <ActionIcon
                        color="orange"
                        onClick={() => deleteClick(item)}
                      >
                        <FaTrash />
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
          <Button leftSection={<FaSave />} type="submit">
            Save changes
          </Button>
        </form>
      </Drawer>
    </>
  );
}

export default Players;
