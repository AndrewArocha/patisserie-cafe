import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { StatusMessage } from "../components/StatusMessage";
import { useCart } from "../context/CartContext";
import { CATERING_PHONE } from "../lib/contact";
import {
  categories,
  MENU_ITEMS,
  MENU_PHOTO_ROTATIONS,
  money,
  ROOM_RENTAL_RATE,
  type MenuSizeOption,
} from "../lib/menu";
import type { MenuItem } from "../types";

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

function MenuOptionPicker({
  groupId,
  groupName,
  optionLabel = "Size",
  sizes,
  onAdd,
}: {
  groupId: string;
  groupName: string;
  optionLabel?: string;
  sizes: MenuSizeOption[];
  onAdd: (item: MenuItem) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = sizes[selectedIndex].item;

  return (
    <>
      <p>{selected.description}</p>
      <fieldset className="mb-3 min-w-0">
        <legend className="mb-2 text-sm font-semibold text-ink">
          <span className="sr-only">{groupName} </span>
          {optionLabel}
        </legend>
        <div className={`grid gap-1.5 ${sizes.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {sizes.map(({ item, label, detail }, index) => (
            <label key={item.id} className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name={`${groupId}-option`}
                value={item.id}
                checked={index === selectedIndex}
                onChange={() => setSelectedIndex(index)}
              />
              <span className="grid justify-items-center border border-ink/15 px-1 py-2 text-center text-sm leading-tight peer-checked:border-ink peer-checked:bg-ink/5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                <span className="font-semibold">{label}</span>
                <span>{detail}</span>
                <span className="mt-1 font-semibold tabular-nums">{money(item.price)}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="menu-card-footer">
        <button
          className="ml-auto"
          onClick={() => onAdd(selected)}
          aria-label={`Add ${selected.name} to order`}
        >
          Add to order <span aria-hidden="true">＋</span>
        </button>
      </div>
    </>
  );
}

export function MenuPage() {
  const [category, setCategory] = useState<string>("All");
  const [message, setMessage] = useState("");
  const items = useMemo(
    () => (category === "All" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === category)),
    [category],
  );
  const { addItem } = useCart();
  const addToOrder = (item: MenuItem) => {
    addItem(item);
    setMessage(`${item.name} added to your bag.`);
  };

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
                  {hasSizes ? (
                    <MenuOptionPicker
                      groupId={item.id}
                      groupName={item.name}
                      optionLabel={item.optionLabel}
                      sizes={item.sizes}
                      onAdd={addToOrder}
                    />
                  ) : (
                    <>
                      <p>{item.description}</p>
                      <div className="menu-card-footer">
                        <span>{item.unit}</span>
                        {item.price === null ? (
                          <a href={CATERING_PHONE.href}>
                            Call to order <span>↗</span>
                          </a>
                        ) : (
                          <button onClick={() => addToOrder(item)}>
                            Add to order <span>＋</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
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
