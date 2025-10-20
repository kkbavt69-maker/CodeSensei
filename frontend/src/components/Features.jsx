import React from 'react';

// Feature Card Component
const FeatureCard = ({ imgName, title, description }) => (
  <div className="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
    <img 
      src={`/src/assets/${imgName}`} 
      alt={`${title} icon`} 
      className="h-20 w-20 mx-auto mb-6" 
    />
    <h3 className="text-2xl font-semibold mb-3 text-center">{title}</h3>
    <p className="text-gray-400 text-center">
      {description}
    </p>
  </div>
);

const Features = () => {
  return (
    <section className="py-20 bg-gray-800/50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Powerful Features, Simplified
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureCard 
            imgName="feature-review.png"
            title="AI Code Review"
            description="Get instant, line-by-line feedback on your code's quality, style, and best practices."
          />
          <FeatureCard 
            imgName="feature-bug.png"
            title="Smart Bug Detector"
            description="Automatically find and fix bugs, vulnerabilities, and potential errors before they become problems."
          />
          <FeatureCard 
            imgName="feature-optimize.png"
            title="Code Optimization"
            description="Receive suggestions to improve your code's performance and reduce its complexity (Big O)."
          />
          <FeatureCard 
            imgName="feature-learn.png"
            title="Learn & Understand"
            description="Get detailed explanations for complex code blocks and concepts, complete with comments."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;