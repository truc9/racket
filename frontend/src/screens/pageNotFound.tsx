import Page from "../components/page";

function PageNotFound() {
  return (
    <Page>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col">
          <span className="text-center text-2xl font-bold text-violet-400">
            Page Not Found
          </span>
          <small className="text-violet-400">
            Contact administrator for support.
          </small>
        </div>
      </div>
    </Page>
  );
}

export default PageNotFound;
