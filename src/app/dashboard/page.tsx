'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  // Get unique specialties for tags
  const specialties = [...new Set(doctors.map(doc => doc.specialty))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">
          Doctors Dashboard
        </h1>
        <p className="text-gray-500">
          Find and book appointments with top medical professionals
        </p>
      </div>

      {/* Search */}
      {/* <div className="max-w-6xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by doctor name or specialty..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setActiveTag(null);
          }}
          className="w-full border px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      <div className="max-w-6xl mx-auto mb-6 relative">
  <input
    type="text"
    placeholder="Search doctors by name or specialty..."
    value={search}
    onChange={e => {
      setSearch(e.target.value);
      setActiveTag(null);
    }}
    className="w-full px-4 pl-12 py-3 rounded-xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition placeholder-gray-400 text-gray-700"
  />
  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
      />
    </svg>
  </div>
</div>

      {/* Specialty Tags */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-3 mb-8">
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
                : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'
            }`}
          >
            {spec}
          </button>
        ))}

        {activeTag && (
          <button
            onClick={() => setActiveTag(null)}
            className="px-4 py-2 rounded-full text-sm bg-red-100 text-red-600"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Doctor Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.map(doc => (
          <div
            key={doc.id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col"
          >
            <div className="flex justify-center mb-4">
              <img
                src={"https://i.pinimg.com/736x/f0/3f/be/f03fbe3f11e73afee540301ad0de3bfc.jpg"}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
            </div>

            <h2 className="text-center text-xl font-bold text-gray-800">
              {doc.name}
            </h2>

            <p className="text-center text-blue-600 font-semibold">
              {doc.specialty}
            </p>

            <p className="text-center text-gray-500 text-sm">
              {doc.hospital}
            </p>

            {/* Availability Badge */}
            <div className="flex justify-center mt-3">
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
            </div>

            {/* Buttons */}
            <div className="mt-auto flex flex-col gap-3 mt-6">
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
  );
}