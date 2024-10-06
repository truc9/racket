import { rem, Skeleton, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import httpService from "../../common/http-service";
import Currency from "../../components/currency";
import { UnpaidModel } from "../../models/reports/unpaid";

export default function Unpaid() {
  const {
    isPending,
    data: unpaidData,
    refetch,
  } = useQuery({
    queryKey: ["getUnpaidReport"],
    queryFn: () => httpService.get<UnpaidModel[]>("api/v1/reports/unpaid"),
  });

  return (
    <Table striped withRowBorders={false}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Match Count</Table.Th>
          <Table.Th>Unpaid Amount</Table.Th>
          <Table.Th>Summary</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {isPending && <Skeleton />}
        {!isPending &&
          unpaidData?.map((item) => {
            return (
              <Table.Tr key={item.playerId}>
                <Table.Td>{item.playerName}</Table.Td>
                <Table.Td>{item.matchCount}</Table.Td>
                <Table.Td>
                  <Currency value={item.unpaidAmount} />
                </Table.Td>
                <Table.Td>{item.registrationSummary}</Table.Td>
              </Table.Tr>
            );
          })}
      </Table.Tbody>
    </Table>
  );
}
