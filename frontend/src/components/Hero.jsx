import React from 'react';

const Hero = () => {
  return (
    <div className="bg-gray-900 text-white py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          Welcome to <span className="text-blue-500">CodeSensei</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Your AI-powered partner for code review, bug detection, and optimization. 
          Write cleaner, faster, and more secure code with intelligent feedback.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
            Get Started
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;