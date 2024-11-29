'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const Home = () => {
  const [showTitle, setShowTitle] = useState(false);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Set a timer to show the title after 3 seconds and navigate
    const timer = setTimeout(() => {
      setShowTitle(true);

      // After showing the title, navigate to inputData page
      setTimeout(() => {
        router.push('/dataInput'); 
      }, 3000); // Wait 1 second after showing the title before navigation
    }, 1000);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="relative flex justify-center items-center"
      style={{
        height: "100vh",
        backgroundImage: "url('/images/Background-Image.png')", // Ensure the image path is correct
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showTitle && (
        <div
          className="flex justify-center items-center p-20 w-[900px]"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Black overlay with 60% opacity
            borderRadius: "8px", // Rounded corners
            position: "relative", // Ensure the title is positioned correctly
          }}
        >
          <h1
            className="uppercase tracking-wide text-center text-3xl"
            style={{
              fontSize: "5.25rem", // Equivalent to text-4xl
              fontWeight: 900,
              color: "white", // White text color
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Add slight shadow for better readability
              animation: "fadeIn 3s ease-in-out", // Optional: Fade-in animation
            }}
          >
            Urban <br/> <br/>  <br/> Green <br/> <br/> <br/> Spaces
          </h1>
        </div>
      )}
    </div>
  );
};

export default Home;
