import { FC } from "react";
import { FadeLoader } from "react-spinners";

interface Props {
  text?: string;
}

const Loading: FC<Props> = ({ text }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center space-x-2">
        <FadeLoader />
        <span className="animate-pulse">{text}</span>
      </div>
    </div>
  );
};

export default Loading;
