import LegacyPageFrame from "../components/LegacyPageFrame";
import { readLegacyBodyHtml } from "../lib/legacy-page";

export default function ProfilePage({ bodyHtml }) {
  return <LegacyPageFrame title="LabFlow | Profile" bodyHtml={bodyHtml} />;
}

export async function getServerSideProps() {
  return { props: { bodyHtml: readLegacyBodyHtml("profile.html") } };
}
