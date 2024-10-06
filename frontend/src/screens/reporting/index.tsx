import { rem, Skeleton, Tabs } from "@mantine/core";
import { IconMoneybag } from "@tabler/icons-react";
import { lazy, Suspense } from "react";
import Page from "../../components/page";

const UnpaidReport = lazy(() => import("./unpaid"));

export default function Reporting() {
  const iconStyle = { width: rem(12), height: rem(12) };

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
          <Suspense fallback={<Skeleton />}>
            <UnpaidReport />
          </Suspense>
        </Tabs.Panel>
      </Tabs>
    </Page>
  );
}
