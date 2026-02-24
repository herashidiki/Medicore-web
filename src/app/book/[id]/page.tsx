'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
  availability: string;
}

export default function BookPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const router = useRouter();

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

  // Handle booking form submission and store in localStorage
  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const date = formData.get('date')?.toString() || '';

    if (!name || !email || !date) {
      alert('Please fill all fields!');
      return;
    }

    // Get existing appointments from localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    // Add new appointment
    appointments.push({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      patientName: name,
      patientEmail: email,
      appointmentDate: date,
      bookedAt: new Date().toISOString(),
    });

    // Save back to localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Confirmation alert
    alert('🎉 Your appointment has been booked!');

    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE - IMAGE + FLOATING BOXES */}
        <div className="relative bg-blue-600 flex items-center justify-center p-10">
          <img
            src={ 'https://i.pinimg.com/736x/3d/e0/d0/3de0d0e20ac15701fdcf4d674f07c661.jpg'}
            className="w-80 h-96 object-cover rounded-3xl shadow-2xl relative z-10"
          />

          <div className="absolute left-6 top-16 bg-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm font-semibold text-gray-800">
              {doctor.specialty}
            </p>
          </div>

          <div className="absolute right-6 bottom-16 bg-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm font-semibold text-gray-800">
              Available: {doctor.availability}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - BOOKING FORM */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">{doctor.name}</h2>
          <p className="text-gray-500 mb-8">{doctor.hospital}</p>

          <form className="flex flex-col gap-5" onSubmit={handleBooking}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="date"
              name="date"
              className="border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Confirm Booking
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}