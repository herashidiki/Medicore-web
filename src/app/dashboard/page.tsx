'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { FaHeart, FaSignOutAlt } from 'react-icons/fa';
import { FaUserMd, FaHospital, FaClock, FaStar, FaPills, FaMapMarkerAlt } from "react-icons/fa";

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  hospital: string;
  rating: number;
  consultationFee: number;
  location: string;
  languages: string[];
  availability: 'Available' | 'Busy' | 'Offline';
  image: string;
  bio: string;
}

export default function DashboardPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filtered, setFiltered] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const router = useRouter();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then((data: Doctor[]) => {
        setDoctors(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    let filteredData = doctors;

    if (search) {
      filteredData = filteredData.filter(
        doc =>
          doc.name.toLowerCase().includes(search.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (activeTag) {
      filteredData = filteredData.filter(
        doc => doc.specialty === activeTag
      );
    }

    setFiltered(filteredData);
  }, [search, doctors, activeTag]);

  // Fixed GSAP animation targeting only tags
  useEffect(() => {
    if (!bannerRef.current) return;

    const items = Array.from(bannerRef.current.querySelectorAll("span"));

    gsap.set(items, { opacity: 0, y: 40, scale: 0.8 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

    items.forEach((item) => {
      tl.to(item, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      })
      .to(item, {
        y: -40,
        opacity: 0,
        duration: 0.5,
        delay: 0.8,
        ease: "power1.in"
      });
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const specialties = [...new Set(doctors.map(doc => doc.specialty))];

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            M
          </div>
          <span className="font-bold text-gray-700 text-lg">
            MedPortal
          </span>
        </div>

        <nav className="flex flex-col gap-4">
          <button className="text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-semibold">
            🏥 Dashboard
          </button>

          <button
            onClick={() => router.push('/appointeded')}
            className="text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            📅 Appointments
          </button>

          <button className="text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            ⚙ Settings
          </button>
        </nav>

        <div className="mt-auto pt-10">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 transition font-medium"
          >
            <FaSignOutAlt />
            Logout
          </button>

          <div className="text-sm text-gray-400 mt-6">
            © 2026 MedPortal
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">

        {/* ================= BANNER ================= */}
        <div className="mb-8 flex justify-between items-center p-8 rounded-3xl shadow-xl relative overflow-hidden">

          {/* Background */}
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute inset-0 bg-blue-500 clip-slash opacity-95"></div>

          {/* Floating icons */}
          <div className="absolute top-4 left-6 text-4xl text-blue-100 opacity-40">
            <FaUserMd />
          </div>
          <div className="absolute bottom-4 left-10 text-4xl text-blue-100 opacity-40">
            <FaMapMarkerAlt />
          </div>
          <div className="absolute top-6 right-10 text-4xl text-white opacity-30">
            <FaPills />
          </div>
          <div className="absolute bottom-6 right-16 text-4xl text-white opacity-30">
            <FaHospital />
          </div>

          {/* Animated Tags (Left Content) */}
          <div className="relative z-10 max-w-xl" ref={bannerRef}>
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: <FaUserMd />, text: "Expert Consultations", color: "bg-blue-50 text-blue-700" },
                { icon: <FaPills />, text: "Medicines Delivered", color: "bg-green-50 text-green-700" },
                { icon: <FaHospital />, text: "Trusted Hospitals", color: "bg-purple-50 text-purple-700" },
                { icon: <FaStar />, text: "Top Rated Doctors", color: "bg-pink-50 text-pink-700" },
                { icon: <FaMapMarkerAlt />, text: "Nearby Clinics", color: "bg-teal-50 text-teal-700" },
                { icon: <FaClock />, text: "Flexible Scheduling", color: "bg-orange-50 text-orange-700" },
              ].map((item, index) => (
                <span
                  key={item.text}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-sm shadow-md animate-bounce-slow ${item.color}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Branding + Image */}
          <div className="flex flex-col items-center text-center px-6 relative z-10 text-white">
            <h2 className="text-3xl font-bold">
              MedPortal
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Your Health, Our Priority
            </p>
            <img
              src="https://i.pinimg.com/736x/c1/9e/c8/c19ec80143f177f24b31d5f35d25269b.jpg"
              alt="Medical Illustration"
              className="mt-4 w-72 rounded-3xl drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Doctors Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setActiveTag(null);
              }}
              className="px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/* Specialty Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => {
                setActiveTag(spec);
                setSearch('');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTag === spec
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(doc => (
            <div
              key={doc.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://i.pinimg.com/736x/f0/3f/be/f03fbe3f11e73afee540301ad0de3bfc.jpg"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-bold text-gray-800">{doc.name}</h2>
                  <p className="text-blue-600 text-sm">{doc.specialty}</p>
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-2">{doc.hospital}</p>

              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  doc.availability === 'Available'
                    ? 'bg-green-100 text-green-600'
                    : doc.availability === 'Busy'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {doc.availability}
              </span>

              {/* Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => router.push(`/detail/${doc.id}`)}
                  className="border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  View Details
                </button>

                <button
                  disabled={doc.availability !== 'Available'}
                  onClick={() => router.push(`/book/${doc.id}`)}
                  className={`py-2 rounded-lg font-semibold transition ${
                    doc.availability === 'Available'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {doc.availability === 'Available'
                    ? 'Book Appointment'
                    : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOGOUT POPUP */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#f5f7fb] p-8 rounded-2xl shadow-2xl w-96 text-center border border-gray-200">
            <FaHeart className="text-gray-400 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .clip-slash {
          clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 60% 100%);
        }
      `}</style>
    </div>
  );
}