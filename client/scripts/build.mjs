import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(root, "dist");
const serverOutput = resolve(root, "node_modules/.cache/patisserie-prerender");

await build({ root });
await build({
  root,
  build: {
    ssr: "src/entry-server.tsx",
    outDir: serverOutput,
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
  },
});

const { render, publicPages, privatePages, renderSeoHead, SITE_URL } = await import(
  pathToFileURL(resolve(serverOutput, "entry-server.mjs")).href
);
const template = await readFile(resolve(dist, "index.html"), "utf8");
if (!template.includes("<!--seo-start-->") || !template.includes('<div id="root"></div>')) {
  throw new Error("The HTML template is missing a search metadata or render placeholder.");
}

async function writePage(pathname, body, prerendered = false) {
  const filename = pathname === "/" ? "index.html" : `${pathname.slice(1)}.html`;
  const target = resolve(dist, filename);
  const html = template
    .replace(
      /<!--seo-start-->[\s\S]*?<!--seo-end-->/,
      () => `<!--seo-start-->\n    ${renderSeoHead(pathname)}\n    <!--seo-end-->`,
    )
    .replace(
      '<div id="root"></div>',
      () => `<div id="root"${prerendered ? ` data-prerender="${pathname}"` : ""}>${body}</div>`,
    );
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

for (const pathname of Object.keys(publicPages)) {
  await writePage(pathname, await render(pathname), true);
}
// Account recovery URLs render on the client so tokens and personal data never enter static files.
for (const pathname of Object.keys(privatePages)) {
  await writePage(pathname, "");
}
await writePage("/404", await render("/404"));

const urls = Object.keys(publicPages).map(
  (pathname) => `  <url><loc>${SITE_URL}${pathname === "/" ? "/" : pathname}</loc></url>`,
);
await writeFile(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);
await writeFile(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(
  `Prerendered ${urls.length} public pages, account shells, 404 page, robots.txt, and sitemap.xml.`,
);
