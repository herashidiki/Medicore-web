import { NextResponse } from "next/server";

// TypeScript type for Doctor
export interface Doctor {
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
  availability: "Available" | "Busy" | "Offline";
  image: string;
  bio: string;
}

// Hardcoded doctor data
export const doctors: Doctor[] = [
 
  {
    id: 1,
    name: "Dr. Sarah Ahmed",
    email: "sarah@hospital.com",
    specialty: "Cardiologist",
    experience: 12,
    hospital: "City Heart Hospital",
    rating: 4.9,
    consultationFee: 120,
    location: "New York, USA",
    languages: ["English", "Spanish"],
    availability: "Available",
    image: "/doctors/doc1.jpg",
    bio: "Graduated from Harvard Medical School, Dr. Sarah Ahmed specializes in heart health and preventive cardiology, helping patients lead longer, healthier lives.",
  },
  {
    id: 2,
    name: "Dr. John Smith",
    email: "john@hospital.com",
    specialty: "Psychiatrist",
    experience: 10,
    hospital: "MindCare Institute",
    rating: 4.8,
    consultationFee: 140,
    location: "Los Angeles, USA",
    languages: ["English"],
    availability: "Busy",
    image: "/doctors/doc2.jpg",
    bio: "Dr. John Smith earned his degree from UCLA and treats mental health conditions, anxiety, and depression with patient-centered care.",
  },
  {
    id: 3,
    name: "Dr. Ayesha Khan",
    email: "ayesha@hospital.com",
    specialty: "Neurologist",
    experience: 15,
    hospital: "NeuroCare Hospital",
    rating: 4.8,
    consultationFee: 150,
    location: "Chicago, USA",
    languages: ["English", "Urdu"],
    availability: "Available",
    image: "/doctors/doc3.jpg",
    bio: "A graduate of Johns Hopkins University, Dr. Ayesha Khan has over 15 years of experience treating neurological disorders and complex brain conditions.",
  },
  {
    id: 4,
    name: "Dr. Michael Lee",
    email: "michael@hospital.com",
    specialty: "Orthopedic Surgeon",
    experience: 10,
    hospital: "Bone & Joint Clinic",
    rating: 4.6,
    consultationFee: 110,
    location: "Houston, USA",
    languages: ["English", "Chinese"],
    availability: "Offline",
    image: "/doctors/doc4.jpg",
    bio: "Dr. Michael Lee completed his orthopedic residency at Stanford University and specializes in joint replacements and sports injuries.",
  },
  {
    id: 5,
    name: "Dr. Fatima Noor",
    email: "fatima@hospital.com",
    specialty: "Pediatrician",
    experience: 9,
    hospital: "Children's Medical Center",
    rating: 4.9,
    consultationFee: 80,
    location: "Dallas, USA",
    languages: ["English", "Arabic"],
    availability: "Available",
    image: "/doctors/doc5.jpg",
    bio: "With a degree from the University of Pennsylvania, Dr. Fatima Noor focuses on child health, immunizations, and preventive care.",
  },
  {
    id: 6,
    name: "Dr. Robert Brown",
    email: "robert@hospital.com",
    specialty: "General Physician",
    experience: 6,
    hospital: "Family Health Clinic",
    rating: 4.5,
    consultationFee: 60,
    location: "Miami, USA",
    languages: ["English"],
    availability: "Available",
    image: "/doctors/doc6.jpg",
    bio: "Dr. Robert Brown graduated from Yale University and provides comprehensive primary care services for adults and families.",
  },
  {
    id: 7,
    name: "Dr. Emily Davis",
    email: "emily@hospital.com",
    specialty: "Gynecologist",
    experience: 11,
    hospital: "Women's Care Hospital",
    rating: 4.8,
    consultationFee: 130,
    location: "Boston, USA",
    languages: ["English", "French"],
    availability: "Busy",
    image: "/doctors/doc7.jpg",
    bio: "Dr. Emily Davis earned her medical degree from Columbia University and specializes in women's reproductive health and prenatal care.",
  },
  {
    id: 8,
    name: "Dr. Ahmed Hassan",
    email: "ahmed@hospital.com",
    specialty: "ENT Specialist",
    experience: 7,
    hospital: "Advanced ENT Clinic",
    rating: 4.4,
    consultationFee: 75,
    location: "Seattle, USA",
    languages: ["English", "Arabic"],
    availability: "Available",
    image: "/doctors/doc8.jpg",
    bio: "Graduating from King’s College London, Dr. Ahmed Hassan treats ear, nose, and throat disorders for all age groups.",
  },
  {
    id: 9,
    name: "Dr. Laura Wilson",
    email: "laura@hospital.com",
    specialty: "Therapist",
    experience: 12,
    hospital: "MindCare Therapy Center",
    rating: 4.7,
    consultationFee: 100,
    location: "San Francisco, USA",
    languages: ["English"],
    availability: "Available",
    image: "/doctors/doc9.jpg",
    bio: "Dr. Laura Wilson helps patients with cognitive therapy, stress management, and mental wellness programs.",
  },
  {
    id: 10,
    name: "Dr. Daniel Kim",
    email: "daniel@hospital.com",
    specialty: "Oncologist",
    experience: 16,
    hospital: "Cancer Treatment Center",
    rating: 4.8,
    consultationFee: 200,
    location: "Atlanta, USA",
    languages: ["English", "Korean"],
    availability: "Busy",
    image: "/doctors/doc10.jpg",
    bio: "Dr. Daniel Kim graduated from Seoul National University and specializes in cancer treatment, chemotherapy, and oncology care.",
  },
  {
    id: 11,
    name: "Dr. Maria Lopez",
    email: "maria@hospital.com",
    specialty: "Endocrinologist",
    experience: 13,
    hospital: "EndoHealth Clinic",
    rating: 4.7,
    consultationFee: 115,
    location: "San Diego, USA",
    languages: ["English", "Spanish"],
    availability: "Available",
    image: "/doctors/doc11.jpg",
    bio: "Dr. Maria Lopez focuses on hormone disorders, diabetes management, and thyroid treatments.",
  },
  {
    id: 12,
    name: "Dr. Steven Clark",
    email: "steven@hospital.com",
    specialty: "Ophthalmologist",
    experience: 9,
    hospital: "Vision Care Center",
    rating: 4.6,
    consultationFee: 95,
    location: "Denver, USA",
    languages: ["English"],
    availability: "Offline",
    image: "/doctors/doc12.jpg",
    bio: "Dr. Steven Clark specializes in eye care, cataract surgery, and vision correction procedures.",
  },
];

  // … add all 12 doctors here

// API Route GET
export async function GET() {
  return NextResponse.json(doctors);
}
