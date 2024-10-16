import { Skeleton, Table } from "@mantine/core";
import { FC } from "react";

interface Props {
  row: number;
  col: number;
}

const DataTableSkeleton: FC<Props> = ({ row, col }) => {
  return [...Array(row)].map((_, index) => (
    <Table.Tr>
      {[...Array(col)].map((_, index) => (
        <Table.Td key={index}>
          <Skeleton height={20} />
        </Table.Td>
      ))}
    </Table.Tr>
  ));
};

export default DataTableSkeleton;
