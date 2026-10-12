import ServicePage from "../components/ServicePage";
import { servicePageConfigs } from "../components/servicePageConfigs";
import { getPageMeta, toMetadata } from "@/lib/pageMeta";

export async function generateMetadata() {
  return toMetadata(await getPageMeta("shopify-website-design-bangladesh"), "/shopify-website-design-bangladesh");
}

export default function ShopifyWebsiteDesignBangladeshPage() {
  return <ServicePage config={servicePageConfigs["shopify-website-design-bangladesh"]} pathname="/shopify-website-design-bangladesh" />;
}
