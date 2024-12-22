import { Skeleton } from "@mantine/core";
import React from "react";
import { IoPlanetOutline } from "react-icons/io5";
import { MatchSummaryModel } from "../../models";
import MatchList from "./match-list";

interface Props {
  title: string;
  matches?: MatchSummaryModel[];
  isLoading?: boolean;
  icon?: React.ReactNode;
  expandFirstItem?: boolean;
}

const MatchSection: React.FC<Props> = ({
  title,
  matches,
  isLoading,
  icon,
  expandFirstItem,
}) => {
  const LoadingSkeleton = () => (
    <div className="flex items-center gap-2">
      <div>
        <Skeleton height={30} circle />
      </div>
      <Skeleton height={30} className="w-2/12" radius={100} />
      <Skeleton height={30} className="w-3/12" radius={100} />
      <Skeleton height={30} className="w-1/12" radius={100} />
      <Skeleton height={30} className="w-full" radius={100} />
      <Skeleton height={30} className="w-2/12" radius={100} />
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2 text-lg font-bold">
        {icon || <IoPlanetOutline />}
        <h3>{title}</h3>
      </div>
      {isLoading && (
        <>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </>
      )}
      {matches && (
        <MatchList matches={matches} expandFirstItem={expandFirstItem} />
      )}
    </div>
  );
};

export default MatchSection;
