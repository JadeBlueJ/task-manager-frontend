import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Categories from './pages/Categories';
import ErrorPage from './pages/ErrorPage';
import 'react-toastify/dist/ReactToastify.css'; // Ensure this is imported
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
const App = () => {

  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/categories" element={<Categories />} />

          {/* Catch-all Route for Unauthorized or Invalid Paths */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
      <ToastContainer />

    </>
  );
};

export default App;
