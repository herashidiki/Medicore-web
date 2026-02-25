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
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showModal, setShowModal] = useState(false); // ✅ modal state

  const getTimeSlots = (date: string) => {
    if (!date) return [];
    const day = new Date(date).getDay();
    switch (day) {
      case 1:
      case 2:
      case 3:
        return ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM'];
      case 4:
      case 5:
        return ['02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM'];
      case 6:
        return ['09:00 AM','11:00 AM','01:00 PM','03:00 PM','05:00 PM'];
      default:
        return [];
    }
  };

  const availableSlots = getTimeSlots(selectedDate);

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
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';

    if (!name || !email || !selectedDate || !selectedTime || availableSlots.length === 0) {
      alert('Please complete all fields!');
      return;
    }

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    appointments.push({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      patientName: name,
      patientEmail: email,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      bookedAt: new Date().toISOString(),
    });

    localStorage.setItem('appointments', JSON.stringify(appointments));

    // ✅ show modal instead of alert
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-8 relative">

      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 relative z-10">

        {/* LEFT SIDE */}
        <div className="relative bg-blue-600 flex items-center justify-center p-10">
          <img
            src="https://i.pinimg.com/736x/3d/e0/d0/3de0d0e20ac15701fdcf4d674f07c661.jpg"
            className="w-80 h-96 object-cover rounded-3xl shadow-2xl relative z-10"
            alt="Doctor"
          />

          <div className="absolute left-6 top-16 bg-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm font-semibold text-gray-800">
              {doctor.specialty}
            </p>
          </div>

          <div className="absolute right-6 bottom-16 bg-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm font-semibold text-gray-800">
              {doctor.availability}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">{doctor.name}</h2>
          <p className="text-gray-500 mb-8">{doctor.hospital}</p>

          <form className="flex flex-col gap-6" onSubmit={handleBooking}>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* DATE PICKER */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* TIME SLOTS */}
            <div>
              <label className="block mb-3 font-semibold text-gray-700">
                Select Time Slot
              </label>

              {availableSlots.length === 0 ? (
                <p className="text-red-500 font-medium">
                  Doctor not available on selected day.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-xl border font-medium transition ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-blue-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mt-4"
            >
              Confirm Booking
            </button>

          </form>
        </div>

      </div>

      {/* ✅ POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* blurred background */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center z-10 animate-scaleIn">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">🎉 Appointment Booked!</h3>
            <p className="mb-6">You have successfully booked your appointment with {doctor.name} on {selectedDate} at {selectedTime}.</p>
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-xl font-semibold hover:bg-blue-700 transition"
              onClick={() => {
                setShowModal(false);
                router.push('/dashboard');
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* modal animation */}
      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}