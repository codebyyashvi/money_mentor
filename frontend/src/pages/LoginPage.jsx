import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to form page
  useEffect(() => {
    if (user) {
      navigate("/form");
    }
  }, [user, navigate]);

  return (
    <div className="bg-gradient-midnight min-h-screen">
      <Navbar />
      
      {/* Show AuthModal permanently on this page */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <AuthModal 
          isOpen={true} 
          onClose={() => navigate("/")} 
          redirectTo="/form"
        />
      </div>
    </div>
  );
}
