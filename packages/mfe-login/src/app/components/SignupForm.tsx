import { Input } from "./Input";
import { Button } from "./Button";

export const SignupForm: React.FC<{ setEmail: (email: string) => void, setPassword: (password: string) => void, handleSubmit: (e: React.FormEvent) => void }> = ({ setEmail, setPassword, handleSubmit }) => {
  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <Input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Senha" required onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Criar</Button>
      <p className="login-link">
        Não é cadastrado? cria sua <a href="register">conta</a>
      </p>
    </form>
  );
};