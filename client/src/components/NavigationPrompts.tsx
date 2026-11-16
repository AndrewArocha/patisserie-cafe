import { useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { spotOnOrderUrl } from "../lib/ordering";

type OutboundLink = {
  href: string;
  opensNewTab: boolean;
  destination?: string;
};

function NavigationDialog({
  outbound,
  pathname,
  onContinue,
  onStay,
}: {
  outbound: OutboundLink;
  pathname: string;
  onContinue: () => void;
  onStay: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const continueLabel = outbound.destination ? `Continue to ${outbound.destination}` : "Continue";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
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
    </dialog>
  );
}

export function NavigationPrompts({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [outbound, setOutbound] = useState<OutboundLink | null>(null);

  const handleLink = (event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button > 1 || !(event.target instanceof Element)) return;
    const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor || anchor.hasAttribute("download")) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.href === spotOnOrderUrl) return;
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

  const leave = () => {
    if (!outbound) return;
    setOutbound(null);
    if (outbound.opensNewTab) {
      window.open(outbound.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(outbound.href);
    }
  };

  return (
    <>
      <div onClick={handleLink} onAuxClick={handleLink}>
        {children}
      </div>
      {outbound && (
        <NavigationDialog
          outbound={outbound}
          pathname={pathname}
          onContinue={leave}
          onStay={() => setOutbound(null)}
        />
      )}
    </>
  );
}
