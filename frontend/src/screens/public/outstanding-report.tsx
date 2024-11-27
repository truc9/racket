import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import httpService from "../../common/httpservice";
import DataTableSkeleton from "../../components/skeleton/data-table-skeleton";
import { UnpaidModel } from "../../models/reports/unpaid";
import Currency from "../../components/currency";
import clsx from "clsx";

export default function Page() {
  const [searchParams] = useSearchParams();
  const shareCode = searchParams.get("share-code");

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["getPublicUnpaidReport"],
    queryFn: () =>
      httpService.get<UnpaidModel[]>(
        `api/v1/public/reports/unpaid?shareCode=${shareCode}`,
      ),
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
          <Table.Th>Attendant Count</Table.Th>
          <Table.Th>Synthetic Costs</Table.Th>
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
