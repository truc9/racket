import { Button, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import clsx from "clsx";
import { useMemo } from "react";
import httpService from "../../common/httpservice";
import Currency from "../../components/currency";
import DataTableSkeleton from "../../components/skeleton/data-table-skeleton";
import { UnpaidModel } from "../../models/reports/unpaid";
import { FiCheckCircle } from "react-icons/fi";
import { modals } from "@mantine/modals";
import { IoWarning } from "react-icons/io5";
import { notifications } from "@mantine/notifications";

export default function OutstandingPayments() {
  const { isPending, data, refetch } = useQuery({
    queryKey: ["getUnpaidReport"],
    queryFn: () => httpService.get<UnpaidModel[]>("api/v1/reports/unpaid"),
  });

  const totalUnpaid = useMemo(() => {
    if (!data || data.length == 0) return 0;
    return data.map((e) => e.unpaidAmount).reduce((prev, cur) => (cur += prev));
  }, [data]);

  const markPaid = (model: UnpaidModel) => {
    modals.openConfirmModal({
      title: "Mark as Paid",
      centered: true,
      children: (
        <Text>
          <span>
            Are you sure, this will mark {model.playerName} paid all outstanding
            payments ?
          </span>
          <p className="flex items-center gap-2 font-bold text-red-500">
            <IoWarning size={20} /> This action is irreversible
          </p>
        </Text>
      ),
      labels: { confirm: "Yes", cancel: "No" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await httpService.put(
          `api/v1/players/${model.playerId}/outstanding-payments/paid`,
          null,
        );
        notifications.show({
          title: "Success",
          message: `Mark player ${model.playerName} paid all outstanding payments successfully`,
          color: "green",
        });
        refetch();
      },
    });
  };

  return (
    <Table striped highlightOnHover withRowBorders={false}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Unpaid Amount</Table.Th>
          <Table.Th>Matches</Table.Th>
          <Table.Th>Summary</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {isPending && <DataTableSkeleton row={3} col={5} />}
        {data?.map((item) => {
          return (
            <Table.Tr key={item.playerId}>
              <Table.Td>{item.playerName}</Table.Td>
              <Table.Td
                className={clsx(
                  "font-bold",
                  item.unpaidAmount > 20 ? "text-rose-500" : "text-emerald-500",
                )}
              >
                <Currency value={item.unpaidAmount} />
              </Table.Td>
              <Table.Td>{item.matchCount}</Table.Td>
              <Table.Td>{item.registrationSummary}</Table.Td>
              <Table.Td className="flex-end flex justify-end space-x-2 text-right">
                <Button
                  size="xs"
                  leftSection={<FiCheckCircle size={18} />}
                  color="green"
                  onClick={() => markPaid(item)}
                >
                  Mark Paid
                </Button>
              </Table.Td>
            </Table.Tr>
          );
        })}
        {totalUnpaid > 0 && (
          <Table.Tr className="font-bold">
            <Table.Td>Total</Table.Td>
            <Table.Td>
              <Currency value={totalUnpaid} />
            </Table.Td>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}
