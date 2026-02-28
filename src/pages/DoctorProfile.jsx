import { useParams, useNavigate } from 'react-router-dom'
import { doctors } from '../data/doctors'

/*
 * V3 FIX (continued): Clean, uncluttered profile
 * V10: F-Pattern — key info left, CTA right
 * V5: Strong CTA — Fitts's Law (large button)
 * Inverted Pyramid: most important info first
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
                            <div className="w-24 h-24 rounded-2xl bg-primary-50 flex items-center justify-center text-5xl shrink-0">
                                {doctor.avatar}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-trust-900 flex items-center gap-2">
                                    {doctor.name}
                                    {doctor.verified && (
                                        <span className="text-sm bg-accent-100 text-accent-700 px-2.5 py-1 rounded-full font-medium">
                                            ✓ Verified
                                        </span>
                                    )}
                                </h1>
                                <p className="text-lg text-trust-500 mt-1">{doctor.specialty}</p>
                                <p className="text-base text-trust-400">{doctor.education}</p>

                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-accent-500">⭐</span>
                                        <span className="text-lg font-bold text-trust-800">{doctor.rating}</span>
                                        <span className="text-sm text-trust-400">({doctor.reviews} reviews)</span>
                                    </div>
                                    <div className="w-px h-5 bg-trust-200"></div>
                                    <span className="text-base text-trust-600">{doctor.experience} years exp.</span>
                                    <div className="w-px h-5 bg-trust-200"></div>
                                    <span className="text-base text-trust-600">📍 {doctor.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-trust-900 mb-3">About</h2>
                        <p className="text-base text-trust-600 leading-relaxed">{doctor.about}</p>
                    </div>

                    {/* Hospital info */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-trust-900 mb-3">Clinic & Hospital</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-xl">🏥</div>
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
                            <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${doctor.available === 'Today'
                                    ? 'bg-accent-50 text-accent-700 border border-accent-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                📅 Available {doctor.available}
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
                                { icon: '🛡️', text: 'Verified & trusted doctor' },
                                { icon: '💬', text: 'Free follow-up consultation' },
                                { icon: '📋', text: 'Digital prescription provided' },
                            ].map(item => (
                                <div key={item.text} className="flex items-center gap-2 text-sm text-trust-600">
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
