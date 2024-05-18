import httpClient from "../../common/httpClient";
import Page from "../../components/page";
import { ActionIcon, Button, Drawer, Table, TextInput } from "@mantine/core";
import { FaPlusSquare, FaSave, FaTrash } from "react-icons/fa";
import { PlayerModel } from "./models";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const schema = z.object({
  firstName: z.string({ message: "First name is required" }).min(1),
  lastName: z.string({ message: "Last name is required" }).min(1),
});

function Players() {
  const [opened, { open, close }] = useDisclosure(false);

  const {
    isPending,
    data: players,
    refetch,
  } = useQuery({
    queryKey: ["get_players"],
    queryFn: () => httpClient.get<PlayerModel[]>("api/v1/players"),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: null,
      lastName: null,
    },
    validate: zodResolver(schema),
  });

  return (
    <>
      <Page title="Players Management">
        <div>
          <Button
            leftSection={<FaPlusSquare />}
            variant="default"
            onClick={open}
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
            {players?.map((item) => {
              return (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.firstName}</Table.Td>
                  <Table.Td>{item.lastName}</Table.Td>
                  <Table.Td className="text-right">
                    <ActionIcon color="red">
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
        onClose={close}
        title="Create Player"
      >
        <form
          onSubmit={form.onSubmit(async (model) => {
            await httpClient.post("api/v1/players", model);
            form.reset();
            refetch();
            close();
          })}
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
