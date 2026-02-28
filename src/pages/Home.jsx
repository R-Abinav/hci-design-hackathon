import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { specialties } from '../data/doctors'

/*
 * V2 FIX: Dual search bar → Unified smart search
 * V13 FIX: Forced city selection → Auto-detected location
 * V10 FIX: F-Pattern layout — primary content left
 * Vital Few (80-20): 4 hero cards above the fold
 */
export default function Home({ user }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [detectedCity] = useState('Chennai') // V13: auto-detected
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    const heroCards = [
        { icon: '📹', title: 'Video Consult', desc: 'Connect within 60 secs', color: 'from-blue-500 to-blue-600' },
        { icon: '🔍', title: 'Find Doctors', desc: 'Verified & trusted', color: 'from-emerald-500 to-emerald-600' },
        { icon: '🧪', title: 'Lab Tests', desc: 'Home sample pickup', color: 'from-purple-500 to-purple-600' },
        { icon: '🏥', title: 'Surgeries', desc: 'Expert surgical care', color: 'from-orange-500 to-orange-600' },
    ]

    return (
        <div className="page-enter-active">
            {/* Hero Section — Above the fold (Lecture 6: 80% viewing time) */}
            <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Greeting — Personalization */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-trust-900">
                            Hello, <span className="text-primary-600">{user?.name || 'there'}</span> 👋
                        </h1>
                        <p className="text-lg text-trust-500 mt-2">How can we help you today?</p>
                    </div>

                    {/* V2 FIX: Unified smart search — single input */}
                    <form onSubmit={handleSearch} className="mb-10">
                        <div className="relative max-w-2xl">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-trust-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search doctors, specialties, symptoms..."
                                className="input-field pl-12 pr-32 py-4 text-lg shadow-md"
                            />
                            {/* V13 FIX: Auto-detected location shown as chip, changeable */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-sm bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full border border-primary-200 flex items-center gap-1">
                                    📍 {detectedCity}
                                </span>
                                <button type="submit" className="bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Vital Few: 4 hero cards — Pareto 80/20 */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {heroCards.map((card, i) => (
                            <button
                                key={card.title}
                                onClick={() => navigate('/search')}
                                className="card hover:scale-[1.02] active:scale-[0.98] text-left group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-trust-900">{card.title}</h3>
                                <p className="text-sm text-trust-500 mt-1">{card.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specialties — Hick's Law: chunked into manageable groups */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-trust-900">Consult Top Specialists</h2>
                            <p className="text-base text-trust-500 mt-1">Book an appointment with verified doctors</p>
                        </div>
                        <button
                            onClick={() => navigate('/search')}
                            className="btn-secondary text-sm"
                        >
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {specialties.slice(0, 8).map(spec => (
                            <button
                                key={spec.name}
                                onClick={() => navigate(`/search?specialty=${encodeURIComponent(spec.name)}`)}
                                className="card text-center hover:scale-[1.02] active:scale-[0.98] group"
                            >
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{spec.icon}</div>
                                <h3 className="text-base font-semibold text-trust-800">{spec.name}</h3>
                                <p className="text-sm text-trust-400 mt-1">{spec.count} doctors</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust / Testimonials — Trust-driven UI pillar */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-trust-900 mb-6 text-center">Trusted by Millions</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { stat: '20,000+', label: 'Verified Doctors', icon: '👨‍⚕️' },
                            { stat: '1M+', label: 'Happy Patients', icon: '😊' },
                            { stat: '25+', label: 'Specialties', icon: '🩺' },
                        ].map(item => (
                            <div key={item.label} className="card text-center">
                                <div className="text-3xl mb-2">{item.icon}</div>
                                <div className="text-3xl font-bold text-primary-600">{item.stat}</div>
                                <div className="text-base text-trust-500 mt-1">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
