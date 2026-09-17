import ServicePage from "../components/ServicePage";
import { servicePageConfigs } from "../components/servicePageConfigs";
import { getPageMeta, toMetadata } from "@/lib/pageMeta";

export async function generateMetadata() {
  return toMetadata(await getPageMeta("graphic-design-services-bangladesh"), "/graphic-design-services-bangladesh");
}

export default function GraphicDesignServicesBangladeshPage() {
  return <ServicePage config={servicePageConfigs["graphic-design-services-bangladesh"]} pathname="/graphic-design-services-bangladesh" />;
}
