import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for authentication page (no Navbar/Footer) */}
        <Route path="/auth" element={<Auth />} />

        {/* Routes that use the main Layout (with Navbar/Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Add other pages that need the layout here in the future */}
          {/* e.g., <Route path="/dashboard" element={<Dashboard />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

