import ServicePage from "../components/ServicePage";
import { servicePageConfigs } from "../components/servicePageConfigs";
import { getPageMeta, toMetadata } from "@/lib/pageMeta";

export async function generateMetadata() {
  return toMetadata(await getPageMeta("seo"), "/seo");
}

export default function SeoPage() {
  return <ServicePage config={servicePageConfigs.seo} pathname="/seo" />;
}
