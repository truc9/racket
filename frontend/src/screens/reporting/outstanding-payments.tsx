import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import clsx from "clsx";
import { useMemo } from "react";
import httpService from "../../common/httpservice";
import Currency from "../../components/currency";
import DataTableSkeleton from "../../components/skeleton/data-table-skeleton";
import { UnpaidModel } from "../../models/reports/unpaid";

export default function OutstandingPayments() {
  const { isPending, data } = useQuery({
    queryKey: ["getUnpaidReport"],
    queryFn: () => httpService.get<UnpaidModel[]>("api/v1/reports/unpaid"),
  });

  const totalUnpaid = useMemo(() => {
    if (!data || data.length == 0) return 0;
    return data.map((e) => e.unpaidAmount).reduce((prev, cur) => (cur += prev));
  }, [data]);

  return (
    <Table striped highlightOnHover withRowBorders={false}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Unpaid Amount</Table.Th>
          <Table.Th>Matches</Table.Th>
          <Table.Th>Summary</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {isPending && <DataTableSkeleton row={3} col={4} />}
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
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}
