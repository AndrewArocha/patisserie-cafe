import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LoadingState, StatusMessage } from "../components/StatusMessage";
import { api } from "../lib/api";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmation) {
      setMessage("Those passwords don’t match. Please check and try again.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    try {
      const result = await api.resetPassword(token, password);
      navigate("/account", { replace: true, state: { message: result.message } });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "This link could not be used. Request a new one.");
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
        Choose a new <em>password.</em>
      </h1>
      {!token ? (
        <StatusMessage kind="error">
          This reset link is missing its security token. Request a new link.
        </StatusMessage>
      ) : null}
      {message && <StatusMessage kind="error">{message}</StatusMessage>}
      <form className="account-form" onSubmit={(event) => void submit(event)}>
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          maxLength={128}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          maxLength={128}
          required
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
        />
        {isSubmitting && <LoadingState label="Updating your password…" />}
        <button className="button button-navy account-submit" disabled={isSubmitting || !token}>
          Save new password <span>↗</span>
        </button>
      </form>
      <Link className="text-arrow text-arrow-coral" to="/forgot-password">
        Request another link <span>→</span>
      </Link>
    </main>
  );
}
