import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full max-w-full overflow-x-hidden ${
        isScrolled
          ? "bg-white text-gray-800 shadow-md"
          : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-3 max-w-full">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 min-w-0 flex-shrink"
          >
            <div
              className={`text-xl sm:text-2xl ${
                isScrolled ? "text-indigo-600" : "text-white"
              }`}
            >
              📚
            </div>
            <div className="flex flex-col min-w-0 truncate">
              <span className="text-lg sm:text-xl font-bold truncate">
                LearnVista
              </span>
              <span className="text-xs opacity-75 hidden xs:block">
                Interactive Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={`font-medium hover:text-indigo-300 transition-colors ${
                    location.pathname === "/"
                      ? "border-b-2 border-orange-400"
                      : ""
                  }`}
                >
                  Courses
                </Link>
              </>
            )}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="flex items-center space-x-2 max-w-[150px] lg:max-w-[200px]">
                  <div
                    className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isScrolled
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-indigo-700 text-white"
                    }`}
                  >
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-sm lg:text-base truncate">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`btn text-sm lg:text-base py-1.5 lg:py-2 px-3 lg:px-4 ${
                    isScrolled
                      ? "btn-outline"
                      : "bg-indigo-700 hover:bg-indigo-800 text-white"
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`btn text-sm lg:text-base py-1.5 lg:py-2 px-3 lg:px-4 ${
                  isScrolled
                    ? "btn-primary"
                    : "bg-indigo-700 hover:bg-indigo-800 text-white"
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md ${
                isScrolled
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-white hover:bg-indigo-700"
              }`}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn max-w-full overflow-x-hidden">
            <div className="flex flex-col space-y-3 max-w-full">
              {isAuthenticated && (
                <>
                  <Link
                    to="/"
                    className="py-2 px-3 rounded hover:bg-indigo-700 hover:text-white text-sm sm:text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Courses
                  </Link>
                  <hr className="border-indigo-200" />
                </>
              )}

              {isAuthenticated ? (
                <div className="pt-2 max-w-full">
                  <div className="flex items-center space-x-2 mb-3 px-3 max-w-full">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isScrolled
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-indigo-700 text-white"
                      }`}
                    >
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm sm:text-base truncate">
                      {user?.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-3 text-center rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full py-2 px-3 text-center rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm sm:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
