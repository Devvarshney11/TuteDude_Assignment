import React from "react";
import PropTypes from "prop-types";

/**
 * ProgressBar component - A reusable progress bar component
 *
 * @param {Object} props - Component props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {string} [props.variant='primary'] - Progress bar variant (primary, secondary, accent, success)
 * @param {string} [props.size='md'] - Progress bar size (sm, md, lg)
 * @param {boolean} [props.showPercentage=false] - Whether to show percentage markers
 * @param {boolean} [props.animated=false] - Whether to animate the progress bar
 * @param {string} [props.className] - Additional CSS classes
 */
const ProgressBar = ({
  progress,
  variant = "primary",
  size = "md",
  showPercentage = false,
  animated = false,
  className = "",
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  // Size classes
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-indigo-600",
    secondary: "bg-sky-500",
    accent: "bg-orange-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    gradient: "bg-gradient-to-r from-indigo-500 to-indigo-700",
  };

  // Animation classes
  const animationClasses = animated
    ? "transition-all duration-700 ease-out"
    : "";

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`progress-bar bg-gray-200 rounded-full overflow-hidden ${
          sizeClasses[size] || sizeClasses.md
        }`}
      >
        <div
          className={`h-full rounded-full ${
            variantClasses[variant] || variantClasses.primary
          } ${animationClasses}`}
          style={{ width: `${normalizedProgress}%` }}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {showPercentage && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "accent",
    "success",
    "warning",
    "danger",
    "gradient",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  showPercentage: PropTypes.bool,
  animated: PropTypes.bool,
  className: PropTypes.string,
};

export default ProgressBar;
