import { Link } from "react-router-dom";

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
            src="/images/caprese-salad.png"
            alt="Freshly prepared café salad with tomato, mozzarella and basil"
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
          <p>For catering questions, larger gatherings, or just to say hello.</p>
          <a className="contact-phone" href="tel:+16464498730">
            (646) 449-8730
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
      <section className="contact-cta">
        <p className="eyebrow">
          <span className="eyebrow-rule" /> For your next get-together
        </p>
        <h2>
          Let’s make it
          <br />
          <em>a lovely occasion.</em>
        </h2>
        <p>Morning meeting or long lunch, there’s something wonderful about sharing good food.</p>
        <Link className="button button-navy" to="/menu#catering">
          Explore catering <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
