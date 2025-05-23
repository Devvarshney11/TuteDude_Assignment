import React from "react";
import PropTypes from "prop-types";

/**
 * Button component - A reusable button component with various styles
 *
 * @param {Object} props - Component props
 * @param {string|React.ComponentType} [props.as='button'] - The element or component to render as
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, accent, outline)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {boolean} [props.isLoading=false] - Whether the button is in loading state
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 */
const Button = ({
  as: Component = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  children,
  className = "",
  type = "button",
  ...rest
}) => {
  // Base button classes
  const baseClasses =
    "btn rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  // Variant classes
  const variantClasses = {
    primary:
      "btn-primary bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    secondary:
      "btn-secondary bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400",
    accent:
      "btn-accent bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400",
    outline:
      "btn-outline border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
    warning:
      "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
  };

  // Size classes
  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-2.5 px-5 text-lg",
  };

  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";

  // Disabled/loading classes
  const stateClasses =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

  // Combine all classes
  const buttonClasses = `${baseClasses} ${
    variantClasses[variant] || variantClasses.primary
  } ${
    sizeClasses[size] || sizeClasses.md
  } ${widthClasses} ${stateClasses} ${className}`;

  // Only add type prop if the component is a button
  const buttonProps = Component === "button" ? { type } : {};

  return (
    <Component
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...buttonProps}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="mr-2 animate-spin">⟳</span>
          <span className="animate-pulse">Loading...</span>
        </>
      ) : (
        children
      )}
    </Component>
  );
};

Button.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
    PropTypes.func,
  ]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "accent",
    "outline",
    "success",
    "warning",
    "danger",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;
