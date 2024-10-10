import { rem, Tabs } from "@mantine/core";
import { IconMoneybag, IconTimeline } from "@tabler/icons-react";
import { lazy, Suspense, useState } from "react";
import Page from "../../components/page";
import Loading from "../../components/loading";

type TabType = "outstanding-payment" | "activity-log";

const OutstandingPayments = lazy(() => import("./outstanding-payments"));
const ActivityLogs = lazy(() => import("./activity-log"));

export default function Reporting() {
  const iconStyle = { width: rem(16), height: rem(16) };
  const [tab, setTab] = useState<TabType>("outstanding-payment");

  return (
    <Page title="Reports">
      <Tabs defaultValue="outstanding-payment">
        <Tabs.List>
          <Tabs.Tab
            value="outstanding-payment"
            leftSection={<IconMoneybag style={iconStyle} />}
            onClick={() => setTab("outstanding-payment")}
          >
            Outstanding Payments
          </Tabs.Tab>
          <Tabs.Tab
            value="activity-log"
            leftSection={<IconTimeline style={iconStyle} />}
            onClick={() => setTab("activity-log")}
          >
            Activities
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={tab}>
          <Suspense fallback={<Loading />}>
            {tab === "outstanding-payment" && <OutstandingPayments />}
            {tab === "activity-log" && <ActivityLogs />}
          </Suspense>
        </Tabs.Panel>
      </Tabs>
    </Page>
  );
}
