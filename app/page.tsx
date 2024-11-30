'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const Home = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // Track the exit animation state
  const router = useRouter();
  useEffect(() => {
    // Show the title after 1 second
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
      // Trigger fade-out and navigation after showing the title
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        // Navigate to dataInput page after the fade-out animation
        setTimeout(() => {
          router.push('/dataInput');
        }, 1000); // Ensure this matches the fade-out duration
      }, 3000); // Wait 3 seconds before initiating fade-out
      return () => clearTimeout(exitTimer);
    }, 1000);
    // Clean up the title timer on component unmount
    return () => clearTimeout(titleTimer);
  }, [router]);
  return (
    <div
      className={`relative flex justify-center items-center ${
        isExiting ? 'fade-out' : 'fade-in'
      }`}
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
            }}
          >
            Urban <br /> <br /> <br /> Green <br /> <br /> <br /> Spaces
          </h1>
        </div>
      )}
    </div>
  );
};
export default Home;







