import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Lecture Video Tracker
        </Link>
        
        <div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
