import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Link, matchPath, useBlocker, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

type OutboundLink = {
  href: string;
  opensNewTab: boolean;
  destination?: string;
};

const CheckoutRedirectContext = createContext<(href: string) => void>((href) => {
  window.location.assign(href);
});

export function useCheckoutRedirect() {
  return useContext(CheckoutRedirectContext);
}

function NavigationDialog({
  leavingCart,
  outbound,
  pathname,
  onContinue,
  onStay,
}: {
  leavingCart: boolean;
  outbound: OutboundLink | null;
  pathname: string;
  onContinue: () => void;
  onStay: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stayButtonRef = useRef<HTMLButtonElement>(null);
  const continueLabel = outbound?.destination ? `Continue to ${outbound.destination}` : "Continue";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      stayButtonRef.current?.focus();
    }
  }, []);

  const closeWith = (action: () => void) => {
    dialogRef.current?.close();
    action();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="navigation-prompt-title"
      className="navigation-dialog m-auto w-[calc(100%_-_2rem)] max-w-md border border-ink/10 bg-cream p-7 text-ink shadow-xl backdrop:bg-ink/45 sm:p-8"
      onCancel={(event) => {
        event.preventDefault();
        closeWith(onStay);
      }}
    >
      {leavingCart ? (
        <>
          <h2 id="navigation-prompt-title" className="pr-2 font-display text-2xl leading-snug">
            Are you sure you wish to leave without finishing your order?
          </h2>
          <p className="mt-3! text-ink/75">Your bag will be here when you come back.</p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" className="button border-ink/25!" onClick={() => closeWith(onContinue)}>
              Yes, leave
            </button>
            <button
              ref={stayButtonRef}
              type="button"
              className="button button-navy"
              onClick={() => closeWith(onStay)}
            >
              No, stay
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            aria-label={`Dismiss and ${continueLabel.toLowerCase()}`}
            className="absolute top-3 right-3 grid size-11 cursor-pointer place-items-center rounded-full text-2xl hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-ink"
            onClick={() => closeWith(onContinue)}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              ×
            </span>
          </button>
          <h2 id="navigation-prompt-title" className="pr-10 font-display text-3xl">
            Before you go
          </h2>
          <p className="mt-3! text-ink/75">Still deciding what to order or planning a visit?</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {!matchPath("/menu", pathname) && (
              <Link className="button button-navy" to="/menu" onClick={() => closeWith(onStay)}>
                See our menu
              </Link>
            )}
            {!matchPath("/about", pathname) && (
              <Link className="button border-ink/25!" to="/about" onClick={() => closeWith(onStay)}>
                Learn about us
              </Link>
            )}
          </div>
          <button
            type="button"
            className="mt-4 min-h-9 cursor-pointer text-sm font-semibold text-terracotta underline underline-offset-4"
            onClick={() => closeWith(onContinue)}
          >
            {continueLabel} <span aria-hidden="true">↗</span>
          </button>
        </>
      )}
    </dialog>
  );
}

export function NavigationPrompts({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { cartCount } = useCart();
  const hasUnfinishedOrder = Boolean(matchPath("/order", pathname)) && cartCount > 0;
  const blocker = useBlocker(
    ({ nextLocation }) => hasUnfinishedOrder && !matchPath("/order", nextLocation.pathname),
  );
  const [outbound, setOutbound] = useState<OutboundLink | null>(null);
  const allowPageExit = useRef(false);

  useEffect(() => {
    if (!hasUnfinishedOrder) return;

    const confirmUnload = (event: BeforeUnloadEvent) => {
      if (allowPageExit.current) {
        allowPageExit.current = false;
        return;
      }
      event.preventDefault();
      event.returnValue = true;
    };
    const resetPageExit = () => {
      allowPageExit.current = false;
    };

    window.addEventListener("beforeunload", confirmUnload);
    window.addEventListener("pageshow", resetPageExit);
    return () => {
      window.removeEventListener("beforeunload", confirmUnload);
      window.removeEventListener("pageshow", resetPageExit);
      resetPageExit();
    };
  }, [hasUnfinishedOrder]);

  const leavePage = useCallback((href: string) => {
    allowPageExit.current = true;
    try {
      window.location.assign(href);
    } catch (error) {
      allowPageExit.current = false;
      throw error;
    }
  }, []);

  const handleLink = (event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button > 1 || !(event.target instanceof Element)) return;
    const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor || anchor.hasAttribute("download")) return;
    const url = new URL(anchor.href, window.location.href);
    const isExternalWeb =
      (url.protocol === "http:" || url.protocol === "https:") && url.origin !== window.location.origin;
    if (!isExternalWeb && url.protocol !== "tel:" && url.protocol !== "mailto:") return;

    event.preventDefault();
    setOutbound({
      href: url.href,
      opensNewTab:
        isExternalWeb &&
        (anchor.target === "_blank" ||
          event.button === 1 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey),
      destination: anchor.dataset.destination,
    });
  };

  const stay = () => {
    setOutbound(null);
    if (blocker.state === "blocked") blocker.reset();
  };

  const leave = () => {
    if (blocker.state === "blocked") {
      blocker.proceed();
      return;
    }
    if (!outbound) return;
    setOutbound(null);
    if (outbound.opensNewTab) {
      window.open(outbound.href, "_blank", "noopener,noreferrer");
    } else if (/^https?:/.test(outbound.href)) {
      leavePage(outbound.href);
    } else {
      window.location.assign(outbound.href);
    }
  };

  return (
    <CheckoutRedirectContext.Provider value={leavePage}>
      <div onClick={handleLink} onAuxClick={handleLink}>
        {children}
      </div>
      {(outbound || blocker.state === "blocked") && (
        <NavigationDialog
          leavingCart={hasUnfinishedOrder || blocker.state === "blocked"}
          outbound={outbound}
          pathname={pathname}
          onContinue={leave}
          onStay={stay}
        />
      )}
    </CheckoutRedirectContext.Provider>
  );
}
