interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, className, ...props }: InputProps) => (
  <div>
    <label className="text-sm font-medium text-text-muted">
      {label}
    </label>
    <input
      {...props}
      className={`w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent ${className || ""
        }`}
    />
  </div>
);

