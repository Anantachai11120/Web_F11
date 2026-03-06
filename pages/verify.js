import LegacyPageFrame from "../components/LegacyPageFrame";
import { readLegacyBodyHtml } from "../lib/legacy-page";

export default function VerifyPage({ bodyHtml }) {
  return <LegacyPageFrame title="LabFlow | Verify" bodyHtml={bodyHtml} />;
}

export async function getServerSideProps() {
  return { props: { bodyHtml: readLegacyBodyHtml("verify.html") } };
}
