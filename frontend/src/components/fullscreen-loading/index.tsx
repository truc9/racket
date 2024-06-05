import { FC } from "react";
import Loading from "../loading";

interface Props {
  text?: string;
}

const FullScreenLoading: FC<Props> = ({ text }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Loading text={text} />
    </div>
  );
};

export default FullScreenLoading;
