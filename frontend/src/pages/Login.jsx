import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

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
    <div className="flex flex-col md:flex-row h-full">
      {/* Left side - Illustration/Info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-12 flex-col justify-center">
        <div className="animate-fadeIn">
          <div className="text-4xl font-bold mb-6">
            {isLogin ? "Welcome Back!" : "Join LearnVista Today"}
          </div>
          <p className="text-xl mb-8 text-indigo-100">
            {isLogin
              ? "Access your courses and continue your learning journey."
              : "Create an account to start tracking your progress and mastering new skills."}
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500 p-2 rounded-full">✓</div>
              <span>Track your progress across all courses</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500 p-2 rounded-full">✓</div>
              <span>Resume watching from where you left off</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500 p-2 rounded-full">✓</div>
              <span>Access premium educational content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-slideInUp">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-4xl">📚</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in the form to create your account"}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md animate-fadeIn">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  👤
                </span>
                <input
                  id="username"
                  type="text"
                  className="form-input pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  🔒
                </span>
                <input
                  id="password"
                  type="password"
                  className="form-input pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              {!isLogin && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Password requirements:
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1 pl-4 list-disc">
                    <li
                      className={password.length >= 8 ? "text-green-600" : ""}
                    >
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
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full flex justify-center items-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Processing...</span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                onClick={toggleForm}
                disabled={isLoading}
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
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
