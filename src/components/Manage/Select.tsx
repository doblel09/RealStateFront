import type { UseFormRegisterReturn } from 'react-hook-form';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id: string;
  placeholder: string;
  options: SelectOption[];
  required?: boolean;
  backgroundColor?: string;
  textColor?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  register?: UseFormRegisterReturn; // ✅ Soporte para React Hook Form
  error?: string; // ✅ Prop para mostrar errores
};

const Select = ({ 
  id, 
  placeholder, 
  options, 
  required,  
  textColor = "",
  value,
  onChange,
  register,
  error
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="block md:inline-block">
        {placeholder}
      </label>
      
      <select 
        id={id} 
        required={required}
        className={`
            border border-[#D6E5D1]
            p-2 px-4 
            rounded-lg 
            focus:outline-none 
            w-full 
            appearance-none 
            cursor-pointer
            text-sm
            text-[#619154]
            h-10
            leading-tight
            ${textColor && `text-[${textColor}]`}
            ${error ? 'border-red-500 focus:border-red-500' : 'focus:border-[#619154]'}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 12px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '16px'
        }}
        {...(register ? register : { value, onChange })} // ✅ Usar register O controlled
      >
        <option value="" disabled>
          Select {placeholder.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* ✅ Mostrar error si existe */}
      {error && (
        <span className="text-red-500 text-sm mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;