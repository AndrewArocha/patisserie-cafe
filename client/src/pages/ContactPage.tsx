import { Link } from "react-router-dom";
import { CATERING_PHONE, STORE_PHONE } from "../lib/contact";
import { ROOM_RENTAL_RATE } from "../lib/menu";

export function ContactPage() {
  return (
    <main>
      <section className="contact-hero page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> Find us on Amsterdam
          </p>
          <h1>
            Your table
            <br />
            <em>is waiting.</em>
          </h1>
          <p>Come for a pastry, stay for another cup. We’re right in the heart of the Upper West Side.</p>
        </div>
        <div className="contact-image">
          <img
            src="/images/patis-bakery/margherita-pizza.jpg"
            alt="Freshly baked Margherita pizza with tomato, mozzarella, and basil"
          />
          <span className="contact-image-caption">A seat at the table, always.</span>
        </div>
      </section>
      <section className="contact-details section-pad">
        <div className="contact-card">
          <span className="contact-icon">⌖</span>
          <p className="eyebrow">Come on over</p>
          <h2>676 Amsterdam Ave</h2>
          <p>
            New York, NY 10025
            <br />
            Upper West Side
          </p>
          <a
            className="text-arrow text-arrow-coral"
            href="https://maps.google.com/?q=676+Amsterdam+Ave,+New+York,+NY+10025"
            data-destination="Google Maps"
            target="_blank"
            rel="noreferrer"
          >
            Get directions <span>↗</span>
          </a>
        </div>
        <div className="contact-card contact-card-highlight">
          <span className="contact-icon">☎</span>
          <p className="eyebrow">We’d love to hear from you</p>
          <h2>Give us a ring.</h2>
          <dl className="grid gap-4 xl:grid-cols-2">
            <div>
              <dt>Store &amp; general questions</dt>
              <dd>
                <a className="contact-phone" href={STORE_PHONE.href}>
                  {STORE_PHONE.label}
                </a>
              </dd>
            </div>
            <div>
              <dt>Catering &amp; orders</dt>
              <dd>
                <a className="contact-phone" href={CATERING_PHONE.href}>
                  {CATERING_PHONE.label}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="contact-card contact-email-card">
          <span className="contact-icon">✉</span>
          <p className="eyebrow">Send us a note</p>
          <h2>We’re listening.</h2>
          <p>For general questions about the café.</p>
          <a className="contact-phone" href="mailto:contact@patisseriecafe.co">
            contact@patisseriecafe.co
          </a>
        </div>
        <div className="contact-map">
          <iframe
            title="Map showing Patisserie Café at 676 Amsterdam Avenue"
            src="https://maps.google.com/maps?q=676%20Amsterdam%20Ave%2C%20New%20York%2C%20NY%2010025&t=&z=14&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
      <section className="contact-cta scroll-mt-8" id="room-rental">
        <p className="eyebrow">
          <span className="eyebrow-rule" /> For your next get-together
        </p>
        <h2>
          Let’s make it
          <br />
          <em>a lovely occasion.</em>
        </h2>
        <p>Morning meeting or long lunch, there’s something wonderful about sharing good food.</p>
        <p>
          Room rental is <strong>{ROOM_RENTAL_RATE}</strong>.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link className="button button-navy" to="/catering">
            Explore catering <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-arrow text-terracotta!" to="/catering/events">
            Explore Rentals &amp; Full-service <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
