import { Link } from "react-router-dom";
import { CATERING_PHONE, STORE_PHONE } from "../lib/contact";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-flourish">P</span>
          <div>
            <strong>Patisserie Café</strong>
            <p>A little Paris, right here on Amsterdam.</p>
          </div>
        </div>
        <div>
          <span className="footer-label">Come by</span>
          <a
            href="https://maps.google.com/?q=676+Amsterdam+Ave,+New+York,+NY+10025"
            data-destination="Google Maps"
            target="_blank"
            rel="noreferrer"
          >
            676 Amsterdam Ave
            <br />
            New York, NY 10025
          </a>
          <div>
                    <span className="footer-label">Follow us</span> <br/>
          <Link to="https://www.instagram.com/pattiserie_nyc?exln=bGh3eXZ6ZDloMGNt&utm_source=qr">Instagram</Link>
          </div>
        </div>
          
        <div>
          <span className="footer-label">Say bonjour</span>
          <a href={STORE_PHONE.href}>Store {STORE_PHONE.label}</a>
          <a href={CATERING_PHONE.href}>Catering &amp; orders {CATERING_PHONE.label}</a>
          <a href="mailto:contact@patisseriecafe.co">contact@patisseriecafe.co</a>
          <Link to="/contact">Get directions</Link>
        </div>
        <div>
          <span className="footer-label">Explore</span>
          <Link to="/menu">Our menu</Link>
          <Link to="/catering">Catering</Link>
          <Link to="/about">About us</Link>
          <Link to="/order">Order online</Link>
        </div>
        <div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Patisserie Café</span>
        <span>100% Kosher · Certified by Tartikov</span>
        <span>Sales tax and delivery fees may apply.</span>
      </div>
    </footer>
  );
}
