import React from "react";
import PropTypes from "prop-types";

/**
 * Input component - A reusable input field component
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.type - Input type (text, password, email, etc.)
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.error] - Error message
 * @param {string} [props.icon] - Icon to display inside the input
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.size='md'] - Input size (sm, md, lg)
 */
const Input = ({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  icon,
  className = "",
  size = "md",
  ...rest
}) => {
  // Size classes
  const sizeClasses = {
    sm: "py-1 text-sm",
    md: "py-2 text-base",
    lg: "py-3 text-lg",
  };

  // Input classes
  const inputClasses = `
    form-input 
    w-full 
    px-3 
    border 
    border-gray-300 
    rounded-md 
    focus:outline-none 
    focus:ring-2 
    focus:ring-indigo-500 
    focus:border-indigo-500
    ${icon ? "pl-10" : ""}
    ${error ? "border-red-500" : ""}
    ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
    ${sizeClasses[size] || sizeClasses.md}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`form-label block font-medium text-gray-700 mb-1 ${
            size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default Input;
