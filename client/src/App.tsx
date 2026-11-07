import { Link, Route, Routes } from "react-router-dom";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
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
  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </>
  );
}
