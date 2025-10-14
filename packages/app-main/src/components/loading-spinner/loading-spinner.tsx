import './loading-spinner.css';

interface Props {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function LoadingSpinner({ size = 'medium', message }: Props) {
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner loading-spinner-${size}`}></div>
      {message && <p className="loading-spinner-message">{message}</p>}
    </div>
  );
}

