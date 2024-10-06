import { Card, rem, Skeleton, Table, Tabs } from "@mantine/core";
import Page from "../../components/page";
import {
  IconMessageCircle,
  IconMoneybag,
  IconPhoto,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import httpService from "../../common/http-service";
import { UnpaidModel } from "../../models/reports/unpaid";
import Currency from "../../components/currency";

export default function Reporting() {
  const iconStyle = { width: rem(12), height: rem(12) };

  const {
    isPending,
    data: unpaidData,
    refetch,
  } = useQuery({
    queryKey: ["getUnpaidReport"],
    queryFn: () => httpService.get<UnpaidModel[]>("api/v1/reports/unpaid"),
  });

  return (
    <Page title="Reports">
      <Tabs defaultValue="unpaid">
        <Tabs.List>
          <Tabs.Tab
            value="unpaid"
            title="Unpaid Report"
            leftSection={<IconMoneybag style={iconStyle} />}
          >
            Unpaid Report
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="unpaid">
          <Table striped withRowBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Match Count</Table.Th>
                <Table.Th>Unpaid Amount</Table.Th>
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
                    </Table.Tr>
                  );
                })}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
      </Tabs>
    </Page>
  );
}
