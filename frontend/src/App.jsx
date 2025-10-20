import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard'; // 1. Import Dashboard

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for authentication page (no Navbar/Footer) */}
        <Route path="/auth" element={<Auth />} />

        {/* Routes that use the main Layout (with Navbar/Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* 2. Add this route */}
          {/* Add other pages that need the layout here in the future */}
          {/* e.g., 
          <Route path="/code-review" element={<CodeReview />} /> 
          <Route path="/bug-tester" element={<BugTester />} /> 
          */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;