import Image from "next/image";
import styles from "./page.module.css";
// import { AuthLayout } from "./components/AuthLayout";
// import { SignupForm } from "./components/SignupForm";
interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input {...props} />
    </div>
  );
};
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button className="primary-button" {...props}>
      {children}
    </button>
  );
};
export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="auth-container">
      <h1 className="brand">BlueBank</h1>
      <div className="auth-box">
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};
export const SignupForm: React.FC = () => {
  return (
    <form className="signup-form">
      <Input type="email" placeholder="Email" required />
      <Input type="password" placeholder="Senha" required />
      <Button type="submit">Criar</Button>
      <p className="login-link">
        Já é cadastrado? Entre <a href="#">aqui</a>
      </p>
    </form>
  );
};
export default function Home() {
  return (
   <div className="d-flex justify-center">
      <AuthLayout title="Crie sua conta">
        <SignupForm />
      </AuthLayout>
    </div>
  );
}
