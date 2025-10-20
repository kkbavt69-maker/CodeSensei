import React from 'react';

const AboutUs = () => {
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6">About Us</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              CodeSensei was born from a passion for clean code and a drive to innovate. 
              Built for our college hackathon, our mission is to provide students and 
              developers with accessible AI tools to improve their programming skills.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe that understanding code is just as important as writing it. 
              Our platform helps bridge that gap, making software development more 
              intuitive and educational for everyone.
            </p>
          </div>
          
          {/* Image */}
          <div className="md:w-1/2">
            <img 
              src="/src/assets/team-photo.jpg" 
              alt="Team" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;