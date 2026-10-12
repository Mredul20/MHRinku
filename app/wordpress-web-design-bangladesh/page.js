import ServicePage from "../components/ServicePage";
import { servicePageConfigs } from "../components/servicePageConfigs";
import { getPageMeta, toMetadata } from "@/lib/pageMeta";

export async function generateMetadata() {
  return toMetadata(await getPageMeta("wordpress-web-design-bangladesh"), "/wordpress-web-design-bangladesh");
}

export default function WordPressWebDesignBangladeshPage() {
  return <ServicePage config={servicePageConfigs["wordpress-web-design-bangladesh"]} pathname="/wordpress-web-design-bangladesh" />;
}
