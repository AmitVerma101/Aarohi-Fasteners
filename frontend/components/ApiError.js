export default function ApiError({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="api-error">
      <div className="api-error-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <h3 className="api-error-title">Failed to load</h3>
      <p className="api-error-message">{message}</p>
      {onRetry && (
        <button className="api-error-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
