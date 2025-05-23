import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import VideoList from "./pages/VideoList";
import VideoPlayer from "./pages/VideoPlayer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          {/* Main content with padding for fixed navbar - flex-grow makes it take available space */}
          <div className="flex-grow pt-24 pb-10 overflow-y-auto">
            <div className="container mx-auto px-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <VideoList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/video/:id"
                  element={
                    <ProtectedRoute>
                      <VideoPlayer />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>

          {/* Footer - fixed at the bottom */}
          <footer className="bg-gray-800 text-white py-6 mt-auto">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">📚</span>
                    <span className="text-xl font-bold">LearnVista</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Interactive Learning Platform
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} LearnVista. All rights
                    reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
