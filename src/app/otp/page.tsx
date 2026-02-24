'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OtpPage() {
  const [otpInput, setOtpInput] = useState('');
  const [counter, setCounter] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null); // load client-side
  const router = useRouter();

  // Load tempUser safely on client
  useEffect(() => {
    const storedTempUser = JSON.parse(localStorage.getItem('tempUser') || 'null');
    if (!storedTempUser) {
      alert('No signup in progress!');
      router.push('/');
    } else {
      setTempUser(storedTempUser);
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendEnabled(true);
    }
  }, [counter]);

  const handleVerify = () => {
    if (!tempUser) return;
    if (otpInput === tempUser.otp?.toString()) {
      // Save user to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        username: tempUser.username,
        email: tempUser.email,
        phone: tempUser.phone,
        password: tempUser.password,
      });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.removeItem('tempUser');
      alert('Account Created Successfully 🎉');
      router.push('/dashboard');
    } else {
      alert('Invalid OTP ❌');
    }
  };

  const handleResend = () => {
    if (!tempUser) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000);
    tempUser.otp = newOtp;
    localStorage.setItem('tempUser', JSON.stringify(tempUser));
    setOtpInput('');
    setCounter(60);
    setResendEnabled(false);
    alert(`Your new OTP is: ${newOtp}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE IMAGE */}
      <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-800 text-white items-center justify-center p-12 overflow-hidden">
        <div className="text-center">
          <h1 className="text-4xl font-bold">OTP Verification</h1>
          <p className="mt-4 text-blue-100">
            Enter the 6-digit code sent to your email/phone
          </p>
          <img
            src="https://i.pinimg.com/originals/03/f3/e3/03f3e3b7f3968a71c19d2b5fda4be286.gif"
            alt="OTP Illustration"
            className="w-80 mx-auto mt-8 rounded-2xl"
          />
        </div>
      </div>

      {/* RIGHT SIDE OTP FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-50 px-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">OTP Verification</h2>

          <input
            type="text"
            placeholder="Enter OTP"
            className="input-style w-full"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
          />

          <p className="text-sm mt-2 text-gray-600 text-center">
            {counter > 0 ? `Resend OTP in ${counter}s` : ''}
          </p>

          <button
            onClick={handleVerify}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
          >
            Verify OTP
          </button>

          <button
            onClick={handleResend}
            disabled={!resendEnabled}
            className={`w-full py-3 rounded-lg font-semibold mt-2 transition ${
              resendEnabled
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Resend OTP
          </button>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}