import { useState } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";

type InputProps = {
  type?: string;
  id: string;
  placeholder: string;
  required?: boolean;
  setElement?: React.Dispatch<React.SetStateAction<string>>; // ✅ Mantener para compatibilidad
  register?: UseFormRegisterReturn; // ✅ Tipo correcto para register
  error?: string; // ✅ Tipo correcto para error
};

const Input = ({ 
  type = "text", 
  id, 
  placeholder, 
  required, 
  setElement, 
  register, 
  error 
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // ✅ Combinar onChange de setElement y register
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setElement?.(e.target.value);
    register?.onChange?.(e);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="block md:inline-block mb-2">
        {placeholder}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          {...register} // ✅ Spread register props
          onChange={handleChange} // ✅ Combinar ambos onChange
          className={`border p-3 px-4 rounded-lg bg-[#EBF2EB] focus:outline-none w-full resize-none ${
            error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#668A5C]'
          }`}
          rows={4}
        />
      ) : isPassword ? (
        <div className="relative">
          <input
            id={id}
            type={inputType}
            placeholder={placeholder}
            {...register} // ✅ Spread register props
            onChange={handleChange} // ✅ Combinar ambos onChange
            className={`border p-3 pr-10 rounded-lg bg-[#EBF2EB] focus:outline-none w-full placeholder-[#668A5C] ${
              error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#668A5C]'
            }`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 p-1"
          >
            {showPassword ? (
              // eye off
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3-11-7 1.02-2.06 2.6-3.9 4.61-5.07" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            ) : (
              // eye
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.05 12.55C3.8 17.55 8.07 20.5 12 20.5s8.2-2.95 9.95-7.95C20.2 6.45 15.93 3.5 12 3.5S3.8 6.45 2.05 12.55z" />
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            )}
          </button>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register} // ✅ Spread register props
          onChange={handleChange} // ✅ Combinar ambos onChange
          className={`border p-3 px-4 rounded-lg bg-[#EBF2EB] focus:outline-none w-full placeholder-[#668A5C] ${
            error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#668A5C]'
          }`}
        />
      )}

      {/* ✅ Mostrar mensaje de error */}
      {error && (
        <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
