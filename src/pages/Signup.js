import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import LoginForm from "../components/forms/LoginForm";
import CreateAccountForm from "../components/forms/CreateAccountForm";
import { useNavigate, Link } from "react-router-dom"; 
import log from '../assets/SpiralReports Logo White.jpg'; 

function Signup() {
  const [isLogin, setIsLogin] = useState(false); // State to toggle between login and signup forms
  const navigate = useNavigate();

  const toggleForm = () => {
    if (isLogin) {
      navigate("/signup"); // Navigate to signup page
    } else {
      navigate("/login"); // Navigate to login page
    }
    setIsLogin((prev) => !prev); // Toggle the form state
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-white p-8 relative">
        <div className="flex gap-2 items-center mb-4">
        </div>
        
        <Link to="/" className="mb-2"> 
          <img 
            src={log} 
            alt="Logo" 
            className="object-contain w-3/4 h-auto"
            style={{ marginTop: '10%', marginBottom: '10%' }} 
          />
        </Link>
        
        <blockquote className="text-center max-w-lg space-y-2">
          {/* Optional Quote Here */}
        </blockquote>
      </div>
      
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {isLogin ? (
            <LoginForm />
          ) : (
            <CreateAccountForm />
          )}

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="/terms" className="underline">Terms of Service</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        className="absolute right-4 top-4"
        style={{ backgroundColor: '#EF4444', color: 'white', border: 'none' }} // Adding color white to text for visibility
        onClick={toggleForm}
      >
        {isLogin ? "Create Account" : "Login"}
      </Button>
    </div>
  );
}

export default Signup;
