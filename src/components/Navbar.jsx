import { getAllCollections } from "@/lib/shopify/collections";
import { createCollectionNavigation } from "@/utils/collectionNavigation";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  let collections = [];

  try {
    collections = await getAllCollections();
  } catch {
    console.error("Unable to load Shopify navigation collections.");
  }

  const productLinks = createCollectionNavigation(collections);

  return <NavbarClient productLinks={productLinks} />;
}
