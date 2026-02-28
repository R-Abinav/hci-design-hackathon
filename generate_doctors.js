import fs from 'fs';

const specialtiesDef = [
    { name: "General Physician", education: "MBBS, MD - Internal Medicine", icon: "Stethoscope" },
    { name: "Dentist", education: "BDS, MDS", icon: "Component" },
    { name: "Gynecologist", education: "MBBS, MS - Obstetrics & Gynecology", icon: "Baby" },
    { name: "Dermatologist", education: "MBBS, MD - Dermatology", icon: "Sparkles" },
    { name: "Pediatrician", education: "MBBS, MD - Pediatrics", icon: "Users" },
    { name: "Cardiologist", education: "MBBS, DM - Cardiology", icon: "HeartPulse" },
    { name: "Orthopedist", education: "MBBS, MS - Orthopedics", icon: "Bone" },
    { name: "ENT Specialist", education: "MBBS, MS - ENT", icon: "Ear" }
];

const firstNames = ["Priya", "Rajesh", "Anita", "Suresh", "Meena", "Arjun", "Kavita", "Rahul", "Sneha", "Vikram", "Neha", "Sanjay", "Anjali", "Ravi", "Pooja", "Amit", "Deepa", "Sunil", "Aarti", "Manoj"];
const lastNames = ["Sharma", "Kumar", "Desai", "Patel", "Krishnan", "Menon", "Reddy", "Singh", "Nair", "Iyer", "Rao", "Das", "Verma", "Jain", "Mehta", "Bose", "Gupta", "Chatterjee", "Bhatt", "Choudhury"];

const hospitals = ["Apollo Clinic", "Fortis Malar Hospital", "Skin & Care Clinic", "Rainbow Children's Hospital", "Cloudnine Hospital", "MIOT International", "Gleneagles Global", "Kauvery Hospital", "Sri Ramachandra Medical Centre", "Sims Hospital"];
const locations = ["Anna Nagar, Chennai", "T Nagar, Chennai", "Velachery, Chennai", "Adyar, Chennai", "Mylapore, Chennai", "Guindy, Chennai", "Nungambakkam, Chennai", "Alwarpet, Chennai", "OMR, Chennai", "Porur, Chennai"];

let doctors = [];
let idCounter = 1;

for (const spec of specialtiesDef) {
    for (let i = 0; i < 12; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];

        // just random slots
        const todaySlots = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].filter(() => Math.random() > 0.3);
        const tmrwSlots = ["10:00 AM", "11:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"].filter(() => Math.random() > 0.3);
        const dayAfterSlots = ["09:30 AM", "12:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"].filter(() => Math.random() > 0.3);

        const isAvailableToday = todaySlots.length > 0;

        // Convert to number for strict typing, mostly random floating 3.5 to 5
        let rawRating = (Math.random() * 1.5 + 3.5).toFixed(1);

        doctors.push({
            id: idCounter++,
            name: `Dr. ${fn} ${ln}`,
            specialty: spec.name,
            experience: Math.floor(Math.random() * 20) + 5,
            rating: parseFloat(rawRating),
            reviews: Math.floor(Math.random() * 900) + 50,
            fee: Math.floor(Math.random() * 7) * 100 + 400, // 400 to 1000
            location: locations[Math.floor(Math.random() * locations.length)],
            hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
            verified: true,
            available: isAvailableToday ? "Today" : "Tomorrow",
            avatar: `https://ui-avatars.com/api/?name=${fn}+${ln}&background=f0f4fa&color=2A348C`,
            education: spec.education,
            about: `Dr. ${fn} ${ln} is a highly experienced ${spec.name.toLowerCase()} with extensive clinical practice. Dedicated to providing excellent patient care.`,
            slots: {
                today: todaySlots,
                tomorrow: tmrwSlots,
                dayAfter: dayAfterSlots
            }
        });
    }
}

// Exactly match the count
const specialtiesExport = specialtiesDef.map(s => ({
    name: s.name,
    icon: s.icon,
    count: 12
}));

const specialtiesExportText = `export const specialties = ${JSON.stringify(specialtiesExport, null, 4)};\n`;

const fd = fs.openSync('./src/data/doctors.js', 'w');
fs.writeSync(fd, `export const doctors = ${JSON.stringify(doctors, null, 4)};\n\n${specialtiesExportText}`);
fs.closeSync(fd);
console.log("Successfully generated doctors data");
