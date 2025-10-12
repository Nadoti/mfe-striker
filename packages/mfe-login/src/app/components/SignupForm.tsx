import { Input } from "./Input";
import { Button } from "./Button";

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