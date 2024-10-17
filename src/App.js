import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Tasks from './components/Tasks';
import Categories from './components/Categories';
import ErrorPage from './components/ErrorPage';

const App = () => {
  const isAuthenticated = () => {
    // Simple auth check (e.g., check for token in localStorage)
    return localStorage.getItem('authToken');
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/tasks" element={isAuthenticated() ? <Tasks /> : <Navigate to="/login" />} />
        <Route path="/categories" element={isAuthenticated() ? <Categories /> : <Navigate to="/login" />} />

        {/* Catch-all Route for Unauthorized or Invalid Paths */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
