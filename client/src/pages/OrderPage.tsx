import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCheckoutRedirect } from "../components/NavigationPrompts";
import { LoadingState, StatusMessage } from "../components/StatusMessage";
import { useCart } from "../context/CartContext";
import { useCurrentUser } from "../context/CurrentUserContext";
import { ApiError, api } from "../lib/api";
import { CATERING_PHONE } from "../lib/contact";
import { MINIMUM_QUANTITIES, money } from "../lib/menu";

export function OrderPage() {
  const { currentUser } = useCurrentUser();
  const { entries, setQuantity, removeItem, cartTotal, clearCart } = useCart();
  const redirectToCheckout = useCheckoutRedirect();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"success" | "error" | "info">("success");
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const minimumIssue = entries.find((entry) => entry.quantity < (MINIMUM_QUANTITIES[entry.item.id] ?? 1));

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (searchParams.get("checkout") !== "success" || !currentUser || !sessionId) return;
    let isMounted = true;
    setConfirmationLoading(true);
    void api
      .confirmCheckout(sessionId)
      .then((result) => {
        if (isMounted) {
          setConfirmationMessage(result.message);
          setMessageKind(result.status === "paid" ? "success" : "info");
          if (result.status === "paid") clearCart();
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setConfirmationMessage(
            error instanceof Error ? error.message : "We couldn’t confirm your payment yet.",
          );
          setMessageKind("error");
        }
      })
      .finally(() => {
        if (isMounted) setConfirmationLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [clearCart, currentUser, searchParams]);

  const handleCheckout = async () => {
    if (!currentUser) {
      setMessageKind("error");
      setMessage("Sign in or create an account to continue to secure checkout.");
      return;
    }
    if (minimumIssue) {
      setMessageKind("error");
      setMessage(
        `${minimumIssue.item.name} has a minimum order of ${MINIMUM_QUANTITIES[minimumIssue.item.id]}. Please adjust the quantity to continue.`,
      );
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    let orderWasSaved = false;
    try {
      const created = await api.createOrder(
        entries.map(({ item, quantity }) => ({ itemId: item.id, quantity })),
      );
      orderWasSaved = true;
      setMessage("Your order is saved. Opening secure checkout…");
      const checkout = await api.checkout(created.order._id);
      if (!checkout.checkoutUrl)
        throw new ApiError(
          `We couldn’t open secure checkout. Call our orders line at ${CATERING_PHONE.label} for help.`,
          503,
        );
      redirectToCheckout(checkout.checkoutUrl);
    } catch (error) {
      setMessageKind("error");
      const detail =
        error instanceof Error
          ? error.message
          : `Please try again or call our orders line at ${CATERING_PHONE.label}.`;
      setMessage(
        orderWasSaved
          ? `Your order is saved, but secure checkout could not start. ${detail}`
          : `We couldn’t place your order. ${detail}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className="order-hero page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> A little something for later
          </p>
          <h1>
            Your order,
            <br />
            <em>made lovely.</em>
          </h1>
          <p>Choose a few favorites and we’ll take you to secure checkout.</p>
        </div>
        <div className="order-hero-image">
          <img src="/images/soup-flatbread.png" alt="Fresh flatbread served with warm tomato soup" />
          <span className="order-image-note">something good is coming</span>
        </div>
      </section>
      <section className="order-layout section-pad">
        <div className="order-main">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-rule" /> Your café bag
              </p>
              <h2>
                Just the <em>good stuff.</em>
              </h2>
            </div>
            <Link className="text-arrow" to="/menu">
              Keep browsing <span>→</span>
            </Link>
          </div>
          {confirmationLoading && <LoadingState label="Confirming your payment…" />}
          {confirmationMessage && <StatusMessage kind={messageKind}>{confirmationMessage}</StatusMessage>}
          {searchParams.get("checkout") === "success" && !currentUser && (
            <StatusMessage kind="info">
              Sign in to confirm your payment and view the order in your account.
            </StatusMessage>
          )}
          {searchParams.get("checkout") === "cancel" && (
            <StatusMessage kind="info">
              Checkout was canceled. Your saved bag is still here whenever you’re ready.
            </StatusMessage>
          )}
          {message && <StatusMessage kind={messageKind}>{message}</StatusMessage>}
          {entries.length ? (
            <div className="cart-list">
              {entries.map(({ item, quantity }) => (
                <article className="cart-row" key={item.id}>
                  <div className="cart-thumb">
                    {item.image ? <img src={item.image} alt="" /> : <span>✳</span>}
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.unit}</p>
                    <button
                      className="remove-item"
                      onClick={() => {
                        removeItem(item.id);
                        setMessage(`${item.name} removed from your bag.`);
                        setMessageKind("success");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="quantity-control">
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => setQuantity(item.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => setQuantity(item.id, quantity + 1)}
                    >
                      ＋
                    </button>
                  </div>
                  <strong className="cart-line-price">{money((item.price ?? 0) * quantity)}</strong>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-cart">
              <span>✳</span>
              <h3>Your bag is taking a little nap.</h3>
              <p>Let’s find something wonderful for the table.</p>
              <Link className="button button-coral" to="/menu">
                Explore the menu <span>↗</span>
              </Link>
            </div>
          )}
        </div>
        <aside className="order-summary">
          <p className="eyebrow">A few details</p>
          <h3>Order summary</h3>
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{money(cartTotal)}</strong>
          </div>
          <div className="summary-line">
            <span>Sales tax</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-line">
            <span>Delivery</span>
            <span>On request</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Estimated total</span>
            <strong>{money(cartTotal)}</strong>
          </div>
          <p className="summary-note">
            Tax and delivery fees may apply. For catering and orders, call{" "}
            <a className="font-semibold underline underline-offset-2" href={CATERING_PHONE.href}>
              {CATERING_PHONE.label}
            </a>
            .
          </p>
          {currentUser ? (
            <div className="signed-in-note">
              Checkout as <strong>{currentUser.email}</strong>
            </div>
          ) : (
            <div className="sign-in-note">
              Have an account? <Link to="/account">Sign in</Link> to continue.
            </div>
          )}
          <button
            className="button button-navy checkout-button"
            disabled={!entries.length || isSubmitting}
            onClick={() => void handleCheckout()}
          >
            {isSubmitting ? "Preparing checkout…" : "Continue to secure checkout"}
            <span>↗</span>
          </button>
          {isSubmitting && <LoadingState label="Saving your order securely…" />}
          <p className="secure-note">
            <span>♧</span> Payments handled securely by Stripe
          </p>
        </aside>
      </section>
    </main>
  );
}
