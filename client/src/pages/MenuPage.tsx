import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { StatusMessage } from "../components/StatusMessage";
import { useCart } from "../context/CartContext";
import { categories, MENU_ITEMS, MENU_ITEM_IMAGES, money } from "../lib/menu";

export function MenuPage() {
  const [category, setCategory] = useState<string>("All");
  const [message, setMessage] = useState("");
  const items = useMemo(
    () => (category === "All" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === category)),
    [category],
  );
  const { addItem } = useCart();

  return (
    <main>
      <section className="menu-hero page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> Fresh from our kitchen
          </p>
          <h1>
            Good things
            <br />
            <em>are on the menu.</em>
          </h1>
          <p>Handcrafted with a little French flair and a lot of neighborhood love.</p>
        </div>
        <div className="menu-hero-image">
          <img src="/images/caprese-sandwich.png" alt="Fresh mozzarella and pesto on toasted country bread" />
          <span className="hero-photo-note">fresh, never fussy</span>
        </div>
        <span className="page-hero-ornament">✳</span>
      </section>
      <section className="menu-listing section-pad" id="catering">
        <div className="section-heading menu-heading">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-rule" /> Made for sharing
            </p>
            <h2>
              Find your <em>favorite.</em>
            </h2>
          </div>
          <p className="menu-note">
            Catering platters include disposable plates, napkins & utensils. Sales tax and delivery fees may
            apply.
          </p>
        </div>
        <div className="category-tabs" role="tablist" aria-label="Menu categories">
          {categories.map((name) => (
            <button
              key={name}
              role="tab"
              aria-selected={category === name}
              className={category === name ? "category-tab active" : "category-tab"}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
        {message && <StatusMessage kind="success">{message}</StatusMessage>}
        <div className="menu-grid">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              className="menu-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.035, 0.22) }}
            >
              <div className="menu-card-image">
                <img
                  src={MENU_ITEM_IMAGES[item.id] ?? item.image}
                  alt={`${item.name}: ${item.description}`}
                  loading="lazy"
                />
                {item.tag && <span className="menu-tag">{item.tag}</span>}
              </div>
              <div className="menu-card-body">
                <div className="menu-card-title">
                  <h3>{item.name}</h3>
                  <strong>{item.price === null ? "Call for pricing" : money(item.price)}</strong>
                </div>
                <p>{item.description}</p>
                <div className="menu-card-footer">
                  <span>{item.unit}</span>
                  {item.price === null ? (
                    <a href="tel:+16464498730">
                      Call to order <span>↗</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        addItem(item);
                        setMessage(`${item.name} added to your bag.`);
                      }}
                    >
                      Add to order <span>＋</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="menu-bottom-note">
          <span className="tiny-spark">✳</span>
          <p>
            Planning something bigger? <Link to="/contact">Ask us about full-service catering</Link> with
            staffing, rentals and all the thoughtful details.
          </p>
        </div>
      </section>
    </main>
  );
}
