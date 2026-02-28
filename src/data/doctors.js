export const doctors = [
    {
        id: 1,
        name: "Dr. Priya Sharma",
        specialty: "General Physician",
        experience: 15,
        rating: 4.8,
        reviews: 312,
        fee: 500,
        location: "Anna Nagar, Chennai",
        hospital: "Apollo Clinic",
        verified: true,
        available: "Today",
        avatar: "👩‍⚕️",
        education: "MBBS, MD - Internal Medicine",
        about: "Dr. Priya Sharma is a highly experienced general physician with 15 years of practice. She specializes in preventive care, chronic disease management, and holistic health.",
        slots: {
            today: ["10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:30 PM"],
            tomorrow: ["09:00 AM", "09:30 AM", "11:30 AM", "01:00 PM", "03:30 PM"],
            dayAfter: ["10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "05:00 PM", "05:30 PM"]
        }
    },
    {
        id: 2,
        name: "Dr. Rajesh Kumar",
        specialty: "Cardiologist",
        experience: 22,
        rating: 4.9,
        reviews: 547,
        fee: 800,
        location: "T Nagar, Chennai",
        hospital: "Fortis Malar Hospital",
        verified: true,
        available: "Today",
        avatar: "👨‍⚕️",
        education: "MBBS, DM - Cardiology",
        about: "Dr. Rajesh Kumar is a renowned cardiologist with over 22 years of experience in interventional cardiology and cardiac care.",
        slots: {
            today: ["11:00 AM", "11:30 AM", "03:00 PM", "04:00 PM"],
            tomorrow: ["10:00 AM", "10:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
            dayAfter: ["09:00 AM", "11:00 AM", "01:00 PM"]
        }
    },
    {
        id: 3,
        name: "Dr. Anita Desai",
        specialty: "Dermatologist",
        experience: 10,
        rating: 4.7,
        reviews: 198,
        fee: 600,
        location: "Velachery, Chennai",
        hospital: "Skin & Care Clinic",
        verified: true,
        available: "Tomorrow",
        avatar: "👩‍⚕️",
        education: "MBBS, MD - Dermatology",
        about: "Dr. Anita Desai specializes in cosmetic dermatology, acne treatment, and skin allergy management with 10 years of clinical experience.",
        slots: {
            today: [],
            tomorrow: ["10:00 AM", "11:00 AM", "11:30 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
            dayAfter: ["09:30 AM", "10:30 AM", "01:00 PM", "03:30 PM"]
        }
    },
    {
        id: 4,
        name: "Dr. Suresh Patel",
        specialty: "Pediatrician",
        experience: 18,
        rating: 4.9,
        reviews: 421,
        fee: 450,
        location: "Adyar, Chennai",
        hospital: "Rainbow Children's Hospital",
        verified: true,
        available: "Today",
        avatar: "👨‍⚕️",
        education: "MBBS, MD - Pediatrics",
        about: "Dr. Suresh Patel is a trusted pediatrician known for his compassionate care and expertise in child health and development.",
        slots: {
            today: ["09:00 AM", "10:00 AM", "10:30 AM", "02:00 PM", "03:00 PM"],
            tomorrow: ["09:30 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
            dayAfter: ["10:00 AM", "11:30 AM", "02:30 PM", "03:30 PM", "05:00 PM"]
        }
    },
    {
        id: 5,
        name: "Dr. Meena Krishnan",
        specialty: "Gynecologist",
        experience: 20,
        rating: 4.8,
        reviews: 389,
        fee: 700,
        location: "Mylapore, Chennai",
        hospital: "Cloudnine Hospital",
        verified: true,
        available: "Today",
        avatar: "👩‍⚕️",
        education: "MBBS, MS - Obstetrics & Gynecology",
        about: "Dr. Meena Krishnan has 20 years of experience in obstetrics, gynecology, and women's health. She is known for her patient-first approach.",
        slots: {
            today: ["10:00 AM", "11:00 AM", "03:00 PM", "04:00 PM", "05:00 PM"],
            tomorrow: ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"],
            dayAfter: ["11:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"]
        }
    },
    {
        id: 6,
        name: "Dr. Arjun Menon",
        specialty: "Orthopedist",
        experience: 12,
        rating: 4.6,
        reviews: 156,
        fee: 650,
        location: "Guindy, Chennai",
        hospital: "MIOT International",
        verified: true,
        available: "Tomorrow",
        avatar: "👨‍⚕️",
        education: "MBBS, MS - Orthopedics",
        about: "Dr. Arjun Menon specializes in sports medicine, joint replacement, and fracture management with 12 years of surgical experience.",
        slots: {
            today: [],
            tomorrow: ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:30 PM"],
            dayAfter: ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"]
        }
    }
]

export const specialties = [
    { name: "General Physician", icon: "🩺", count: 291 },
    { name: "Dentist", icon: "🦷", count: 184 },
    { name: "Gynecologist", icon: "👶", count: 156 },
    { name: "Dermatologist", icon: "✨", count: 132 },
    { name: "Pediatrician", icon: "👶", count: 198 },
    { name: "Cardiologist", icon: "❤️", count: 87 },
    { name: "Orthopedist", icon: "🦴", count: 94 },
    { name: "ENT Specialist", icon: "👂", count: 76 },
]
