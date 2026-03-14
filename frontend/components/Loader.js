export default function Loader({ message = 'Loading…' }) {
  return (
    <div className="api-loader">
      <span className="api-loader-spinner" aria-hidden="true" />
      <p className="api-loader-text">{message}</p>
    </div>
  );
}
