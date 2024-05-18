import { FC, ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  title?: string;
}

const Page: FC<PageProps> = ({ title, children }) => {
  return (
    <div className="w-full flex flex-col m-2 bg-white p-2 rounded">
      {title && <div className="p-2 text-2xl font-bold">{title}</div>}
      <div className="p-2 h-full w-full flex flex-col gap-2 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Page;
