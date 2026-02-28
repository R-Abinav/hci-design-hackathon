import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doctors } from '../data/doctors'

/*
 * V5 FIX: Weak booking feedback → Progress bar + success animation
 * V14 FIX: No progress indicator → Step indicator (1/3, 2/3, 3/3)
 * V11 FIX: Reset buttons → No reset; individual clear + undo
 * Closure (Shneiderman #4): User knows when booking is complete
 */
export default function Booking() {
    const { id } = useParams()
    const navigate = useNavigate()
    const doctor = doctors.find(d => d.id === parseInt(id))

    const [step, setStep] = useState(1) // V14: step tracking
    const [selectedDay, setSelectedDay] = useState('today')
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [patientName, setPatientName] = useState('')
    const [patientPhone, setPatientPhone] = useState('')
    const [loading, setLoading] = useState(false)

    if (!doctor) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <p className="text-lg text-trust-500">Doctor not found.</p>
                <button onClick={() => navigate('/search')} className="btn-primary mt-4">Back to Search</button>
            </div>
        )
    }

    const dayLabels = { today: 'Today', tomorrow: 'Tomorrow', dayAfter: 'Day After' }
    const slots = doctor.slots[selectedDay] || []

    const handleConfirm = async () => {
        setLoading(true)
        // Simulate booking — Shneiderman #3: Feedback
        await new Promise(resolve => setTimeout(resolve, 2000))
        setLoading(false)
        setStep(3) // Move to success — Closure
    }

    // V14: Step labels
    const steps = [
        { num: 1, label: 'Select Slot' },
        { num: 2, label: 'Confirm' },
        { num: 3, label: 'Booked!' },
    ]

    return (
        <div className="page-enter-active max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-trust-400 mb-6">
                <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors">Home</button>
                <span>›</span>
                <button onClick={() => navigate(`/doctor/${doctor.id}`)} className="hover:text-primary-600 transition-colors">{doctor.name}</button>
                <span>›</span>
                <span className="text-trust-700 font-medium">Book Appointment</span>
            </nav>

            {/* V14 FIX: Progress bar with step labels */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    {steps.map((s, i) => (
                        <div key={s.num} className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s.num
                                ? step === s.num && s.num === 3
                                    ? 'bg-accent-500 text-white shadow-lg shadow-accent-200'
                                    : 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                : 'bg-trust-100 text-trust-400'
                                }`}>
                                {step > s.num ? '✓' : s.num}
                            </div>
                            <span className={`text-sm font-medium hidden sm:inline ${step >= s.num ? 'text-trust-900' : 'text-trust-400'
                                }`}>
                                {s.label}
                            </span>
                            {i < steps.length - 1 && (
                                <div className={`hidden sm:block w-16 lg:w-24 h-1 rounded-full mx-2 transition-all duration-500 ${step > s.num ? 'bg-primary-500' : 'bg-trust-100'
                                    }`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Select slot */}
            {step === 1 && (
                <div className="card animate-in">
                    <div className="flex items-center gap-3 mb-6">
                        <img src={doctor.avatar} alt={doctor.name} className="w-14 h-14 rounded-xl border border-primary-100 shrink-0" />
                        <div>
                            <h2 className="text-lg font-semibold text-trust-900">{doctor.name}</h2>
                            <p className="text-sm text-trust-500">{doctor.specialty} • ₹{doctor.fee}</p>
                        </div>
                    </div>

                    {/* Day selector */}
                    <div className="flex gap-2 mb-6">
                        {Object.entries(dayLabels).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => { setSelectedDay(key); setSelectedSlot(null) }}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${selectedDay === key
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-trust-50 text-trust-600 hover:bg-trust-100 border border-trust-200'
                                    }`}
                            >
                                {label}
                                <span className="block text-xs font-normal mt-0.5 opacity-80">
                                    {(doctor.slots[key] || []).length} slots
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Time slots — Constraints: only available slots clickable */}
                    {slots.length > 0 ? (
                        <>
                            <p className="text-sm font-semibold text-trust-600 mb-3">Available Slots</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-3 rounded-xl text-sm font-medium transition-all ${selectedSlot === slot
                                            ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-300'
                                            : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-trust-400">
                            <p className="text-lg">No slots available</p>
                            <p className="text-sm mt-1">Try selecting a different day</p>
                        </div>
                    )}

                    {/* V11: No reset button — Shneiderman #5 reversal via back/deselect */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-trust-100">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm text-trust-500 hover:text-trust-700 font-medium transition-colors"
                        >
                            ← Go Back
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!selectedSlot}
                            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Confirm details */}
            {step === 2 && (
                <div className="card animate-in">
                    <h2 className="text-xl font-semibold text-trust-900 mb-6">Confirm Your Appointment</h2>

                    {/* Appointment summary — Closure */}
                    <div className="bg-primary-50 rounded-xl p-5 mb-6 border border-primary-100">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-xl border border-primary-100 shrink-0" />
                            <div>
                                <p className="font-semibold text-trust-900">{doctor.name}</p>
                                <p className="text-sm text-trust-500">{doctor.specialty}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-trust-500">Date:</span> <span className="font-medium text-trust-800">{dayLabels[selectedDay]}</span></div>
                            <div><span className="text-trust-500">Time:</span> <span className="font-medium text-trust-800">{selectedSlot}</span></div>
                            <div><span className="text-trust-500">Fee:</span> <span className="font-medium text-trust-800">₹{doctor.fee}</span></div>
                            <div><span className="text-trust-500">Hospital:</span> <span className="font-medium text-trust-800">{doctor.hospital}</span></div>
                        </div>
                    </div>

                    {/* Patient details — V11: individual field clear, no reset */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-trust-700 mb-1.5">Patient Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    placeholder="Enter patient name"
                                    className="input-field"
                                />
                                {patientName && (
                                    <button
                                        onClick={() => setPatientName('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-trust-300 hover:text-trust-500"
                                    >✕</button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-trust-700 mb-1.5">Mobile Number</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={patientPhone}
                                    onChange={(e) => setPatientPhone(e.target.value)}
                                    placeholder="Enter mobile number"
                                    className="input-field"
                                />
                                {patientPhone && (
                                    <button
                                        onClick={() => setPatientPhone('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-trust-300 hover:text-trust-500"
                                    >✕</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions — V11: No reset! Only back and confirm */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-trust-100">
                        <button
                            onClick={() => setStep(1)}
                            className="text-sm text-trust-500 hover:text-trust-700 font-medium transition-colors"
                        >
                            ← Change Slot
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading || !patientName || !patientPhone}
                            className="btn-primary flex items-center gap-2 disabled:opacity-40"
                        >
                            {loading ? (
                                <>
                                    <div className="loader !w-5 !h-5 !border-2 !border-white/30 !border-t-white"></div>
                                    Booking...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success! — V5: Closure with animation */}
            {step === 3 && (
                <div className="card text-center py-12 animate-in">
                    {/* Success animation */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-100 flex items-center justify-center"
                        style={{ animation: 'scale-in 0.5s ease-out' }}>
                        <svg className="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-trust-900 mb-2">Appointment Booked!</h2>
                    <p className="text-base text-trust-500 mb-8">Your appointment has been confirmed successfully.</p>

                    {/* Booking summary */}
                    <div className="bg-trust-50 rounded-xl p-6 max-w-sm mx-auto mb-8 text-left">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-trust-500">Doctor</span>
                                <span className="font-medium text-trust-800">{doctor.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-trust-500">Date</span>
                                <span className="font-medium text-trust-800">{dayLabels[selectedDay]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-trust-500">Time</span>
                                <span className="font-medium text-trust-800">{selectedSlot}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-trust-500">Hospital</span>
                                <span className="font-medium text-trust-800">{doctor.hospital}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-trust-200">
                                <span className="text-trust-500 font-medium">Total</span>
                                <span className="font-bold text-primary-600 text-lg">₹{doctor.fee}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Go to Dashboard
                        </button>
                        <button onClick={() => navigate('/search')} className="btn-secondary">
                            Book Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
