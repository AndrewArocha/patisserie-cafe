export function StatusMessage({
  children,
  kind = "info",
}: {
  children: string;
  kind?: "info" | "success" | "error";
}) {
  return (
    <p className={`status-message status-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}

export function LoadingState({ label = "Just a moment…" }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-dots">
        <i />
        <i />
        <i />
      </span>
      <span>{label}</span>
    </div>
  );
}
