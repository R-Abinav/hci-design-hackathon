import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { doctors } from '../data/doctors'

/*
 * V3 FIX: Cluttered doctor cards → Progressive disclosure
 * V12 FIX: Alphabetical sort → Default relevance/rating
 * V10: Left-aligned results (Horizontal Attention)
 * Inverted Pyramid: essential info first, details on expand
 */
export default function Search() {
    const [searchParams] = useSearchParams()
    const initialQuery = searchParams.get('q') || searchParams.get('specialty') || ''
    const [query, setQuery] = useState(initialQuery)
    const [sortBy, setSortBy] = useState('relevance') // V12: default relevance
    const [expandedCard, setExpandedCard] = useState(null)
    const navigate = useNavigate()

    // Filter and sort doctors
    const filteredDoctors = useMemo(() => {
        let results = doctors.filter(d =>
            !query ||
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.specialty.toLowerCase().includes(query.toLowerCase())
        )

        // V12: Sort by relevance (rating × reviews) by default
        switch (sortBy) {
            case 'relevance':
                results.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
                break
            case 'rating':
                results.sort((a, b) => b.rating - a.rating)
                break
            case 'experience':
                results.sort((a, b) => b.experience - a.experience)
                break
            case 'fee-low':
                results.sort((a, b) => a.fee - b.fee)
                break
        }

        return results
    }, [query, sortBy])

    return (
        <div className="page-enter-active max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search bar — V2: unified */}
            <div className="mb-6">
                <div className="relative max-w-xl">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-trust-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search doctors, specialties..."
                        className="input-field pl-12"
                    />
                </div>
            </div>

            {/* Filters + Sort — V12: relevance default, NOT alphabetical */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-sm font-semibold text-trust-600">Sort by:</span>
                {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'rating', label: 'Rating' },
                    { value: 'experience', label: 'Experience' },
                    { value: 'fee-low', label: 'Fee: Low to High' },
                ].map(option => (
                    <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === option.value
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-white text-trust-600 border border-trust-200 hover:border-primary-300 hover:text-primary-600'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Results count */}
            <p className="text-base text-trust-600 mb-4 font-medium">
                {filteredDoctors.length} doctors found {query && `for "${query}"`}
            </p>

            {/* Doctor cards — V3: Progressive disclosure */}
            <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="card">
                        {/* V3: Essential info visible first (Inverted Pyramid) */}
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl shrink-0">
                                {doctor.avatar}
                            </div>

                            {/* V10: Primary info left-aligned */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-trust-900 flex items-center gap-2">
                                            {doctor.name}
                                            {doctor.verified && (
                                                <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full font-medium">
                                                    ✓ Verified
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-base text-trust-500">{doctor.specialty}</p>
                                        <p className="text-sm text-trust-400 mt-0.5">{doctor.experience} years experience</p>
                                    </div>

                                    {/* Rating — Serial Position: important info at edges */}
                                    <div className="text-right shrink-0">
                                        <div className="flex items-center gap-1 text-lg font-bold text-accent-600">
                                            <span>⭐</span>
                                            <span>{doctor.rating}</span>
                                        </div>
                                        <p className="text-xs text-trust-400">{doctor.reviews} reviews</p>
                                    </div>
                                </div>

                                {/* Availability — Shneiderman #3: Feedback */}
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${doctor.available === 'Today'
                                            ? 'bg-accent-50 text-accent-700 border border-accent-200'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}>
                                        📅 Available {doctor.available}
                                    </span>
                                    <span className="text-sm text-trust-500">📍 {doctor.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* V3: Progressive disclosure — expand for details */}
                        <div className="mt-4 flex items-center justify-between border-t border-trust-100 pt-4">
                            <button
                                onClick={() => setExpandedCard(expandedCard === doctor.id ? null : doctor.id)}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
                            >
                                {expandedCard === doctor.id ? 'Show less' : 'More details'}
                                <svg className={`w-4 h-4 transition-transform ${expandedCard === doctor.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-trust-800">₹{doctor.fee}</span>
                                <button
                                    onClick={() => navigate(`/doctor/${doctor.id}`)}
                                    className="btn-primary text-sm !px-5 !py-2.5"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>

                        {/* Expanded details */}
                        {expandedCard === doctor.id && (
                            <div className="mt-4 pt-4 border-t border-trust-100 space-y-2 text-sm text-trust-600 animate-in">
                                <p><span className="font-semibold text-trust-700">Education:</span> {doctor.education}</p>
                                <p><span className="font-semibold text-trust-700">Hospital:</span> {doctor.hospital}</p>
                                <p><span className="font-semibold text-trust-700">About:</span> {doctor.about}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
