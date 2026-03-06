import LegacyPageFrame from "../components/LegacyPageFrame";
import { readLegacyBodyHtml } from "../lib/legacy-page";

export default function RoomsPage({ bodyHtml }) {
  return <LegacyPageFrame title="LabFlow | Room Booking" bodyHtml={bodyHtml} />;
}

export async function getServerSideProps() {
  return { props: { bodyHtml: readLegacyBodyHtml("rooms.html") } };
}
