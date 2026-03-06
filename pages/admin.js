import LegacyPageFrame from "../components/LegacyPageFrame";
import { readLegacyBodyHtml } from "../lib/legacy-page";

export default function AdminPage({ bodyHtml }) {
  return <LegacyPageFrame title="LabFlow | Admin" bodyHtml={bodyHtml} />;
}

export async function getServerSideProps() {
  return { props: { bodyHtml: readLegacyBodyHtml("admin.html") } };
}
