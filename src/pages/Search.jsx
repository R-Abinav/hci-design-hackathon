import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { doctors, SYMPTOM_MAP } from '../data/doctors'
import * as LucideIcons from 'lucide-react'

/*
 * V3 FIX: Cluttered doctor cards → Progressive disclosure
 * V12 FIX: Alphabetical sort → Default relevance/rating
 * V10: Left-aligned results (Horizontal Attention / F-Pattern)
 * Inverted Pyramid: essential info first, details on expand
 *
 * END-SEM ADDITIONS:
 * Block A — Gestalt Laws:
 *   Proximity: name/specialty cluster vs availability/CTA cluster (mt-3 gap)
 *   Similarity: all Verified badges identical; all availability pills identical style
 *   Figure & Ground: white cards on trust-50 background
 *   Continuity: left-border stripe guides eye downward through metadata
 *   Common Fate: framer-motion AnimatePresence — all cards animate same direction on sort
 *   Closure: progress indicator on booking uses partial arcs (closure = brain completes the ring)
 * Block G — Interaction Design Paradigms:
 *   Menu Selection: specialty filter pills (predefined command set, no typing needed)
 *   Direct Manipulation: sort pills → instant animated result (covered by Common Fate above)
 * Block I — Universal Design:
 *   Perceptible Information: aria-labels on availability badges (not just color-coded)
 * Block J — Google Search Case Study:
 *   Navigator: recent searches via localStorage
 *   Explorer: symptom chips shown when query is empty
 *
 * SYMPTOM SEARCH ENHANCEMENT (Phase 5 fix):
 * - Doctors now have a `symptoms` tag array.
 * - Search matches against name, specialty, AND symptoms tags.
 * - SYMPTOM_MAP provides specialty priority ordering for symptom queries.
 * - Fallback ensures General Physicians always shown if nothing matches
 *   → "No doctors found" state is eliminated per user requirement.
 */

const SPECIALTIES = [
  'All', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedist', 'Pediatrician', 'General Physician', 'Gynecologist',
  'Ophthalmologist', 'Pulmonologist', 'Rheumatologist', 'ENT Specialist', 'Dentist',
]

const SYMPTOM_CHIPS = ['Fever', 'Headache', 'Back Pain', 'Skin Rash', 'Cough', 'Chest Pain', 'Joint Pain', 'Eye Problem']

/**
 * Resolve a search query to a prioritised list of specialties using SYMPTOM_MAP.
 * Returns null if no symptom match found.
 */
