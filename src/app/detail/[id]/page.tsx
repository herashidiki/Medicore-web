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
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <div className="flex flex-col md:flex-row gap-8">

          <img
            src={"https://i.pinimg.com/736x/f0/3f/be/f03fbe3f11e73afee540301ad0de3bfc.jpg"}
            alt={doctor.name}
            className="w-64 h-64 object-cover rounded-2xl border-4 border-blue-600"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {doctor.name}
            </h1>

            <p className="text-blue-600 text-lg font-semibold">
              {doctor.specialty}
            </p>

            <p className="text-gray-500">
              {doctor.hospital}
            </p>

            <p
              className={`mt-2 font-semibold ${
                doctor.availability === 'Available'
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {doctor.availability}
            </p>

            <div className="mt-4 space-y-2">
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Fee:</strong> ${doctor.consultationFee}</p>
              <p><strong>Location:</strong> {doctor.location}</p>
              <p><strong>Languages:</strong> {doctor.languages.join(', ')}</p>
              <p><strong>Email:</strong> {doctor.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">About Doctor</h2>
          <p className="text-gray-600">{doctor.bio}</p>
        </div>

        <div className="mt-8">
          <button
            disabled={doctor.availability !== 'Available'}
            onClick={() => router.push(`/book/${doctor.id}`)}
            className={`px-6 py-3 rounded-lg font-semibold ${
              doctor.availability === 'Available'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {doctor.availability === 'Available'
              ? 'Book Appointment'
              : 'Currently Unavailable'}
          </button>
        </div>

      </div>
    </div>
  );
}