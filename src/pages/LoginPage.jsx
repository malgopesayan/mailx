import React from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { Flame } from 'lucide-react';

// Google SVG Icon for the button
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.698C34.566 5.854 29.539 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.842-5.631C34.566 5.854 29.539 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.242 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-border-color shadow-2xl text-center">
        <div className="flex justify-center items-center mb-6">
          <Flame className="text-primary-blue h-12 w-12" />
          <h1 className="text-4xl font-bold ml-3 text-text-primary">MailX</h1>
        </div>
        <h2 className="text-xl text-text-primary mb-2">Welcome Back!</h2>
        <p className="text-text-secondary mb-8">Sign in to manage your secure email campaigns.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-primary-blue hover:bg-primary-blue-light flex items-center justify-center gap-3 text-white font-semibold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>
        <p className="text-xs text-text-secondary mt-8">By signing in, you agree to our Terms of Service.</p>
      </div>
    </div>
  );
}

export default LoginPage;