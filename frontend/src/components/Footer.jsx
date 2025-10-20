import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <span className="text-xl font-bold">CodeSensei</span>
            <p className="text-gray-400 mt-2">
              &copy; 2025 CodeSensei. All rights reserved. <br />
              A Hackathon Project.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;