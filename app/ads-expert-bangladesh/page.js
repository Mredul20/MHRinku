import ServicePage from "../components/ServicePage";
import { servicePageConfigs } from "../components/servicePageConfigs";
import { getPageMeta, toMetadata } from "@/lib/pageMeta";

export async function generateMetadata() {
  return toMetadata(await getPageMeta("ads-expert-bangladesh"), "/ads-expert-bangladesh");
}

export default function AdsExpertBangladeshPage() {
  return <ServicePage config={servicePageConfigs["ads-expert-bangladesh"]} pathname="/ads-expert-bangladesh" />;
}
