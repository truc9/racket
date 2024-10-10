import { rem, Skeleton, Tabs } from "@mantine/core";
import { IconMoneybag, IconTimeline } from "@tabler/icons-react";
import { lazy, Suspense } from "react";
import Page from "../../components/page";

const OutstandingPayments = lazy(() => import("./outstanding-payments"));
const ActivityLogs = lazy(() => import("./activity-log"));

export default function Reporting() {
  const iconStyle = { width: rem(16), height: rem(16) };

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
          <Tabs.Tab
            value="activity-log"
            leftSection={<IconTimeline style={iconStyle} />}
          >
            Activities
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="outstanding-payment">
          <OutstandingPayments />
        </Tabs.Panel>
        <Tabs.Panel value="activity-log">
          <ActivityLogs />
        </Tabs.Panel>
      </Tabs>
    </Page>
  );
}
