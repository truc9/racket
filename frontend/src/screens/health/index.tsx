import httpService from "../../common/httpservice";
import Page from "../../components/page";
import { Badge } from "@mantine/core";
import { useEffect, useState } from "react";

const Health = () => {
  const [status, setStatus] = useState<any>();
  useEffect(() => {
    load();

    async function load() {
      try {
        const res = await httpService.get("health");
        setStatus(res);
      } catch (err) {
        setStatus(null);
      }
    }
  }, []);

  return (
    <Page title="Health">
      <div className="flex items-center gap-3">
        <span>API Health: </span>
        {status && (
          <Badge color="green" className="uppercase">
            {status.message}
          </Badge>
        )}
        {!status && (
          <Badge className="uppercase" color="orange">
            Unhealthy
          </Badge>
        )}
      </div>
    </Page>
  );
};

export default Health;
