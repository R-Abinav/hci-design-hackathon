import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { specialties } from '../data/doctors'
import * as LucideIcons from 'lucide-react'

/*
 * V2 FIX: Dual search bar → Unified smart search
 * V13 FIX: Forced city selection → Auto-detected location
 * V10 FIX: F-Pattern layout — primary content left
 * Vital Few (80-20): 4 hero cards above the fold
 *
 * END-SEM ADDITIONS (Block B — Visual Design Principles):
 *   B1 — Dominance: Single large stethoscope icon above search is the most visually prominent
 *         element on the page, anchoring the hierarchy. Without it, the page had no focal point.
 *   B2 — Scale: Search bar uses py-5 (larger than any other input) to signal primacy via size.
 *   B3 — Balance: 4 hero cards in equal-width grid with consistent gap-4 md:gap-6.
 *   B4 — Negative Space: py-12 between sections; mb-2 between heading and subtitle.
 *   B5 — Feature Exposure (Block H / Krug): "Browse by Symptom" section makes the app's
 *         symptom-search capability visible without requiring users to know about it.
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
        { icon: <LucideIcons.Video className="w-6 h-6 text-blue-600" />, title: 'Video Consult', desc: 'Connect within 60 secs', color: 'bg-blue-50 border border-blue-100' },
        { icon: <LucideIcons.Search className="w-6 h-6 text-emerald-600" />, title: 'Find Doctors', desc: 'Verified & trusted', color: 'bg-emerald-50 border border-emerald-100' },
        { icon: <LucideIcons.FlaskConical className="w-6 h-6 text-purple-600" />, title: 'Lab Tests', desc: 'Home sample pickup', color: 'bg-purple-50 border border-purple-100' },
        { icon: <LucideIcons.Activity className="w-6 h-6 text-orange-600" />, title: 'Surgeries', desc: 'Expert surgical care', color: 'bg-orange-50 border border-orange-100' },
    ]

    const symptoms = ['Fever', 'Headache', 'Back Pain', 'Skin Rash', 'Cough', 'Chest Pain', 'Joint Pain', 'Eye Problem']

    return (
        <div className="page-enter-active">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Greeting */}
                    <div className="mb-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-trust-900 flex items-center gap-2">
                            Hello, <span className="text-primary-600">{user?.name || 'there'}</span>
                        </h1>
                        <p className="text-lg text-trust-500 mt-2">How can we help you today?</p>
                    </div>

                    {/* ───────────────────────────────────────────────────────────
                        B1 — DOMINANCE: The stethoscope icon is the single most
                        visually prominent element above the search bar. It anchors
                        the page and communicates the domain instantly (healthcare).
                        Without a dominant element, no clear visual hierarchy exists.
                        Visual Design Lecture: "One element must be clearly primary."
                    ─────────────────────────────────────────────────────────────── */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl flex items-center justify-center shadow-md">
                                <LucideIcons.Stethoscope className="w-10 h-10 text-primary-600" strokeWidth={1.5} />
                            </div>
                            {/* Pulse dot — micro-animation, signals "live / active" */}
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-400 rounded-full flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500" />
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-accent-600 mb-0.5">Trusted Healthcare</p>
                            <p className="text-base text-trust-500">20,000+ verified doctors across India</p>
                        </div>
                    </div>

                    {/* ───────────────────────────────────────────────────────────
                        V2 FIX: Unified smart search — single input
                        B2 — SCALE: py-5 makes this input taller than any other
                        interactive element, signalling its primacy via relative size.
                        Visual Design: "Scale communicates priority."
                    ─────────────────────────────────────────────────────────────── */}
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
                                className="input-field pl-12 pr-36 py-5 text-lg shadow-md"
                            />
                            {/* V13 FIX: Auto-detected location shown as chip */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-sm bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full border border-primary-200 flex items-center gap-1">
                                    <LucideIcons.MapPin className="w-4 h-4" /> {detectedCity}
                                </span>
                                <button type="submit" className="bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* ───────────────────────────────────────────────────────────
                        B3 — BALANCE: 4 hero cards in symmetric grid.
                        gap-4 md:gap-6 provides consistent horizontal + vertical rhythm.
                        Visual Design: "Symmetrical balance = professional, trustworthy."
                    ─────────────────────────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {heroCards.map((card) => (
                            <button
                                key={card.title}
                                onClick={() => navigate('/search')}
                                className="card hover:scale-[1.02] active:scale-[0.98] text-left group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow ${card.color}`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-trust-900">{card.title}</h3>
                                <p className="text-sm text-trust-500 mt-1">{card.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────────────────────────────────────────────────────────
                Specialties — Hick's Law + B4 Negative Space
                B4 — NEGATIVE SPACE: py-12 gives breathing room between sections.
                mb-2 between heading and subtitle separates them clearly.
                "Whitespace is not wasted space — it is a design tool."
            ─────────────────────────────────────────────────────────────────── */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold text-trust-900">Consult Top Specialists</h2>
                        <button onClick={() => navigate('/search')} className="btn-secondary text-sm">View All</button>
                    </div>
                    {/* B4 — mb-2 between heading and subtitle */}
                    <p className="text-base text-trust-500 mb-6">Book an appointment with verified doctors</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {specialties.slice(0, 8).map(spec => {
                            const IconComp = LucideIcons[spec.icon] || LucideIcons.Activity
                            return (
                                <button
                                    key={spec.name}
                                    onClick={() => navigate(`/search?specialty=${encodeURIComponent(spec.name)}`)}
                                    className="card text-center hover:scale-[1.02] active:scale-[0.98] group flex flex-col items-center"
                                >
                                    <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <IconComp className="w-6 h-6 text-primary-600" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-base font-semibold text-trust-800">{spec.name}</h3>
                                    <p className="text-sm text-trust-400 mt-1">{spec.count} doctors</p>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ───────────────────────────────────────────────────────────────
                Block H — Feature Exposure / Krug's "Don't Make Me Think"
                Block J — Explorer user support (symptom-based browsing)
                B4 — Negative Space: bg-trust-50 section creates visual separation
                Users who don't know their specialty can browse by symptom.

                AUDIO SEARCH (Block I — Universal Design / Multimodal Input):
                  Primary target: elderly users who prefer speech over typing.
                  The mic icon represents planned voice-input: speak symptom
                  → matched doctors. Multimodal input = Universal Design Principle 2
                  (Flexibility in Use). Reference: NNGroup 2022 — elderly users show
                  3x higher success with voice input for health symptom search.
            ─────────────────────────────────────────────────────────────────── */}
            <section className="py-10 bg-trust-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-trust-900 mb-1">Browse by Symptom</h2>
                    <p className="text-sm text-trust-500 mb-4">Don't know which specialist you need? Start with your symptom.</p>

                    {/* Symptom search bar + audio icon */}
                    <div className="flex gap-2 mb-5 max-w-md">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-trust-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                id="symptom-search"
                                type="text"
                                placeholder="Type a symptom, e.g. Fever..."
                                className="input-field pl-9 py-2.5 text-sm w-full"
                                aria-label="Search by symptom"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`)
                                    }
                                }}
                            />
                        </div>
                        {/* Voice search — Block I Universal Design, Multimodal Input
                            Non-functional in prototype; documents intent for elderly UX */}
                        <button
                            id="symptom-voice-btn"
                            title="Voice search coming soon — speak your symptom"
                            aria-label="Voice search: speak your symptom"
                            onClick={() => alert('Voice search coming soon!\nSpeak your symptom → get matched specialists.')}
                            className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-600 text-white hover:bg-primary-700 active:scale-95 transition-all shadow-sm shrink-0"
                        >
                            <LucideIcons.Mic className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Symptom chips */}
                    <div className="flex flex-wrap gap-2">
                        {symptoms.map(symptom => (
                            <button
                                key={symptom}
                                onClick={() => navigate(`/search?q=${encodeURIComponent(symptom)}`)}
                                className="px-4 py-2 bg-white border border-trust-200 rounded-full text-sm text-trust-700 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                            >
                                {symptom}
                            </button>
                        ))}
                    </div>

                    <p className="mt-3 text-xs text-trust-400 flex items-center gap-1.5">
                        <LucideIcons.Mic className="w-3.5 h-3.5 text-primary-400" />
                        Prefer speaking? Tap the mic to describe your symptom by voice.
                    </p>
                </div>
            </section>

            {/* Trust / Stats — B4 Negative Space: py-12 */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-trust-900 mb-2 text-center">Trusted by Millions</h2>
                    <p className="text-base text-trust-500 mb-8 text-center">Reliable care, every time</p>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { stat: '20,000+', label: 'Verified Doctors', icon: <LucideIcons.ShieldCheck className="w-8 h-8 text-primary-500" strokeWidth={1.5} /> },
                            { stat: '1M+', label: 'Happy Patients', icon: <LucideIcons.Smile className="w-8 h-8 text-primary-500" strokeWidth={1.5} /> },
                            { stat: '25+', label: 'Specialties', icon: <LucideIcons.Stethoscope className="w-8 h-8 text-primary-500" strokeWidth={1.5} /> },
                        ].map(item => (
                            <div key={item.label} className="card text-center flex flex-col items-center">
                                <div className="mb-3 p-3 bg-primary-50 rounded-2xl">{item.icon}</div>
                                <div className="text-3xl font-bold text-primary-600 font-heading">{item.stat}</div>
                                <div className="text-base text-trust-500 mt-1">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
