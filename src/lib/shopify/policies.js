import "server-only";

import { cache } from "react";
import { shopifyFetch } from "./client";
import { sanitizeDescription } from "./sanitizeDescription";

const policyFieldsByHandle = new Map([
  ["privacy-policy", "privacyPolicy"],
  ["refund-policy", "refundPolicy"],
  ["shipping-policy", "shippingPolicy"],
  ["terms-of-service", "termsOfService"],
]);

const getShopPolicies = cache(async () => {
  const data = await shopifyFetch({
    query: `
      query ShopPolicies {
        shop {
          privacyPolicy {
            title
            body
          }
          refundPolicy {
            title
            body
          }
          shippingPolicy {
            title
            body
          }
          termsOfService {
            title
            body
          }
        }
      }
    `,
  });

  return data.shop;
});

export async function getShopPolicy(handle) {
  const field = policyFieldsByHandle.get(handle);

  if (!field) return null;

  const policies = await getShopPolicies();
  const policy = policies[field];

  if (!policy?.body?.trim()) {
    return null;
  }

  return {
    title: policy.title,
    bodyHtml: sanitizeDescription(policy.body),
  };
}
