import LegacyPageFrame from "../components/LegacyPageFrame";
import { readLegacyBodyHtml } from "../lib/legacy-page";

export default function RegisterPage({ bodyHtml }) {
  return <LegacyPageFrame title="LabFlow | Register" bodyHtml={bodyHtml} />;
}

export async function getServerSideProps() {
  return { props: { bodyHtml: readLegacyBodyHtml("register.html") } };
}
