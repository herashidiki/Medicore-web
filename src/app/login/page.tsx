'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<number | null>(null);

  const router = useRouter();

  // ✅ Reset all input fields
  const resetFields = () => {
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
  };

  // ✅ Clear fields when switching Login / Signup
  useEffect(() => {
    resetFields();
  }, [isLogin]);

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill required fields');
      return;
    }

    gsap.fromTo(
      '.auth-box',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const existingUser = users.find(
        (user: any) => user.email === email && user.password === password
      );

      if (existingUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(existingUser));
        resetFields();
        e.target.reset();
        router.push('/dashboard');
      } else {
        alert('Invalid Credentials ❌');
      }
    } else {
      if (!username || !phone) {
        alert('Please fill all signup fields');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.find((user: any) => user.email === email);

      if (userExists) {
        alert('User already exists ❌');
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      localStorage.setItem(
        'tempUser',
        JSON.stringify({
          username,
          email,
          phone,
          password,
          otp,
        })
      );

      setGeneratedOtp(otp);
      setShowOtpPopup(true);

      resetFields();
      e.target.reset();
    }
  };

  // ---------------- GSAP ANIMATION ----------------
  useEffect(() => {
    gsap.fromTo(
      '.feature-left',
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.3 }
    );

    gsap.fromTo(
      '.feature-right',
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.6 }
    );

    gsap.to('.floating', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, []);

  return (
    <>
      <div
        className={`min-h-screen flex transition-all duration-300 ${
          showOtpPopup ? 'blur-sm scale-95' : ''
        }`}
      >
        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-800 text-white items-center justify-center p-12 overflow-hidden">
          <div className="relative text-center space-y-6">
            <h1 className="text-4xl font-bold">
              {isLogin ? 'Welcome Back 👋' : 'Join Our Medical Portal 🩺'}
            </h1>

            <p className="text-blue-100 max-w-md mx-auto">
              Secure healthcare access, appointment booking,
              digital prescriptions and patient records.
            </p>

            <div className="relative flex justify-center items-center mt-8">
              <img
                src="https://i.pinimg.com/originals/03/f3/e3/03f3e3b7f3968a71c19d2b5fda4be286.gif"
                alt="Medical Illustration"
                className="w-80 mx-auto rounded-2xl floating"
              />

              <div className="feature-left absolute -left-20 top-10 bg-white text-blue-700 p-4 rounded-xl shadow-lg w-40 floating">
                <h4 className="font-semibold text-sm">🩺 Online Consult</h4>
                <p className="text-xs text-gray-500">24/7 Doctor Support</p>
              </div>

              <div className="feature-right absolute -right-20 bottom-10 bg-white text-blue-700 p-4 rounded-xl shadow-lg w-40 floating">
                <h4 className="font-semibold text-sm">💊 E-Prescription</h4>
                <p className="text-xs text-gray-500">Instant Digital Records</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-50 px-6">
          <div className="auth-box bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
              {isLogin ? 'Medical Login' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} autoComplete="off">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input-style"
                  value={username}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}

              <input
                type="email"
                placeholder="Email"
                className="input-style"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />

              {!isLogin && (
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input-style"
                  value={phone}
                  autoComplete="off"
                  onChange={(e) => setPhone(e.target.value)}
                />
              )}

              <input
                type="password"
                placeholder="Password"
                className="input-style"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold cursor-pointer ml-2"
              >
                {isLogin ? 'Create Account' : 'Login'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* OTP POPUP */}
      {showOtpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80 animate-popup">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              🎉 OTP Sent!
            </h3>

            <p className="text-gray-600 mb-2">
              Your verification code is:
            </p>

            <div className="text-3xl font-extrabold tracking-[10px] text-blue-700 bg-blue-50 py-3 rounded-xl mb-4">
              {generatedOtp}
            </div>

            <button
              onClick={() => {
                setShowOtpPopup(false);
                router.push('/otp');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Verify Now
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          margin-bottom: 12px;
          outline: none;
        }

        .input-style:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        @keyframes popup {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-popup {
          animation: popup 0.3s ease-out;
        }
      `}</style>
    </>
  );
}