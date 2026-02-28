import { useState } from 'react'
import * as LucideIcons from 'lucide-react'

/*
 * V4 FIX: No onboarding → 3-step guided tour
 * Learnability, Familiarity, Power Law of Practice
 * User Control: skip button always available
 */
export default function Onboarding({ onComplete }) {
    const [step, setStep] = useState(0)

    const steps = [
        {
            icon: <LucideIcons.Search size={64} className="text-white" strokeWidth={1.5} />,
            title: 'Find Trusted Doctors',
            description: 'Search by specialty, symptom, or doctor name. We show only verified doctors with real patient reviews.',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: <LucideIcons.Calendar size={64} className="text-white" strokeWidth={1.5} />,
            title: 'Book Instantly',
            description: 'Choose a convenient time slot and book your appointment in just 3 simple steps. No phone calls needed.',
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            icon: <LucideIcons.Pill size={64} className="text-white" strokeWidth={1.5} />,
            title: 'Get Care, Your Way',
            description: 'Visit in-clinic or consult via video call. Receive digital prescriptions and follow-up reminders.',
            color: 'from-purple-500 to-purple-600',
        },
    ]

    const current = steps[step]

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Illustration area */}
                <div className={`bg-gradient-to-br ${current.color} p-10 text-center`}>
                    <div className="text-7xl mb-4" style={{ animation: 'scale-in 0.4s ease-out' }}>
                        {current.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{current.title}</h2>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-base text-trust-600 text-center leading-relaxed mb-8">
                        {current.description}
                    </p>

                    {/* Progress dots */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-full transition-all duration-300 ${i === step
                                    ? 'w-8 h-2.5 bg-primary-600'
                                    : i < step
                                        ? 'w-2.5 h-2.5 bg-primary-300'
                                        : 'w-2.5 h-2.5 bg-trust-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onComplete}
                            className="text-sm text-trust-400 hover:text-trust-600 font-medium transition-colors"
                        >
                            Skip
                        </button>

                        {step < steps.length - 1 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="btn-primary"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={onComplete}
                                className="btn-primary !bg-accent-600 hover:!bg-accent-700 flex items-center justify-center gap-2"
                            >
                                Get Started <LucideIcons.Rocket className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
