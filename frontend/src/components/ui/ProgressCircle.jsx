import PropTypes from "prop-types";

/**
 * ProgressCircle component - A reusable circular progress indicator
 *
 * @param {Object} props - Component props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {string} [props.size='md'] - Circle size (sm, md, lg, xl)
 * @param {string} [props.variant='primary'] - Progress circle variant (primary, secondary, accent, success)
 * @param {boolean} [props.showPercentage=true] - Whether to show percentage text in the center
 * @param {boolean} [props.animated=false] - Whether to animate the progress circle
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.strokeWidth=8] - Width of the progress stroke
 */
const ProgressCircle = ({
  progress,
  size = "md",
  variant = "primary",
  showPercentage = true,
  animated = false,
  className = "",
  strokeWidth = 8,
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  // Size classes
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  // Text size classes based on circle size
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  // Variant classes and colors
  const variantColors = {
    primary: {
      stroke: "#4f46e5", // indigo-600
      gradient: ["#6366f1", "#4f46e5"], // indigo-500 to indigo-600
    },
    secondary: {
      stroke: "#0ea5e9", // sky-500
      gradient: ["#38bdf8", "#0ea5e9"], // sky-400 to sky-500
    },
    accent: {
      stroke: "#f97316", // orange-500
      gradient: ["#fb923c", "#f97316"], // orange-400 to orange-500
    },
    success: {
      stroke: "#22c55e", // green-500
      gradient: ["#4ade80", "#22c55e"], // green-400 to green-500
    },
    warning: {
      stroke: "#eab308", // yellow-500
      gradient: ["#facc15", "#eab308"], // yellow-400 to yellow-500
    },
    danger: {
      stroke: "#ef4444", // red-500
      gradient: ["#f87171", "#ef4444"], // red-400 to red-500
    },
  };

  // Calculate circle properties
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dashoffset for proper circular progress
  const strokeDashoffset =
    circumference - (circumference * normalizedProgress) / 100;

  return (
    <div
      className={`relative ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Define gradients for each variant */}
        <defs>
          <linearGradient
            id="primaryGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={variantColors.primary.gradient[0]} />
            <stop offset="100%" stopColor={variantColors.primary.gradient[1]} />
          </linearGradient>

          <linearGradient
            id="secondaryGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={variantColors.secondary.gradient[0]} />
            <stop
              offset="100%"
              stopColor={variantColors.secondary.gradient[1]}
            />
          </linearGradient>

          <linearGradient
            id="accentGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={variantColors.accent.gradient[0]} />
            <stop offset="100%" stopColor={variantColors.accent.gradient[1]} />
          </linearGradient>

          <linearGradient
            id="successGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={variantColors.success.gradient[0]} />
            <stop offset="100%" stopColor={variantColors.success.gradient[1]} />
          </linearGradient>

          <linearGradient
            id="warningGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={variantColors.warning.gradient[0]} />
            <stop offset="100%" stopColor={variantColors.warning.gradient[1]} />
          </linearGradient>

          <linearGradient
            id="dangerGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={variantColors.danger.gradient[0]} />
            <stop offset="100%" stopColor={variantColors.danger.gradient[1]} />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb" // gray-200
          strokeWidth={strokeWidth}
          className="transition-all duration-300"
        />

        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`url(#${variant}Gradient)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000 ease-out"
          style={{
            animationDelay: animated ? "0.2s" : "0s",
          }}
        />
      </svg>

      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 ${
              textSizeClasses[size] || textSizeClasses.md
            }`}
          >
            {normalizedProgress}%
          </span>
        </div>
      )}
    </div>
  );
};

ProgressCircle.propTypes = {
  progress: PropTypes.number.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "accent",
    "success",
    "warning",
    "danger",
  ]),
  showPercentage: PropTypes.bool,
  animated: PropTypes.bool,
  className: PropTypes.string,
  strokeWidth: PropTypes.number,
};

export default ProgressCircle;
