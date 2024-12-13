import { Button, Table } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";

import { FiTrash } from "react-icons/fi";
import { useApi } from "../../hooks/useApi";
import { ShareUrlModel } from "./models";
import DataTableSkeleton from "../../components/skeleton/data-table-skeleton";
import { QRCodeSVG } from "qrcode.react";

export default function ShareCodes() {
  const { get, del } = useApi();

  const { data, refetch, isPending } = useQuery({
    queryKey: ["getShareUrls"],
    queryFn: () => get<ShareUrlModel[]>("api/v1/share-codes/urls"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => del(`api/v1/share-codes/urls/${id}`),
  });

  return (
    <Table striped highlightOnHover withRowBorders={false}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>QR Code</Table.Th>
          <Table.Th>URL</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {isPending ? (
          <DataTableSkeleton row={3} col={3} />
        ) : (
          data?.map((item) => {
            return (
              <Table.Tr key={item.id}>
                <Table.Td>
                  <QRCodeSVG value={item.fullUrl} />
                </Table.Td>
                <Table.Td>{item.fullUrl}</Table.Td>
                <Table.Td>
                  <Button
                    leftSection={<FiTrash size={18} />}
                    color="red"
                    onClick={async () => {
                      await deleteMut.mutateAsync(item.id);
                      await refetch();
                    }}
                  >
                    Delete
                  </Button>
                </Table.Td>
              </Table.Tr>
            );
          })
        )}
      </Table.Tbody>
    </Table>
  );
}
