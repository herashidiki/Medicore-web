'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  availability: string;
  image: string;
  bio: string;
}

export default function DoctorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then((data: Doctor[]) => {
        const found = data.find(d => d.id === Number(id));
        setDoctor(found || null);
      });
  }, [id]);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* HERO SECTION */}
      <div className="relative h-[350px] flex items-center justify-center text-white animate-fadeDown">
        <img
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Doctor Banner"
        />
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm" />

        <div className="relative text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold">{doctor.name}</h1>
          <p className="text-xl mt-2">{doctor.specialty}</p>
          <p className="mt-1 text-sm">{doctor.hospital}</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 -mt-4 pb-10 animate-fadeUp">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-10 items-center">

          <img
            src="https://i.pinimg.com/736x/f0/3f/be/f03fbe3f11e73afee540301ad0de3bfc.jpg"
            alt={doctor.name}
            className="w-56 h-56 rounded-3xl object-cover border-4 border-blue-600 shadow-lg"
          />

          <div className="flex-1 space-y-4">

            <div className="flex items-center gap-3">
              <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {doctor.rating}
              </span>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  doctor.availability === 'Available'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {doctor.availability}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <p><strong>Experience:</strong> {doctor.experience} yrs</p>
              <p><strong>Consultation:</strong> ${doctor.consultationFee}</p>
              <p><strong>Location:</strong> {doctor.location}</p>
              <p><strong>Languages:</strong> {doctor.languages.join(', ')}</p>
            </div>

            <button
              disabled={doctor.availability !== 'Available'}
              onClick={() => router.push(`/book/${doctor.id}`)}
              className={`mt-6 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                doctor.availability === 'Available'
                  ? 'bg-blue-600 text-white hover:scale-105 hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {doctor.availability === 'Available'
                ? 'Book Appointment'
                : 'Currently Unavailable'}
            </button>

          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="mt-16 bg-white rounded-3xl shadow-lg p-10">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            About Doctor
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {doctor.bio}
          </p>
        </div>

        {/* REVIEW SECTION */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Patient Reviews
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map((item) => (
              <div
                key={item}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full" />
                  <div>
                    <p className="font-semibold">Patient {item}</p>
                    <p className="text-yellow-500">★★★★★</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Excellent consultation and very professional. Highly recommend!
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}