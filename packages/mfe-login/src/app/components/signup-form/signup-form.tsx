import { Input } from "../input/input";
import { Button } from "../button/button";
import './signup-form.css';

export const SignupForm: React.FC<{ 
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}> = ({ setEmail, setPassword, handleSubmit }) => {
  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <Input 
        type="email" 
        placeholder="Email" 
        required 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <Input 
        type="password" 
        placeholder="Senha" 
        required 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <Button type="submit">Entrar</Button>
      <p className="login-link">
        Não tem cadastro? <a href="/register">Crie sua conta</a>
      </p>
    </form>
  );
};

