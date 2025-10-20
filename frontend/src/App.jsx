import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CodeReview from './pages/CodeReview';
import Learn from './pages/Learn';
import BugTester from './pages/bugTester'; 
import CodeOptimizer from './pages/codeOptimizer'; // 1. Import the new page

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for authentication page (no Navbar/Footer) */}
        <Route path="/auth" element={<Auth />} />

        {/* Routes that use the main Layout (with Navbar/Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/code-review" element={<CodeReview />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/bug-tester" element={<BugTester />} />
          <Route path="/codeOptimizer" element={<CodeOptimizer />} /> {/* 2. Add the route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;