'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function OtpPage() {
  const [otpInput, setOtpInput] = useState('');
  const [counter, setCounter] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  const [popup, setPopup] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const popupRef = useRef<any>(null);
  const router = useRouter();

  // ---------------- LOAD TEMP USER ----------------
  useEffect(() => {
    const storedTempUser = JSON.parse(
      localStorage.getItem('tempUser') || 'null'
    );

    if (!storedTempUser) {
      router.push('/');
    } else {
      setTempUser(storedTempUser);
    }
  }, [router]);

  // ---------------- COUNTDOWN ----------------
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendEnabled(true);
    }
  }, [counter]);

  // ---------------- POPUP ANIMATION ----------------
  useEffect(() => {
    if (popup.show && popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { scale: 0.6, opacity: 0, y: -40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [popup.show]);

  const showPopup = (
    type: 'success' | 'error',
    message: string,
    redirect?: boolean
  ) => {
    setPopup({ show: true, type, message });

    setTimeout(() => {
      setPopup({ ...popup, show: false });
      if (redirect) router.push('/dashboard');
    }, 2000);
  };

  // ---------------- VERIFY ----------------
  const handleVerify = () => {
    if (!tempUser) return;

    if (otpInput === tempUser.otp?.toString()) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      users.push({
        username: tempUser.username,
        email: tempUser.email,
        phone: tempUser.phone,
        password: tempUser.password,
      });

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.removeItem('tempUser');

      showPopup('success', 'Account Created Successfully 🎉', true);
    } else {
      showPopup('error', 'Invalid OTP ❌');
    }
  };

  // ---------------- RESEND ----------------
  const handleResend = () => {
    if (!tempUser) return;

    const newOtp = Math.floor(100000 + Math.random() * 900000);
    tempUser.otp = newOtp;
    localStorage.setItem('tempUser', JSON.stringify(tempUser));

    setOtpInput('');
    setCounter(60);
    setResendEnabled(false);

    showPopup('success', `New OTP Sent: ${newOtp}`);
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-50 px-6">
          <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
              OTP Verification
            </h2>

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
      </div>

      {/* CUTE POPUP */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div
            ref={popupRef}
            className={`bg-white px-8 py-6 rounded-2xl shadow-2xl text-center w-80`}
          >
            <h3
              className={`text-xl font-bold mb-2 ${
                popup.type === 'success'
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {popup.type === 'success' ? '🎉 Success!' : '⚠️ Oops!'}
            </h3>

            <p className="text-gray-600">{popup.message}</p>
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
      `}</style>
    </>
  );
}