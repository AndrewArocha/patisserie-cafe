# Local search for the New York café

Focus on the actual café at **676 Amsterdam Avenue, New York, NY 10025**. Priority searches are kosher café Upper West Side, kosher breakfast NYC, French-American bakery Upper West Side, salads Upper West Side, and kosher catering Manhattan. Do not claim a New Jersey location or create pages for places the café does not serve.

## Website implementation

`npm run build --prefix client` now generates complete HTML for all seven public routes, individual titles and descriptions, canonical links, social previews, restaurant structured data on the home page, `robots.txt`, and `sitemap.xml`. React hydrates those pages and updates metadata on navigation. Account and password recovery pages are client-rendered with `noindex`; the sitemap excludes them. Unknown URLs use the custom 404 page on Vercel.

Metadata and the sitemap's public route list are maintained in `client/src/lib/seo.ts`. Restaurant details must agree with visible website content and the Google Business Profile. Opening hours and geographic coordinates have deliberately been omitted until confirmed; event room rental hours are not café opening hours. Do not add invented ratings or reviews.

The Vercel project must use the client build script and publish `client/dist` (or `dist` when its root directory is `client`). `client/vercel.json` enables clean HTML URLs instead of rewriting every URL to the home page. After deployment, verify that `/menu`, `/catering/events`, and `/contact` return their own HTML, `/robots.txt` returns text, `/sitemap.xml` returns XML, and a nonexistent URL returns HTTP 404.

## Google Business Profile — already managed by the owners

- Keep the real business name, address, primary store phone, and hours accurate. Avoid adding search keywords to the business name.
- Set the website to `https://patisseriecafe.co/`, the menu to `https://patisseriecafe.co/menu`, and the ordering link to `https://patisseriecafe.co/order`.
- Select the most accurate available primary category. Add relevant secondary categories, such as café, bakery, or kosher restaurant, only when they describe the business.
- Maintain normal and holiday hours, relevant dining attributes, current menu information, and recent storefront and food photos.
- Ask customers for honest reviews and reply to them. Do not buy reviews, offer incentives, or solicit reviews only from happy customers.
- Keep the same business details and website link on Instagram and relevant local and kosher dining directories.

## Google Search Console

Use a domain property for `patisseriecafe.co` and verify ownership with Google's DNS TXT record. After the website changes are live, submit `https://patisseriecafe.co/sitemap.xml` and inspect the home, menu, contact, and catering URLs. Check that Google can render the content and identifies the intended canonical URLs. Validate home-page structured data using Google's Rich Results Test.

Monitor indexed pages, search queries, impressions, clicks, and the Business Profile's calls and directions. Compare trends over several weeks; implementation does not guarantee indexing or a first-place ranking. Prioritize nearby, relevant searches over generic nationwide terms such as “café.”

Official references: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Google local ranking](https://support.google.com/business/answer/7091), [Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business).
