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