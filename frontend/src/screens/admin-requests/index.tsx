import AttendantRequests from "../../components/attendant-requests";
import Page from "../../components/page";

export default function AdminRequests() {
  return (
    <Page title="Attendant Requests">
      <div className="flex items-center justify-center">
        <AttendantRequests />
      </div>
    </Page>
  );
}
