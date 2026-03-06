import LegacyPageFrame from "../components/LegacyPageFrame";
import { readLegacyBodyHtml } from "../lib/legacy-page";

export default function EquipmentPage({ bodyHtml }) {
  return <LegacyPageFrame title="LabFlow | Equipment Booking" bodyHtml={bodyHtml} />;
}

export async function getServerSideProps() {
  return { props: { bodyHtml: readLegacyBodyHtml("equipment.html") } };
}
