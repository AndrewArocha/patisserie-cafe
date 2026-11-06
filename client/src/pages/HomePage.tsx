import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MENU_ITEMS, money } from "../lib/menu";
import { useCart } from "../context/CartContext";
import { StatusMessage } from "../components/StatusMessage";
import { useState } from "react";

const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };

export function HomePage() {
  const { addItem } = useCart();
  const [message, setMessage] = useState("");
  const highlights = [MENU_ITEMS[6], MENU_ITEMS[15], MENU_ITEMS[11]];

  const addFavorite = (item: (typeof MENU_ITEMS)[number]) => {
    addItem(item);
    setMessage(`${item.name} added to your bag.`);
  };

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
            <motion.p className="eyebrow" variants={fadeUp}>
              <span className="eyebrow-rule" /> Upper West Side · Since the early morning
            </motion.p>
            <motion.h1 variants={fadeUp}>
              A little Paris,
              <br />
              <em>right here on</em>
              <br />
              Amsterdam.
            </motion.h1>
            <motion.p className="hero-description" variants={fadeUp}>
              Handcrafted French-American pastries, warm café favorites, and the kind of welcome that makes
              you stay a little longer.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <Link className="button button-coral" to="/menu">
                Explore the menu <span>↗</span>
              </Link>
              <Link className="text-arrow" to="/contact">
                Find your way here <span>→</span>
              </Link>
            </motion.div>
          </motion.div>
          <div className="hero-footnote">
            <span className="tiny-spark">✳</span> Baked fresh every morning{" "}
            <span className="hero-footnote-dot">·</span> Made with love in New York
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-image-wrap">
            <img
              src="/images/croissant-sandwich.png"
              alt="Golden croissant sandwich served with fresh greens"
            />
          </div>
          <div className="hero-stamp">
            <span>fait avec</span>
            <strong>♡</strong>
            <span>amour</span>
          </div>
          <div className="hero-side-note">
            SOMETHING GOOD
            <br />
            IS ALWAYS IN THE OVEN
          </div>
          <div className="hero-image-caption">
            <span>the lovely little details</span>
            <i>✧</i>
          </div>
        </div>
        <span className="hero-star hero-star-one">✳</span>
        <span className="hero-star hero-star-two">✧</span>
      </section>

      <section className="marquee-strip" aria-label="Café specialties">
        <span>Hand rolled croissants</span>
        <i>✳</i>
        <span>Artisan sourdough</span>
        <i>✳</i>
        <span>Fresh every morning</span>
        <i>✳</i>
        <span>Made with amour</span>
        <i>✳</i>
        <span>Hand rolled croissants</span>
      </section>

      <section className="intro-section section-pad">
        <div className="intro-image">
          <img
            src="/images/soup-flatbread.png"
            alt="Freshly baked flatbread and a warm bowl of tomato soup"
          />
          <span className="image-label">Lunch, lingered over</span>
        </div>
        <div className="intro-copy">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> Bienvenue
          </p>
          <h2>
            Small moments.
            <br />
            <em>Beautifully made.</em>
          </h2>
          <p>
            Some places just feel like a favorite. Where the coffee is poured with a smile, the pastry is
            still warm, and there’s always room for one more at the table.
          </p>
          <p>That’s what we’re making here, every single day.</p>
          <Link to="/contact" className="text-arrow text-arrow-coral">
            A little more about us <span>→</span>
          </Link>
        </div>
        <span className="intro-flower">✿</span>
      </section>

      <section className="favorites-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-rule" /> Worth coming back for
            </p>
            <h2>
              The café <em>favorites</em>
            </h2>
          </div>
          <Link className="text-arrow" to="/menu">
            See the whole menu <span>→</span>
          </Link>
        </div>
        {message && <StatusMessage kind="success">{message}</StatusMessage>}
        <div className="favorite-grid">
          {highlights.map((item, index) => (
            <motion.article
              className="favorite-card"
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.09 }}
            >
              <div className="favorite-photo">
                <img src={item.image ?? "/images/caprese-salad.png"} alt={item.name} />
                <span className="favorite-number">0{index + 1}</span>
                <button onClick={() => addFavorite(item)} aria-label={`Add ${item.name} to order`}>
                  ＋
                </button>
              </div>
              <div className="favorite-meta">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.unit}</p>
                </div>
                <strong>{item.price === null ? "Call for pricing" : money(item.price)}</strong>
              </div>
              <p className="favorite-description">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="catering-banner">
        <div className="catering-art">
          <img src="/images/caprese-salad.png" alt="A colorful fresh tomato and mozzarella salad" />
          <span>
            made for
            <br />
            <em>gathering</em>
          </span>
        </div>
        <div className="catering-copy">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> A table worth sharing
          </p>
          <h2>
            Bring a little
            <br />
            <em>lovely to the table.</em>
          </h2>
          <p>
            From a cozy breakfast meeting to a proper long lunch, we’ll make the gathering taste like
            something special.
          </p>
          <Link className="button button-navy" to="/menu#catering">
            Discover catering <span>↗</span>
          </Link>
          <span className="catering-note">BREAKFAST · LUNCH · A LITTLE BIT OF EVERYTHING</span>
        </div>
      </section>

      <section className="visit-strip">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-rule" /> Your neighborhood café
          </p>
          <h2>
            We saved you
            <br />
            <em>a little something.</em>
          </h2>
        </div>
        <div className="visit-details">
          <span>676 Amsterdam Ave</span>
          <span>New York, NY 10025</span>
          <a href="tel:+16464498730">(646) 449-8730</a>
          <Link className="text-arrow text-arrow-coral" to="/contact">
            Come on over <span>→</span>
          </Link>
        </div>
        <span className="visit-spark">✳</span>
      </section>
    </main>
  );
}
