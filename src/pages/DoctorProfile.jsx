import { useParams, useNavigate } from 'react-router-dom'
import { doctors } from '../data/doctors'
import * as LucideIcons from 'lucide-react'

/*
 * V3 FIX (continued): Clean, uncluttered profile
 * V10: F-Pattern — key info left, CTA right
 * V5: Strong CTA — Fitts's Law (large button)
 * Inverted Pyramid: most important info first
 *
 * END-SEM ADDITIONS:
 *   B5 — Visual Design Hierarchy: 3-level strict typographic scale
 *         name=text-2xl  >  specialty=text-base  >  metadata=text-sm
 *         Previously specialty was text-lg (same as the rating row), breaking the hierarchy.
 *   C1 — Persuasion Authority: Awards & Recognition section with credential badges.
 *   C2 — Persuasion Social Proof: "X people viewed today" live indicator.
 */
export default function DoctorProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const doctor = doctors.find(d => d.id === parseInt(id))

    if (!doctor) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-lg text-trust-500">Doctor not found.</p>
                <button onClick={() => navigate('/search')} className="btn-primary mt-4">
                    Back to Search
                </button>
            </div>
        )
    }

    return (
        <div className="page-enter-active max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb — Synthesizability: user knows where they are */}
            <nav className="flex items-center gap-2 text-sm text-trust-400 mb-6">
                <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors">Home</button>
                <span>›</span>
                <button onClick={() => navigate('/search')} className="hover:text-primary-600 transition-colors">Find Doctors</button>
                <span>›</span>
                <span className="text-trust-700 font-medium">{doctor.name}</span>
            </nav>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* V10: Left column — primary info (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Doctor header card */}
                    <div className="card">
                        <div className="flex items-start gap-5">
                            <img src={doctor.avatar} alt={doctor.name} className="w-24 h-24 rounded-2xl bg-white border border-primary-100 shrink-0 shadow-sm" />
                            <div className="flex-1">
                                {/* B5 — Level 1: Doctor name (largest, boldest) */}
                                <h1 className="text-2xl font-bold text-trust-900 flex items-center gap-2">
                                    {doctor.name}
                                    {doctor.verified && (
                                        <span className="text-sm bg-accent-100 text-accent-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                                            <LucideIcons.CheckCircle2 className="w-4 h-4" /> Verified
                                        </span>
                                    )}
                                </h1>
                                {/* B5 — Level 2: Specialty (text-base, one step below name) */}
                                <p className="text-base text-trust-500 mt-1">{doctor.specialty}</p>
                                {/* B5 — Level 3: Education (text-sm, smallest tier) */}
                                <p className="text-sm text-trust-400">{doctor.education}</p>

                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    <div className="flex items-center gap-1.5">
                                        <LucideIcons.Star className="w-5 h-5 fill-accent-500 text-accent-500" />
                                        <span className="text-lg font-bold text-trust-800">{doctor.rating}</span>
                                        <span className="text-sm text-trust-400">({doctor.reviews} reviews)</span>
                                    </div>
                                    <div className="w-px h-5 bg-trust-200"></div>
                                    <span className="text-base text-trust-600">{doctor.experience} years exp.</span>
                                    <div className="w-px h-5 bg-trust-200"></div>
                                    <span className="text-base text-trust-600 flex items-center gap-1.5"><LucideIcons.MapPin className="w-4 h-4 text-trust-500" /> {doctor.location}</span>
                                </div>
                                {/* C2 — Persuasion Social Proof: people viewed today */}
                                <div className="flex items-center gap-1.5 text-xs text-trust-500 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse inline-block" />
                                    {((doctor.id * 7 + 3) % 12) + 2} people viewed today
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-trust-900 mb-3">About</h2>
                        <p className="text-base text-trust-600 leading-relaxed">{doctor.about}</p>
                    </div>

                    {/* C1 — Persuasion Authority: Awards & Recognition — Cialdini */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-trust-900 mb-3">Awards &amp; Recognition</h2>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                                <LucideIcons.Award className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="font-medium">Top Doctor 2025 — Apollo Network</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                                <LucideIcons.Award className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="font-medium">Best {doctor.specialty} — Chennai Medical Awards</span>
                            </div>
                        </div>
                    </div>

                    {/* Hospital info */}

                    <div className="card">
                        <h2 className="text-xl font-semibold text-trust-900 mb-3">Clinic & Hospital</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                                <LucideIcons.Building2 className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-trust-800">{doctor.hospital}</p>
                                <p className="text-sm text-trust-500">{doctor.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column — booking CTA (1/3 width) */}
                <div className="space-y-4">
                    {/* Booking card — Fitts's Law: large target */}
                    <div className="card sticky top-24">
                        <h3 className="text-lg font-semibold text-trust-900 mb-1">Consultation Fee</h3>
                        <p className="text-3xl font-bold text-primary-600 mb-4">₹{doctor.fee}</p>

                        <div className="mb-4">
                            <span className={`text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit ${doctor.available === 'Today'
                                ? 'bg-accent-50 text-accent-700 border border-accent-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                <LucideIcons.Calendar className="w-4 h-4" /> Available {doctor.available}
                            </span>
                        </div>

                        {/* V5: Large CTA — Fitts's Law */}
                        <button
                            onClick={() => navigate(`/booking/${doctor.id}`)}
                            className="btn-primary w-full text-lg !py-4"
                        >
                            Book Appointment
                        </button>

                        <p className="text-xs text-trust-400 text-center mt-3">No booking fee • Instant confirmation</p>

                        {/* Trust indicators */}
                        <div className="mt-6 space-y-3 pt-4 border-t border-trust-100">
                            {[
                                { icon: <LucideIcons.ShieldCheck className="w-5 h-5 text-primary-500" />, text: 'Verified & trusted doctor' },
                                { icon: <LucideIcons.MessageSquare className="w-5 h-5 text-emerald-500" />, text: 'Free follow-up consultation' },
                                { icon: <LucideIcons.FileText className="w-5 h-5 text-purple-500" />, text: 'Digital prescription provided' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-trust-600">
                                    <span>{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
