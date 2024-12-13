import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import DataTableSkeleton from "../../components/skeleton/data-table-skeleton";
import { UnpaidModel } from "../../models/reports/unpaid";
import Currency from "../../components/currency";
import clsx from "clsx";
import { useApi } from "../../hooks/useApi";

export default function Page() {
  const { get } = useApi();
  const [searchParams] = useSearchParams();
  const shareCode = searchParams.get("share-code");
  const { isPending, data, isError } = useQuery({
    retry: false,
    queryKey: ["getPublicUnpaidReport"],
    queryFn: () =>
      get<UnpaidModel[]>(`api/v1/public/reports/unpaid?shareCode=${shareCode}`),
  });

  const totalUnpaid = useMemo(() => {
    if (!data || data.length == 0) return 0;
    return data.map((e) => e.unpaidAmount).reduce((prev, cur) => (cur += prev));
  }, [data]);

  //TODO: check 403 instead of isError
  if (isError) {
    return (
      <div className="flex flex-col items-center text-center">
        <iframe
          src="https://giphy.com/embed/gj0QdZ9FgqGhOBNlFS"
          width="378"
          height="480"
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        ></iframe>
        <p>
          <a href="https://giphy.com/gifs/lol-laugh-laughing-gj0QdZ9FgqGhOBNlFS">
            via GIPHY
          </a>
        </p>
        <h3 className="text-2xl font-bold text-violet-500">
          Oops! This URL is invalidated! Please contact admin to publish a new
          one.
        </h3>
      </div>
    );
  }

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
