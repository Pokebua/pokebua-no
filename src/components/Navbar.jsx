import { getAllCollections } from "@/lib/shopify/collections";
import { createCollectionNavigation } from "@/utils/collectionNavigation";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const collections = await getAllCollections();
  const productLinks = createCollectionNavigation(collections);

  return <NavbarClient productLinks={productLinks} />;
}
