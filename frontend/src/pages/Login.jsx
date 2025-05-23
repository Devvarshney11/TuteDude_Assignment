import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Button, Input, Card } from "../components/ui";

// Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!hasLowerCase) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!hasNumbers) {
    errors.push("Password must contain at least one number");
  }

  if (!hasSpecialChar) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Check password on change
  useEffect(() => {
    if (!isLogin && password) {
      const validation = validatePassword(password);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    try {
      let result;

      if (isLogin) {
        result = await login(username, password);
      } else {
        // Validate password for registration
        const validation = validatePassword(password);

        if (!validation.isValid) {
          setError(validation.errors[0]); // Show first error
          setPasswordErrors(validation.errors);
          setIsLoading(false);
          return;
        }

        result = await register(username, password);
      }

      if (!result.success) {
        setError(result.message);
        setIsLoading(false);
        return;
      }

      // Redirect to home page on success
      navigate("/");
    } catch (error) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full max-w-full overflow-hidden">
      {/* Left side - Illustration/Info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 lg:p-12 flex-col justify-center">
        <div className="animate-fadeIn max-w-xl mx-auto">
          <div className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
            {isLogin ? "Welcome Back!" : "Join LearnVista Today"}
          </div>
          <p className="text-lg lg:text-xl mb-6 lg:mb-8 text-indigo-100">
            {isLogin
              ? "Access your courses and continue your learning journey."
              : "Create an account to start tracking your progress and mastering new skills."}
          </p>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500 p-2 rounded-full">✓</div>
              <span className="text-sm lg:text-base">
                Track your progress across all courses
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500 p-2 rounded-full">✓</div>
              <span className="text-sm lg:text-base">
                Resume watching from where you left off
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500 p-2 rounded-full">✓</div>
              <span className="text-sm lg:text-base">
                Access premium educational content
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md animate-slideInUp">
          <div className="text-center mb-6 lg:mb-8">
            <div className="flex justify-center mb-3 lg:mb-4">
              <div className="text-3xl lg:text-4xl">📚</div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-sm lg:text-base text-gray-600 mt-2">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in the form to create your account"}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-md animate-fadeIn text-sm sm:text-base">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              id="username"
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              icon="👤"
              size={window.innerWidth < 640 ? "sm" : "md"}
            />

            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              icon="🔒"
              size={window.innerWidth < 640 ? "sm" : "md"}
            />

            {!isLogin && (
              <div className="mt-2 max-w-full overflow-x-hidden">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Password requirements:
                </p>
                <ul className="text-xs text-gray-500 space-y-1 pl-4 list-disc">
                  <li className={password.length >= 8 ? "text-green-600" : ""}>
                    At least 8 characters long
                  </li>
                  <li
                    className={/[A-Z]/.test(password) ? "text-green-600" : ""}
                  >
                    At least one uppercase letter
                  </li>
                  <li
                    className={/[a-z]/.test(password) ? "text-green-600" : ""}
                  >
                    At least one lowercase letter
                  </li>
                  <li className={/\d/.test(password) ? "text-green-600" : ""}>
                    At least one number
                  </li>
                  <li
                    className={
                      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                        ? "text-green-600"
                        : ""
                    }
                  >
                    At least one special character
                  </li>
                </ul>
                {passwordErrors.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordErrors[0]}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size={window.innerWidth < 640 ? "sm" : "md"}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                className="bg-transparent border-0 text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium hover:bg-transparent p-0"
                onClick={toggleForm}
                disabled={isLoading}
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Button>
            </div>
          </form>

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            <p className="px-2">
              By continuing, you agree to LearnVista's Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
