import { useEffect } from "react";
import { Link, Outlet, useLocation, type RouteObject } from "react-router-dom";
import { NavigationPrompts } from "./components/NavigationPrompts";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { AboutPage } from "./pages/AboutPage";
import { AccountPage } from "./pages/AccountPage";
import { ContactPage } from "./pages/ContactPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { OrderPage } from "./pages/OrderPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

function NotFoundPage() {
  return (
    <main className="not-found section-pad">
      <p className="eyebrow">A little detour</p>
      <h1>
        We can’t find
        <br />
        <em>that little corner.</em>
      </h1>
      <p>Let’s take you back to something lovely.</p>
      <Link className="button button-coral" to="/">
        Back home <span>↗</span>
      </Link>
    </main>
  );
}

export function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return (
    <NavigationPrompts>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </NavigationPrompts>
  );
}

export const appRoutes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "order", element: <OrderPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
