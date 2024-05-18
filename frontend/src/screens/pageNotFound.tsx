import Page from "../components/page";

function PageNotFound() {
  return (
    <Page>
      <div className="flex w-full h-full items-center justify-center">
        <div className="flex flex-col">
          <span className="text-center text-2xl text-green-400 font-bold">
            Page Not Found
          </span>
          <small className="text-green-400">
            Contact administrator for support.
          </small>
        </div>
      </div>
    </Page>
  );
}

export default PageNotFound;
