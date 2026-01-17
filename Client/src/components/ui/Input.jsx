import React from "react";

/**
 * Reusable Input Component
 * Standard gray rounded input with consistent styling
 * Supports: text, email, password, number, url, tel, date
 */
const Input = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => { },
  onBlur = () => { },
  disabled = false,
  error = "",
  label = "",
  className = "",
  required = false,
  maxLength = null,
  icon: Icon = null,
  ...props
}) => {
  const baseStyles =
    "w-full px-4 py-2.5 rounded-card border border-gray-200 bg-white text-black placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 focus:border-transparent";

  const errorStyles = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "hover:border-gray-300";

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed bg-gray-50"
    : "";

  const inputClassName = `${baseStyles} ${errorStyles} ${disabledStyles} ${Icon ? "pl-10" : ""
    } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-black">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={inputClassName}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {maxLength && value && (
        <p className="mt-1 text-xs text-gray-400">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default Input;