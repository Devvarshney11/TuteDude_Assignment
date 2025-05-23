import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import VideoList from './pages/VideoList';
import VideoPlayer from './pages/VideoPlayer';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <VideoList />
                </ProtectedRoute>
              } />
              <Route path="/video/:id" element={
                <ProtectedRoute>
                  <VideoPlayer />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
