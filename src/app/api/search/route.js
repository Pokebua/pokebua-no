import { getShopifySearchPage } from "@/lib/shopify/search";

const ALLOWED_PAGE_SIZES = new Set([5, 24]);

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const query = (searchParams.get("q") ?? "").trim();
  const first = Number(searchParams.get("first") ?? "24");
  const page = Number(searchParams.get("page") ?? "1");

  if (!ALLOWED_PAGE_SIZES.has(first)) {
    return jsonResponse({ error: "Ugyldig antall søkeresultater." }, 400);
  }

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > Math.ceil(1000 / first)
  ) {
    return jsonResponse({ error: "Ugyldig sidetall." }, 400);
  }

  if (query.length > 200) {
    return jsonResponse(
      { error: "Søket kan ikke være lengre enn 200 tegn." },
      400,
    );
  }

  try {
    const results = await getShopifySearchPage(query, {
      first,
      page,
    });

    return jsonResponse(results);
  } catch {
    console.error("Shopify product search failed.");

    return jsonResponse(
      { error: "Kunne ikke hente søkeresultater. Prøv igjen." },
      502,
    );
  }
}
