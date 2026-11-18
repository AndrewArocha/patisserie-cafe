import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom";
import { appRoutes } from "./App";
import { CurrentUserProvider } from "./context/CurrentUserContext";

export { publicPages, privatePages, renderSeoHead, SITE_URL } from "./lib/seo";

export async function render(pathname: string) {
  const handler = createStaticHandler(appRoutes);
  const context = await handler.query(new Request(`https://patisseriecafe.co${pathname}`));
  if (context instanceof Response) throw new Error(`Unexpected redirect while rendering ${pathname}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <CurrentUserProvider>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </CurrentUserProvider>,
  );
}
