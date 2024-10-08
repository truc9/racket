import { rem, Skeleton, Tabs } from "@mantine/core";
import { IconMoneybag } from "@tabler/icons-react";
import { lazy, Suspense } from "react";
import Page from "../../components/page";

const OutstandingPayments = lazy(() => import("./outstanding-payments"));

export default function Reporting() {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Page title="Reports">
      <Tabs defaultValue="outstanding-payment">
        <Tabs.List>
          <Tabs.Tab
            value="outstanding-payment"
            leftSection={<IconMoneybag style={iconStyle} />}
          >
            Outstanding Payments
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="outstanding-payment">
          <Suspense fallback={<Skeleton />}>
            <OutstandingPayments />
          </Suspense>
        </Tabs.Panel>
      </Tabs>
    </Page>
  );
}
