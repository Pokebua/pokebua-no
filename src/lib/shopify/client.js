import "server-only";

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();
  const version = process.env.SHOPIFY_API_VERSION?.trim();

  if (!domain || !token || !version) {
    throw new Error("Missing required Shopify environment configuration.");
  }

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain)) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN must be a myshopify.com hostname without https:// or a path.",
    );
  }

  if (!/^\d{4}-(01|04|07|10)$/.test(version)) {
    throw new Error("SHOPIFY_API_VERSION must be a quarterly API version.");
  }

  return {
    endpoint: `https://${domain}/api/${version}/graphql.json`,
    token,
  };
}

export async function shopifyFetch({ query, variables = {} }) {
  const { endpoint, token } = getShopifyConfig();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}.`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error("Shopify could not complete the GraphQL request.");
  }

  if (!result.data) {
    throw new Error("Shopify returned no data.");
  }

  return result.data;
}
