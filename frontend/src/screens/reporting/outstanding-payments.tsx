import { Skeleton, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import httpService from "../../common/http-service";
import Currency from "../../components/currency";
import { UnpaidModel } from "../../models/reports/unpaid";
import clsx from "clsx";

export default function OutstandingPayments() {
  const { isPending, data } = useQuery({
    queryKey: ["getUnpaidReport"],
    queryFn: () => httpService.get<UnpaidModel[]>("api/v1/reports/unpaid"),
  });

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
        {isPending && <Skeleton />}
        {!isPending &&
          data?.map((item) => {
            return (
              <Table.Tr key={item.playerId}>
                <Table.Td>{item.playerName}</Table.Td>
                <Table.Td
                  className={clsx(
                    "font-bold",
                    item.unpaidAmount > 100
                      ? "text-rose-500"
                      : "text-emerald-500",
                  )}
                >
                  <Currency value={item.unpaidAmount} />
                </Table.Td>
                <Table.Td>{item.matchCount}</Table.Td>
                <Table.Td>{item.registrationSummary}</Table.Td>
              </Table.Tr>
            );
          })}
      </Table.Tbody>
    </Table>
  );
}
