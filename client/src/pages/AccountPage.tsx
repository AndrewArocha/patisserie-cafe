import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoadingState, StatusMessage } from "../components/StatusMessage";
import { useCurrentUser } from "../context/CurrentUserContext";
import { api } from "../lib/api";
import { findMenuItem } from "../lib/menu";
import type { ApiOrder } from "../types";

export function AccountPage() {
  const { currentUser, isSessionLoading, signIn, signUp, signOut, deleteAccount, sessionMessage } =
    useCurrentUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersMessage, setOrdersMessage] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const resetMessage = (location.state as { message?: string } | null)?.message ?? "";

  useEffect(() => {
    if (!currentUser) return;
    let isMounted = true;
    setOrdersLoading(true);
    void api
      .orders()
      .then((result) => {
        if (isMounted) setOrders(result.orders);
      })
      .catch((error: unknown) => {
        if (isMounted)
          setOrdersMessage(error instanceof Error ? error.message : "Your order history couldn’t be loaded.");
      })
      .finally(() => {
        if (isMounted) setOrdersLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      if (isSignUp) await signUp(email, password);
      else await signIn(email, password);
      setMessageKind("success");
      setMessage(isSignUp ? "Your account is ready. You’re signed in." : "Welcome back. You’re signed in.");
      setPassword("");
    } catch (error) {
      setMessageKind("error");
      setMessage(
        error instanceof Error ? error.message : "We couldn’t complete that request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeOrder = async (order: ApiOrder) => {
    setDeletingOrderId(order._id);
    setOrdersMessage("Removing your pending order…");
    try {
      const result = await api.deleteOrder(order._id);
      setOrders((current) => current.filter((item) => item._id !== order._id));
      setOrdersMessage(result.message);
    } catch (error) {
      setOrdersMessage(error instanceof Error ? error.message : "This order couldn’t be removed.");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const removeAccount = async () => {
    if (!window.confirm("Delete your account and all of its order history? This can’t be undone.")) return;
    setIsDeletingAccount(true);
    setMessage("Deleting your account and order history…");
    try {
      await deleteAccount();
      navigate("/");
    } catch (error) {
      setMessageKind("error");
      setMessage(
        error instanceof Error ? error.message : "Your account could not be deleted. Please try again.",
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (isSessionLoading)
    return (
      <main className="account-page section-pad">
        <LoadingState label="Checking your session…" />
      </main>
    );

  if (currentUser)
    return (
      <main className="account-page section-pad">
        <div className="account-header">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-rule" /> Your little corner
            </p>
            <h1>
              Bonjour,
              <br />
              <em>{currentUser.email.split("@")[0]}.</em>
            </h1>
          </div>
          <button
            className="text-arrow text-link"
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            Sign out <span>→</span>
          </button>
        </div>
        {(message || sessionMessage || resetMessage) && (
          <StatusMessage kind="success">{message || sessionMessage || resetMessage}</StatusMessage>
        )}
        <section className="account-panel">
          <div className="account-panel-heading">
            <div>
              <p className="eyebrow">Your details</p>
              <h2>
                Account <em>information</em>
              </h2>
            </div>
            <span className="account-flower">✿</span>
          </div>
          <p>
            <span>Email address</span>
            <strong>{currentUser.email}</strong>
          </p>
          <p>
            <span>Member since</span>
            <strong>
              {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
                new Date(currentUser.createdAt),
              )}
            </strong>
          </p>
        </section>
        <section className="account-orders">
          <div className="account-panel-heading">
            <div>
              <p className="eyebrow">For your next gathering</p>
              <h2>
                Your <em>orders.</em>
              </h2>
            </div>
            <Link className="text-arrow text-arrow-coral" to="/menu">
              Order something lovely <span>→</span>
            </Link>
          </div>
          {ordersLoading ? (
            <LoadingState label="Fetching your order history…" />
          ) : ordersMessage && !orders.length ? (
            <StatusMessage
              kind={
                ordersMessage.includes("removed")
                  ? "success"
                  : ordersMessage.includes("Removing")
                    ? "info"
                    : "error"
              }
            >
              {ordersMessage}
            </StatusMessage>
          ) : orders.length ? (
            <div className="order-history">
              {orders.map((order) => (
                <div key={order._id} className="history-row">
                  <div>
                    <strong>Order {order._id.slice(-6).toUpperCase()}</strong>
                    <span>
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                        new Date(order.createdAt),
                      )}{" "}
                      · {order.status}
                    </span>
                  </div>
                  <p>
                    {order.items
                      .map(
                        (item) => `${item.quantity} × ${findMenuItem(item.itemId)?.name ?? "Café favorite"}`,
                      )
                      .join(", ")}
                  </p>
                  {order.status === "pending" && (
                    <button
                      className="remove-item"
                      disabled={deletingOrderId === order._id}
                      onClick={() => void removeOrder(order)}
                    >
                      {deletingOrderId === order._id ? "Removing…" : "Remove pending order"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">
              <span>No orders yet. Your first favorite is waiting.</span>
              <Link to="/menu" className="text-arrow text-arrow-coral">
                Browse the menu <span>→</span>
              </Link>
            </div>
          )}
          {ordersMessage && orders.length > 0 && (
            <StatusMessage
              kind={
                ordersMessage.includes("removed")
                  ? "success"
                  : ordersMessage.includes("Removing")
                    ? "info"
                    : "error"
              }
            >
              {ordersMessage}
            </StatusMessage>
          )}
        </section>
        <section className="delete-account-section">
          <div>
            <strong>Need to leave?</strong>
            <p>Deleting your account also deletes its order history.</p>
            {isDeletingAccount && <LoadingState label="Deleting your account…" />}
          </div>
          <button
            className="text-link destructive-link"
            disabled={isDeletingAccount}
            onClick={() => void removeAccount()}
          >
            {isDeletingAccount ? "Deleting…" : "Delete account"}
          </button>
        </section>
      </main>
    );

  return (
    <main className="account-page account-login-page section-pad">
      <div className="account-login-art">
        <img
          src="/images/patis-bakery/lox-croissant-sandwich.jpeg"
          alt="Croissant sandwich with lox, avocado, and fresh sprouts"
        />
        <span className="account-art-note">
          a little treat
          <br />
          <em>awaits</em>
        </span>
      </div>
      <div className="account-form-wrap">
        <p className="eyebrow">
          <span className="eyebrow-rule" /> {isSignUp ? "A place at our table" : "Welcome back"}
        </p>
        <h1>
          {isSignUp ? (
            <>
              Save your
              <br />
              <em>little favorites.</em>
            </>
          ) : (
            <>
              Your table
              <br />
              <em>is waiting.</em>
            </>
          )}
        </h1>
        <p className="account-form-intro">
          {isSignUp
            ? "Create an account to keep your orders close and checkout with ease."
            : "Sign in to revisit your orders and pick up right where you left off."}
        </p>
        {(message || sessionMessage) && (
          <StatusMessage kind={messageKind}>{message || sessionMessage}</StatusMessage>
        )}
        {ordersMessage && <StatusMessage kind="error">{ordersMessage}</StatusMessage>}
        <form className="account-form" onSubmit={(event) => void submitForm(event)}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={isSignUp ? 10 : 1}
            maxLength={128}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isSignUp ? "At least 10 characters" : "Your password"}
          />
          {!isSignUp && (
            <Link className="forgot-password-link" to="/forgot-password">
              Forgot password?
            </Link>
          )}
          {isSubmitting && <LoadingState label={isSignUp ? "Setting up your account…" : "Signing you in…"} />}
          <button className="button button-navy account-submit" disabled={isSubmitting}>
            {isSubmitting ? "One moment…" : isSignUp ? "Create my account" : "Sign in"}
            <span>↗</span>
          </button>
        </form>
        <p className="account-switch">
          {isSignUp ? "Already have a place here?" : "New around here?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
        <p className="account-safety">Your password is securely hashed. Payments are handled by Stripe.</p>
      </div>
    </main>
  );
}
