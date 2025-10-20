// import React from 'react';

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-900 text-white shadow-md">
//       <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//         {/* Top Left: Logo and Name */}
//         <a href="#" className="flex items-center space-x-3">
//           <img src="/src/assets/logo.png" alt="CodeSensei Logo" className="h-10 w-10" />
//           <span className="text-2xl font-bold text-white">CodeSensei</span>
//         </a>

//         {/* Top Right: Links and Buttons */}
//         <div className="flex items-center space-x-6">
//           <a href="#about" className="text-gray-300 hover:text-white text-lg">About</a>
//           <button className="text-lg text-gray-300 hover:text-white">
//             Login
//           </button>
//           <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg text-lg transition duration-300">
//             Sign Up
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Assumes firebase.js is in the src directory

const Navbar = ({ user }) => {

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  // Function to handle Sign-Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Top Left: Logo and Name */}
        <a href="#" className="flex items-center space-x-3">
          <img src="/src/assets/logo.png" alt="CodeSensei Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-white">CodeSensei</span>
        </a>

        {/* Top Right: Links and Buttons */}
        <div className="flex items-center space-x-6">
          <a href="#about" className="text-gray-300 hover:text-white text-lg">About</a>
          
          {/* Conditional rendering based on user login state */}
          {user ? (
            <div className="flex items-center space-x-4">
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="h-10 w-10 rounded-full" 
              />
              <button 
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg text-lg transition duration-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <button onClick={handleGoogleSignIn} className="text-lg text-gray-300 hover:text-white">
                Login
              </button>
              <button 
                onClick={handleGoogleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg text-lg transition duration-300"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

