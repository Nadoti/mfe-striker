import './auth-layout.css';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="auth-container">
      <a href="/home" style={{ textDecoration: 'none' }}>
        <h1 className="brand">BlueBank</h1>
      </a>
      <div className="auth-box">
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

