import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { CATERING_PHONE } from "../lib/contact";
import {
  categories,
  MENU_ITEMS,
  MENU_PHOTO_ROTATIONS,
  money,
  ROOM_RENTAL_RATE,
  type MenuSizeOption,
} from "../lib/menu";

function RotatingMenuPhoto({ photos, name }: { photos: string[]; name: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const visible = useInView(frame);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible || reducedMotion || paused) return;
    const next = (index + 1) % photos.length;
    const photo = new Image();
    photo.src = photos[next];
    const timer = window.setTimeout(() => setIndex(next), 4200);
    return () => window.clearTimeout(timer);
  }, [index, paused, photos, reducedMotion, visible]);

  return (
    <div ref={frame} className="absolute inset-0 bg-[#f4eee7]">
      <AnimatePresence initial={false}>
        <motion.img
          key={photos[index]}
          src={photos[index]}
          alt={name}
          loading="lazy"
          className="absolute inset-0 size-full object-contain p-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65 }}
        />
      </AnimatePresence>
      {!reducedMotion && (
        <button
          type="button"
          aria-label={paused ? `Resume ${name} photo rotation` : `Pause ${name} photo rotation`}
          className="absolute right-2 bottom-2 grid size-9 cursor-pointer place-items-center rounded-full bg-cream/95 shadow-sm"
          onClick={() => setPaused(!paused)}
        >
          <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
        </button>
      )}
    </div>
  );
}

function MenuOptionPrices({
  sizes,
  optionLabel = "Size",
}: {
  sizes: MenuSizeOption[];
  optionLabel?: string;
}) {
  return (
    <div className="pb-2">
      <p className="mb-2 text-sm font-semibold text-ink">{optionLabel}</p>
      <dl className={`grid gap-1.5 ${sizes.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {sizes.map(({ item, label, detail }) => (
          <div
            key={item.id}
            className="grid justify-items-center border border-ink/15 px-1 py-2 text-center text-sm leading-tight"
          >
            <dt className="font-semibold">{label}</dt>
            <dd>{detail}</dd>
            <dd className="mt-1 font-semibold tabular-nums">{money(item.price)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function MenuPage() {
  const [category, setCategory] = useState<string>("All");
  const items = useMemo(
    () => (category === "All" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === category)),
    [category],
  );
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
          <img
            src="/images/menu-hero-pastries.webp"
            alt="A baker arranging almond croissants and fruit pastries on a tray"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
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
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-ink/15 bg-cream p-4">
          <p>Choose your items and check out on SpotOn.</p>
          <Link className="button button-navy" to="/order">
            Order online <span aria-hidden="true">↗</span>
          </Link>
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
        <div className="menu-grid">
          {items.map((item, index) => {
            const hasSizes = "sizes" in item;
            const photos = MENU_PHOTO_ROTATIONS[item.id];
            return (
              <motion.article
                key={item.id}
                className="menu-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.035, 0.22) }}
              >
                <div className="menu-card-image">
                  {photos ? (
                    <RotatingMenuPhoto photos={photos} name={item.name} />
                  ) : (
                    <img src={item.image} alt={item.name} loading="lazy" />
                  )}
                  {item.tag && <span className="menu-tag">{item.tag}</span>}
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-title">
                    <h3>{item.name}</h3>
                    {!hasSizes && (
                      <strong>{item.price === null ? "Call for pricing" : money(item.price)}</strong>
                    )}
                  </div>
                  <p>{item.description}</p>
                  {hasSizes ? (
                    <MenuOptionPrices sizes={item.sizes} optionLabel={item.optionLabel} />
                  ) : (
                    <div className="menu-card-footer">
                      <span>{item.unit}</span>
                      {item.price === null && (
                        <a href={CATERING_PHONE.href}>
                          Ask about pricing <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
        <Link className="button button-navy mt-8" to="/order">
          Order online <span aria-hidden="true">↗</span>
        </Link>
        <div className="menu-bottom-note">
          <span className="tiny-spark" aria-hidden="true">
            ✳
          </span>
          <div>
            <p>
              Planning something bigger?{" "}
              <Link to="/catering/events">Explore rentals and full-service catering.</Link>
            </p>
            <p>
              For catering and orders, call <a href={CATERING_PHONE.href}>{CATERING_PHONE.label}</a>.
            </p>
            <p>
              <Link to="/catering/events">Room rental</Link> is {ROOM_RENTAL_RATE}.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
