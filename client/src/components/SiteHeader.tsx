import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCurrentUser } from "../context/CurrentUserContext";
import { StatusMessage } from "./StatusMessage";

const navItems = [
  { label: "Our menu", to: "/menu" },
  { label: "Catering", to: "/menu#catering" },
  { label: "About us", to: "/about" },
  { label: "Contact us", to: "/contact" },
];

export function SiteHeader() {
  const { currentUser, isSessionLoading, sessionMessage, signOut } = useCurrentUser();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const closeMobile = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="top-note">
        <span>New York · Upper West Side</span>
        <span>100% Kosher · Tartikov supervised</span>
        <a href="tel:+16464498730">(646) 449-8730</a>
      </div>
      <div className="nav-wrap">
        <Link className="brand-lockup" to="/" aria-label="Patisserie Café home" onClick={closeMobile}>
          <img src="/images/patisserie-logo.png" alt="Patisserie" />
          <span>
            <strong>PATISSERIE</strong>
            <small>FRENCH AMERICAN CAFÉ</small>
          </span>
        </Link>
        <button
          className="mobile-menu-button"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span />
          <span />
        </button>
        <nav className={isMenuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={closeMobile}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
          {!isSessionLoading && currentUser ? (
            <button
              className="nav-link text-link"
              onClick={() => {
                signOut();
                closeMobile();
                navigate("/");
              }}
            >
              Sign out
            </button>
          ) : (
            <NavLink className="nav-link" to="/account" onClick={closeMobile}>
              Sign in
            </NavLink>
          )}
          <Link className="button button-navy nav-order" to="/order" onClick={closeMobile}>
            Order online <span className="cart-badge">{cartCount || "↗"}</span>
          </Link>
        </nav>
      </div>
      {!currentUser &&
        sessionMessage &&
        (sessionMessage.includes("signed out") || sessionMessage.includes("deleted")) && (
          <div className="global-toast">
            <StatusMessage kind="success">{sessionMessage}</StatusMessage>
          </div>
        )}
    </header>
  );
}
