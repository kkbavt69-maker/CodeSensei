import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Outlet is where the routed page component will be rendered */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default Layout;