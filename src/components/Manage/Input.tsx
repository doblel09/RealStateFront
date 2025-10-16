import type { UseFormRegisterReturn } from 'react-hook-form';

type InputProps = {
  type?: string;
  id: string;
  placeholder: string;
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  register?: UseFormRegisterReturn;
  error?: string;
};

const Input = ({ 
  type = "text", 
  id, 
  placeholder, 
  required, 
  value, 
  onChange, 
  register,
  error 
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="block md:inline-block">
        {placeholder}
      </label>
      
      {type === "textarea" ? (
        <textarea 
          id={id} 
          placeholder={placeholder}
          required={required}
          className={`
            border border-[#D6E5D1] 
            text-[#619154] 
            p-3 px-4 
            rounded-lg 
            focus:outline-none 
            w-full
            resize-vertical
            min-h-[100px]
            ${error ? 'border-red-500 focus:border-red-500' : 'focus:border-[#619154]'}
          `}
          {...(register ? register : { value, onChange })} // ✅ Usar register O controlled
        />
      ) : (
        <input 
          type={type}
          id={id} 
          placeholder={placeholder}
          required={required}
          className={`
            border border-[#D6E5D1] 
            text-[#619154] 
            p-3 px-4 
            rounded-lg  
            focus:outline-none 
            w-full
            ${error ? 'border-red-500 focus:border-red-500' : 'focus:border-[#619154]'}
          `}
          {...(register ? register : { value, onChange })} // ✅ Usar register O controlled
        />
      )}
      
      {/* ✅ Mostrar error si existe */}
      {error && (
        <span className="text-red-500 text-sm mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
