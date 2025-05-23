import React from "react";
import PropTypes from "prop-types";

/**
 * Badge component - A reusable badge component
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} [props.variant='primary'] - Badge variant (primary, secondary, success, warning, error, info)
 * @param {string} [props.className] - Additional CSS classes
 */
const Badge = ({ children, variant = "primary", className = "" }) => {
  // Base classes
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  // Variant classes
  const variantClasses = {
    primary: "bg-indigo-100 text-indigo-800",
    secondary: "bg-sky-100 text-sky-800",
    accent: "bg-orange-100 text-orange-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`${baseClasses} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "accent",
    "success",
    "warning",
    "error",
    "info",
  ]),
  className: PropTypes.string,
};

export default Badge;
