import httpClient from "../../common/httpClient";
import Page from "../../components/page";
import { Badge } from "@mantine/core";
import { useEffect, useState } from "react";

const Health = () => {
  const [status, setStatus] = useState<any>();
  useEffect(() => {
    load();

    async function load() {
      const res = await httpClient.get("health");
      console.log(res);
      setStatus(res);
    }
  }, []);

  return (
    <Page title="Health">
      <div className="flex items-center gap-3">
        <span>API Health: </span>
        <Badge className="uppercase">{status && status.message}</Badge>
      </div>
    </Page>
  );
};

export default Health;
