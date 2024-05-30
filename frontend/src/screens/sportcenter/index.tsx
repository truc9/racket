import httpService from "../../common/http-service";
import Page from "../../components/page";
import { IoAdd, IoPencil, IoSave } from "react-icons/io5";
import { SportCenterModel } from "../../models";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ActionIcon,
  Button,
  Modal,
  Skeleton,
  Table,
  TextInput,
} from "@mantine/core";

const schema = z.object({
  id: z.number().nullable(),
  name: z.string({ message: "Name is required" }).min(1),
  location: z.string({ message: "Location is required" }).min(1),
});

export default function SportCenter() {
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: 0,
      name: "",
      location: "",
    },
    validate: zodResolver(schema),
  });

  const {
    isPending,
    data: sportCenters,
    refetch,
  } = useQuery({
    queryKey: ["getSportCenters"],
    queryFn: () => httpService.get<SportCenterModel[]>("api/v1/sportcenters"),
  });

  const mutation = useMutation({
    mutationFn: (model: SportCenterModel) => {
      if (model.id) {
        return httpService.put(`api/v1/sportcenters/${model.id}`, model);
      }
      return httpService.post("api/v1/sportcenters", model);
    },
    onSuccess() {
      form.reset();
      refetch();
      closeModal();
    },
  });

  const editClick = (model: SportCenterModel) => {
    form.setValues(model);
    openModal();
  };

  return (
    <>
      <Page title="Sport Center Management">
        <div>
          <Button leftSection={<IoAdd />} variant="default" onClick={openModal}>
            Create Sport Center
          </Button>
        </div>
        <Table striped withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isPending && <Skeleton />}
            {!isPending &&
              sportCenters?.map((item) => {
                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.location}</Table.Td>
                    <Table.Td className="flex items-center justify-end gap-2">
                      <ActionIcon onClick={() => editClick(item)} size="lg">
                        <IoPencil />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </Page>

      <Modal opened={opened} onClose={closeModal} title="Sport Center">
        <form
          onSubmit={form.onSubmit((model) => mutation.mutate(model))}
          className="flex flex-col gap-2"
        >
          <TextInput label="Name" {...form.getInputProps("name")} />
          <TextInput label="Location" {...form.getInputProps("location")} />
          <Button leftSection={<IoSave />} type="submit">
            Save changes
          </Button>
        </form>
      </Modal>
    </>
  );
}