function resolveSymptomSpecialties(q) {
  if (!q) return null
  const lower = q.toLowerCase()
  for (const [symptom, specs] of Object.entries(SYMPTOM_MAP)) {
    if (lower.includes(symptom)) return specs
  }
  return null
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || searchParams.get('specialty') || ''
  const [query, setQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState('relevance')
  const [expandedCard, setExpandedCard] = useState(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')

  // Block J — Navigator: persistent recent searches
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bp_recent') || '[]') } catch { return [] }
  })

  const navigate = useNavigate()

  const handleSearch = (term) => {
    setQuery(term)
    if (!term.trim()) return
    const updated = [term, ...recentSearches.filter(r => r !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('bp_recent', JSON.stringify(updated))
  }

  // SYMPTOM FIX: filter matches name, specialty, OR symptoms tag array
  const filteredDoctors = useMemo(() => {
    const q = query.toLowerCase().trim()

    // 1. Primary filter: match name, specialty, OR symptoms array
    let results = doctors.filter(d => {
      const nameMatch = d.name.toLowerCase().includes(q)
      const specialtyMatch = d.specialty.toLowerCase().includes(q)
      const symptomMatch = Array.isArray(d.symptoms)
        ? d.symptoms.some(s => s.toLowerCase().includes(q) || q.includes(s.toLowerCase()))
        : false
      const queryMatch = !q || nameMatch || specialtyMatch || symptomMatch

      const specFilter = selectedSpecialty === 'All' || d.specialty === selectedSpecialty
      return queryMatch && specFilter
    })

    // 2. Smart fallback: never show 0 results
    if (results.length === 0 && selectedSpecialty === 'All' && q) {
      const symptomSpecs = resolveSymptomSpecialties(q)
      if (symptomSpecs) {
        results = doctors.filter(d => symptomSpecs.includes(d.specialty))
      }
      if (results.length === 0) {
        // Catch-all: show General Physicians
        results = doctors.filter(d => d.specialty === 'General Physician')
      }
    }

    // 3. Sort: apply symptom-priority ordering first, then user sort
    const prioritySpecs = resolveSymptomSpecialties(q)
    if (prioritySpecs && q && selectedSpecialty === 'All') {
      results = [...results].sort((a, b) => {
        const aIdx = prioritySpecs.indexOf(a.specialty)
        const bIdx = prioritySpecs.indexOf(b.specialty)
        if (aIdx !== -1 && bIdx === -1) return -1
        if (bIdx !== -1 && aIdx === -1) return 1
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
        // Within same specialty, sort by rating
        return b.rating - a.rating
      })
    } else {
      switch (sortBy) {
        case 'relevance':
          results = [...results].sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
          break
        case 'rating':
          results = [...results].sort((a, b) => b.rating - a.rating)
          break
        case 'experience':
          results = [...results].sort((a, b) => b.experience - a.experience)
          break
        case 'fee-low':
          results = [...results].sort((a, b) => a.fee - b.fee)
          break
      }
    }

    return results
  }, [query, sortBy, selectedSpecialty])

  // Derive a helpful label for the results section
  const symptomSpecialties = query ? resolveSymptomSpecialties(query) : null

  return (
    // Block A — Figure & Ground: trust-50 ground, white cards as figure
    <div className="bg-trust-50 min-h-screen">
      <div className="page-enter-active max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search bar — V2: unified */}
        <div className="mb-4">
          <div className="relative max-w-xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-trust-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              placeholder="Search doctors, specialties, symptoms..."
              className="input-field pl-12"
              aria-label="Search doctors or specialties"
            />
          </div>
        </div>

        {/* Block J — Navigator: recent searches */}
        {recentSearches.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs text-trust-400 font-medium">Recent:</span>
            {recentSearches.map(r => (
              <button
                key={r}
                onClick={() => handleSearch(r)}
                className="text-xs px-3 py-1 bg-white text-trust-600 rounded-full hover:bg-primary-50 hover:text-primary-700 border border-trust-200 transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Block J — Explorer: symptom chips when no query typed */}
        {!query && (
          <div className="mb-5">
            <p className="text-xs text-trust-500 font-medium mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_CHIPS.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => handleSearch(symptom)}
                  className="px-3 py-1.5 bg-white text-primary-700 border border-primary-200 rounded-full text-sm hover:bg-primary-50 transition-colors"
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Symptom context banner — explains smart routing */}
        {query && symptomSpecialties && (
          <div className="mb-4 px-4 py-2.5 bg-primary-50 border border-primary-200 rounded-xl flex items-center gap-2 text-sm text-primary-700">
            <LucideIcons.Lightbulb className="w-4 h-4 shrink-0" />
            <span>
              Showing recommended specialists for <strong>"{query}"</strong>: {symptomSpecialties.join(', ')}
            </span>
          </div>
        )}

        {/* Block G — Menu Selection: Specialty filter pills (predefined command set) */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-sm font-semibold text-trust-600">Specialty:</span>
          {SPECIALTIES.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedSpecialty === spec
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-trust-600 border-trust-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Sort pills — V12: relevance default, NOT alphabetical */}
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
          {selectedSpecialty !== 'All' && ` · ${selectedSpecialty}`}
        </p>

        {/* ─────────────────────────────────────────────────────────────────
            Block A — Gestalt Common Fate: all cards animate same direction
            when sort changes → perceived as a unified group by the brain.
            Block A — Gestalt Figure & Ground: white cards on trust-50 bg.
        ──────────────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map(doctor => (
              <motion.div
                key={doctor.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="card">
                  {/* V3: Essential info visible first (Inverted Pyramid) */}
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-2xl border border-primary-100 shrink-0 shadow-sm"
                    />

                    {/* V10: Primary info left-aligned */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">

                        {/* Block A — Gestalt Proximity: name/specialty/exp grouped together (space-y-0.5) */}
                        <div className="space-y-0.5">
                          <h3 className="text-lg font-semibold text-trust-900 flex items-center gap-2">
                            {doctor.name}
                            {/* Block A — Similarity: every Verified badge identical JSX + style */}
                            {doctor.verified && (
                              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <LucideIcons.CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </h3>
                          <p className="text-base text-trust-500">{doctor.specialty}</p>
                          <p className="text-sm text-trust-400">{doctor.experience} years experience</p>
                        </div>

                        {/* Rating — Serial Position: important info at edges */}
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1 text-lg font-bold text-accent-600 justify-end">
                            <LucideIcons.Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                            <span>{doctor.rating}</span>
                          </div>
                          <p className="text-xs text-trust-400">{doctor.reviews} reviews</p>
                        </div>
                      </div>

                      {/* Block A — Gestalt Continuity: left-border stripe guides eye downward
                          Block A — Gestalt Proximity: availability/location cluster separate from name cluster via mt-3
                          Block I — Universal Design / Perceptible Information: aria-labels on badges */}
                      <div className="border-l-2 border-primary-100 pl-3 mt-3 space-y-1.5">
                        <div className="flex items-center gap-3">
                          {/* Block A — Similarity: all availability badges identical pill style */}
                          <span
                            aria-label={`Available ${doctor.available}`}
                            className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${doctor.available === 'Today'
                              ? 'bg-accent-50 text-accent-700 border border-accent-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                          >
                            <LucideIcons.Calendar className="w-4 h-4" /> Available {doctor.available}
                          </span>
                          <span className="text-sm text-trust-500 flex items-center gap-1.5">
                            <LucideIcons.MapPin className="w-4 h-4" /> {doctor.location}
                          </span>
                        </div>
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
              </motion.div>
            ))}
          </AnimatePresence>

          {/* This should now never appear, but kept as safety net */}
          {filteredDoctors.length === 0 && (
            <div className="card text-center py-16">
              <LucideIcons.SearchX className="w-12 h-12 text-trust-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-trust-500">No doctors found</p>
              <p className="text-sm text-trust-400 mt-1">Try a different search term or specialty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
