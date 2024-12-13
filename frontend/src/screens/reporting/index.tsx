import { rem, Tabs } from "@mantine/core";
import { IconMoneybag, IconTimeline } from "@tabler/icons-react";
import { lazy, Suspense, useState } from "react";
import Page from "../../components/page";
import SectionLoading from "../../components/section-loading";

type TabType = "unpaid" | "activity-log" | "share-codes";

const Unpaid = lazy(() => import("./unpaid"));
const ActivityLogs = lazy(() => import("./activity-log"));
const ShareCodes = lazy(() => import("./sharecodes"));

export default function Reporting() {
  const iconStyle = { width: rem(16), height: rem(16) };
  const [tab, setTab] = useState<TabType>("unpaid");

  return (
    <Page title="Reports">
      <Tabs defaultValue="unpaid">
        <Tabs.List>
          <Tabs.Tab
            value="unpaid"
            leftSection={<IconMoneybag style={iconStyle} />}
            onClick={() => setTab("unpaid")}
          >
            Unpaid
          </Tabs.Tab>
          <Tabs.Tab
            value="activity-log"
            leftSection={<IconTimeline style={iconStyle} />}
            onClick={() => setTab("activity-log")}
          >
            Activities
          </Tabs.Tab>
          <Tabs.Tab
            value="share-codes"
            leftSection={<IconTimeline style={iconStyle} />}
            onClick={() => setTab("share-codes")}
          >
            Share Codes
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={tab}>
          <Suspense fallback={<SectionLoading />}>
            {tab === "unpaid" && <Unpaid />}
            {tab === "activity-log" && <ActivityLogs />}
            {tab === "share-codes" && <ShareCodes />}
          </Suspense>
        </Tabs.Panel>
      </Tabs>
    </Page>
  );
}
