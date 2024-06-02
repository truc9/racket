import { FC, ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  title?: string;
}

const Page: FC<PageProps> = ({ title, children }) => {
  return (
    <div className="m-2 flex w-full flex-col rounded bg-white p-2">
      {title && <div className="p-2 text-2xl font-bold">{title}</div>}
      <div className="flex h-full w-full flex-col gap-2 overflow-auto p-2">
        {children}
      </div>
    </div>
  );
};

export default Page;
