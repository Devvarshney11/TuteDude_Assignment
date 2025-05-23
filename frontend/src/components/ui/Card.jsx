import React from "react";
import PropTypes from "prop-types";

/**
 * Card component - A reusable card component
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.hover=false] - Whether to apply hover effects
 * @param {boolean} [props.padding=true] - Whether to apply padding
 */
const Card = ({ children, className = "", hover = false, padding = true }) => {
  const baseClasses =
    "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200";
  const hoverClasses = hover
    ? "hover:shadow-lg transform hover:-translate-y-1"
    : "";
  const paddingClasses = padding ? "p-4 sm:p-6" : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${paddingClasses} ${className}`}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  padding: PropTypes.bool,
};

export default Card;
