import { TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { IoCalendarOutline, IoSearch } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import Currency from "../../components/currency";
import { useApi } from "../../hooks/useApi";
import { UnpaidModel } from "../../models/reports/unpaid";
import SectionLoading from "../../components/section-loading";

export default function Page() {
  const { get } = useApi();
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const shareCode = searchParams.get("share-code");
  const { isLoading, isPending, data, isError, refetch } = useQuery({
    retry: false,
    queryKey: ["getPublicUnpaidReport"],
    queryFn: async () => {
      const res = await get<UnpaidModel[]>(
        `api/v1/public/reports/unpaid?shareCode=${shareCode}`,
      );
      //TODO: return raw from API
      return res.map((model) => {
        return {
          ...model,
          dates: model.registrationSummary.split(",").map((d) => {
            const segments = d.split(":");
            return {
              date: segments[0],
              cost: segments[1],
            };
          }),
        };
      });
    },
  });

  const isDone = useMemo(() => {
    return !isLoading && !isPending && !!data;
  }, [isLoading, isPending, data]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const normalize = (input: string) => {
    return input
      .normalize("NFD") // Decompose combined characters (e.g., "é" → "é")
      .replace(/[\u0300-\u036f]/g, ""); // Remove diacritical marks
  };

  const filterPlayers = useMemo(() => {
    if (search) {
      return data?.filter((item) =>
        normalize(item.playerName.toLowerCase()).includes(
          normalize(search.toLowerCase()),
        ),
      );
    }
    return data;
  }, [search, data]);

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
    <div className="m-auto flex flex-col justify-center gap-2 p-2 lg:w-1/2 xl:w-1/4">
      <TextInput
        leftSection={<IoSearch size={28} />}
        size="lg"
        placeholder="Search player..."
        onChange={handleSearch}
      />
      {!isDone ? (
        <div className="py-5">
          <SectionLoading />
        </div>
      ) : (
        filterPlayers?.map((item) => {
          return (
            <div key={item.playerId} className="rounded bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3 text-xl">
                <div className="font-bold">{item.playerName}</div>
                <div className="flex-1 border-[0.5px] border-dashed border-slate-500"></div>
                <div className="font-bold text-purple-500">
                  <Currency value={item.unpaidAmount} />
                </div>
              </div>

              <div>
                {item.dates.map((record, i) => {
                  return (
                    <div
                      key={i}
                      className="text- flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-center gap-1">
                        <IoCalendarOutline />
                        {record.date}
                      </div>
                      <div>{record.cost}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
