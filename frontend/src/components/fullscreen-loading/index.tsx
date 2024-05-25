import Loading from "../loading";

export default function FullScreenLoading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Loading />
    </div>
  );
}
