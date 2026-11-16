import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { spotOnOrderUrl } from "../lib/ordering";

const orderPhotos = [
  "/images/breakfast-package.webp",
  "/images/patisserie-lunch.webp",
  "/images/breakfast-basket.jpg",
];

type CheckoutView = "idle" | "waiting" | "unverified" | "blocked";

function CheckoutPhoto({ waiting }: { waiting: boolean }) {
  const reducedMotion = useReducedMotion();
  const [photoIndex, setPhotoIndex] = useState(0);
  const active = waiting && !reducedMotion;

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setPhotoIndex((current) => (current + 1) % orderPhotos.length);
      }
    }, 3800);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <div className="relative isolate aspect-16/10 overflow-hidden bg-[#d6c1a6] lg:aspect-auto lg:min-h-[30rem] xl:min-h-[35rem]">
      <img
        src={orderPhotos[0]}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      <AnimatePresence>
        {active && photoIndex > 0 && (
          <motion.img
            key={orderPhotos[photoIndex]}
            src={orderPhotos[photoIndex]}
            alt=""
            className="absolute inset-0 size-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
          />
        )}
      </AnimatePresence>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-white/65 sm:inset-4"
      />
    </div>
  );
}

export function OrderPage() {
  const [view, setView] = useState<CheckoutView>("idle");
  const checkoutWindow = useRef<Window | null>(null);
  const waiting = view === "waiting";

  useEffect(() => {
    if (!waiting) return;
    const timer = window.setInterval(() => {
      if (checkoutWindow.current?.closed) {
        // Browsers can also report closed when the provider isolates its window.
        checkoutWindow.current = null;
        setView("unverified");
      }
    }, 750);
    return () => window.clearInterval(timer);
  }, [waiting]);

  const openCheckout = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    event.preventDefault();

    const popup = window.open("", "_blank", "popup,width=1050,height=780");
    if (!popup) {
      setView("blocked");
      return;
    }

    try {
      popup.opener = null;
      popup.location.replace(spotOnOrderUrl);
    } catch {
      popup.close();
      setView("blocked");
      return;
    }
    checkoutWindow.current = popup;
    setView("waiting");
  };

  const returnToCheckout = () => {
    const popup = checkoutWindow.current;
    if (popup && !popup.closed) {
      popup.focus();
      return;
    }
    checkoutWindow.current = null;
    setView("unverified");
  };

  return (
    <main className="grid items-center bg-[#f1e8dc] px-5 py-8 sm:px-10 sm:py-14 lg:min-h-[min(48rem,calc(100svh-7rem))] lg:py-16">
      <section className="mx-auto grid w-full max-w-[82rem] overflow-hidden border border-[#dacbb9] bg-cream shadow-[0_24px_72px_-48px_#49362480] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="flex flex-col items-start justify-center px-6 py-9 sm:px-12 sm:py-12 xl:px-18">
          <h1 className="font-display text-[clamp(3.3rem,7vw,7rem)] leading-[0.99] tracking-[-0.065em]">
            Order <em className="text-terracotta">online.</em>
          </h1>
          <p className="mt-5! max-w-[32ch] text-lg leading-relaxed text-ink/80 sm:text-xl">
            Choose your café favorites and place your order in a separate checkout window.
          </p>

          <div className="mt-6 w-full max-w-sm" role="status">
            {waiting && (
              <div className="flex items-start gap-3 border-l-2 border-terracotta bg-[#f1e8dc] p-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-terracotta/25 border-t-terracotta motion-safe:animate-spin"
                />
                <div>
                  <p className="font-semibold">Checkout is open</p>
                  <p className="mt-1! text-sm text-ink/80">Finish your order in the checkout window.</p>
                </div>
              </div>
            )}
            {view === "unverified" && (
              <div className="border-l-2 border-terracotta bg-[#f1e8dc] p-4">
                <p className="font-semibold">Check your order status</p>
                <p className="mt-1! text-sm text-ink/80">
                  We couldn’t verify your order here. Check the checkout window or your email before starting
                  another order.
                </p>
              </div>
            )}
            {view === "blocked" && (
              <p className="border-l-2 border-terracotta bg-[#f1e8dc] p-4 text-sm text-ink/80">
                The checkout window couldn’t open. Open checkout in a new tab to continue.
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            {waiting ? (
              <button type="button" className="button button-navy" onClick={returnToCheckout}>
                Return to checkout <span aria-hidden="true">↗</span>
              </button>
            ) : (
              <a
                className="button button-navy"
                href={spotOnOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={view === "blocked" ? () => setView("unverified") : openCheckout}
              >
                {view === "blocked"
                  ? "Open checkout in a new tab"
                  : view === "unverified"
                    ? "Start a new order"
                    : "Start your order"}
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {!waiting && (
              <Link className="text-arrow" to="/menu">
                Browse the menu <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
        <CheckoutPhoto waiting={waiting} />
      </section>
    </main>
  );
}
