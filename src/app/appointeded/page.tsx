'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface Appointment {
  doctorId: number;
  doctorName: string;
  specialty: string;
  hospital: string;
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  bookedAt: string;
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [commentIndex, setCommentIndex] = useState(0);
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);

  const comments = [
    "💬 Your appointment with Dr. Sophia is confirmed!",
    "📅 Reminder: Visit Dr. James at 1:00 PM",
    "✅ Checkup completed successfully!",
    "🩺 Health tip: Stay hydrated today!",
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('appointments') || '[]');

    const dummyUpcoming: Appointment[] = [
      {
        doctorId: 10,
        doctorName: 'Dr. Sophia Miller',
        specialty: 'Cardiologist',
        hospital: 'Green Valley Hospital',
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        appointmentDate: '2026-03-15',
        appointmentTime: '09:30 AM',
        bookedAt: new Date().toISOString(),
      },
      {
        doctorId: 11,
        doctorName: 'Dr. James Wilson',
        specialty: 'Dentist',
        hospital: 'Bright Smile Clinic',
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        appointmentDate: '2026-03-20',
        appointmentTime: '01:00 PM',
        bookedAt: new Date().toISOString(),
      },
    ];

    setAppointments([...stored, ...dummyUpcoming]);
  }, []);

  // 🔥 Repeating Comment Animation
  useEffect(() => {
    if (!popupRef.current) return;

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
      onRepeat: () => {
        setCommentIndex((prev) => (prev + 1) % comments.length);
      }
    });

    tl.fromTo(
      popupRef.current,
      { y: -200, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
    )
      .to(popupRef.current, {
        y: 10,
        duration: 2,
        ease: 'sine.inOut',
      })
      .to(popupRef.current, {
        y: 150,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.in',
      });

  }, []);

  const completedAppointments: Appointment[] = [
    {
      doctorId: 20,
      doctorName: 'Dr. Emily Brown',
      specialty: 'Dermatologist',
      hospital: 'SkinCare Center',
      patientName: 'John Doe',
      patientEmail: 'john@example.com',
      appointmentDate: '2026-01-10',
      appointmentTime: '10:00 AM',
      bookedAt: new Date().toISOString(),
    },
    {
      doctorId: 21,
      doctorName: 'Dr. Michael Lee',
      specialty: 'Neurologist',
      hospital: 'City Neuro Hospital',
      patientName: 'John Doe',
      patientEmail: 'john@example.com',
      appointmentDate: '2026-02-05',
      appointmentTime: '03:00 PM',
      bookedAt: new Date().toISOString(),
    },
  ];

  const displayed =
    activeTab === 'upcoming' ? appointments : completedAppointments;

  return (
    <div className="min-h-screen bg-[#eef7f4]">

      {/* 🔥 Banner */}
      <div className="relative bg-gradient-to-r from-blue-400 to-teal-500 rounded-b-[40px] p-10 text-white overflow-hidden">

        {/* 🔥 Animated Comment Popup */}
        <div
          ref={popupRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-2xl font-medium text-center w-[280px]"
        >
          {comments[commentIndex]}
        </div>

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
          className="absolute right-10 bottom-0 w-80 opacity-20"
          alt="Medical"
        />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">

          <div>
            <h1 className="text-4xl font-bold mb-3">
              My Appointments
            </h1>
            <p className="opacity-90">
              Manage your visits and stay on track with your health.
            </p>
          </div>

          {/* Calendar */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 w-72 shadow-lg">
            <h3 className="font-semibold mb-4 text-lg">March 2026</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="font-semibold opacity-80">{d}</div>
              ))}
              {[...Array(31)].map((_, i) => (
                <div
                  key={i}
                  className={`p-1 rounded-lg ${
                    i + 1 === 15 || i + 1 === 20
                      ? 'bg-white text-green-600 font-bold'
                      : ''
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mt-10">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-7 py-4 rounded-2xl font-semibold transition ${
            activeTab === 'upcoming'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white border'
          }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'completed'
              ? 'bg-gray-700 text-white shadow-lg'
              : 'bg-white border'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto p-9 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((appt, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300"
          >
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              {appt.doctorName}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {appt.specialty} • {appt.hospital}
            </p>

            <p className="text-sm text-gray-700 m-2">
              📅 {appt.appointmentDate}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              ⏰ {appt.appointmentTime}
            </p>

            {activeTab === 'upcoming' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/detail/${appt.doctorId}`)}
                  className="flex-1 border border-blue-500  py-2 rounded-lg  font-bold  hover:bg-blue-500"
                >
                  Details
                </button>
                <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="bg-green-100 text-green-700 text-center py-2 rounded-lg font-medium">
                Completed ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}