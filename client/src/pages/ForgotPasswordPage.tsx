import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { LoadingState, StatusMessage } from "../components/StatusMessage";
import { api } from "../lib/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const result = await api.requestPasswordReset(email);
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We couldn’t send that request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="recovery-page section-pad">
      <p className="eyebrow">
        <span className="eyebrow-rule" /> Account help
      </p>
      <h1>
        Forgot your <em>password?</em>
      </h1>
      <p>Enter the email address on your account. We’ll send a secure link if it matches.</p>
      {message && (
        <StatusMessage kind={message.startsWith("If an account") ? "success" : "error"}>
          {message}
        </StatusMessage>
      )}
      <form className="account-form" onSubmit={(event) => void submit(event)}>
        <label htmlFor="reset-email">Email address</label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {isSubmitting && <LoadingState label="Sending your reset request…" />}
        <button className="button button-navy account-submit" disabled={isSubmitting}>
          Send reset link <span>↗</span>
        </button>
      </form>
      <Link className="text-arrow text-arrow-coral" to="/account">
        Back to sign in <span>→</span>
      </Link>
    </main>
  );
}
