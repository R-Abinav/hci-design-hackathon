import { useState } from 'react'

/*
 * V6 FIX: No contextual help → In-app searchable FAQ
 * Nielsen #10: Help and Documentation
 * Shneiderman #8: Reduce short-term memory load
 * Headline Usability: front-loaded, concise headings
 */
export default function Help() {
    const [searchQuery, setSearchQuery] = useState('')
    const [openFaq, setOpenFaq] = useState(null)

    const categories = [
        {
            title: 'Booking & Appointments',
            icon: '📅',
            faqs: [
                { q: 'How do I book an appointment?', a: 'Search for a doctor by specialty or name, select an available time slot, confirm your details, and your appointment is booked instantly. You will receive a confirmation on screen.' },
                { q: 'Can I reschedule my appointment?', a: 'Yes. Go to your dashboard, find the appointment, and click "Reschedule". You can pick a new date and time without losing your booking.' },
                { q: 'How do I cancel a booking?', a: 'Navigate to your appointment details and select "Cancel Appointment". Cancellations made 2+ hours before the appointment are free of charge.' },
            ]
        },
        {
            title: 'Consultations',
            icon: '🩺',
            faqs: [
                { q: 'What is a video consultation?', a: 'A video consultation lets you speak with a verified doctor from home via a secure video call. You receive a digital prescription after the consultation.' },
                { q: 'How long is a typical consultation?', a: 'Most consultations last 10–15 minutes. Your doctor may extend if needed at no additional cost.' },
            ]
        },
        {
            title: 'Payments & Fees',
            icon: '💳',
            faqs: [
                { q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards, net banking, and wallets. Payment is collected at the time of booking.' },
                { q: 'Is there a booking fee?', a: 'No. There is no additional booking fee. You only pay the doctor\'s consultation fee.' },
            ]
        },
        {
            title: 'Account & Privacy',
            icon: '🔒',
            faqs: [
                { q: 'Is my health data secure?', a: 'Yes. All data is encrypted and stored securely. We comply with health data privacy regulations and never share your information without consent.' },
                { q: 'How do I update my profile?', a: 'Go to Settings from the navigation menu. You can update your name, contact info, and health preferences at any time.' },
            ]
        },
    ]

    // Filter FAQs based on search
    const filteredCategories = categories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(faq =>
            !searchQuery ||
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.faqs.length > 0)

    return (
        <div className="page-enter-active max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-3xl font-bold text-trust-900 mb-2">Help & Support</h1>
            <p className="text-base text-trust-500 mb-6">Find answers to common questions</p>

            {/* Searchable — Nielsen #10 */}
            <div className="relative mb-8">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-trust-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help..."
                    className="input-field pl-12"
                />
            </div>

            {/* FAQ categories — categorized by user task */}
            <div className="space-y-6">
                {filteredCategories.map(category => (
                    <div key={category.title} className="card">
                        <h2 className="text-lg font-semibold text-trust-900 flex items-center gap-2 mb-4">
                            <span>{category.icon}</span>
                            {category.title}
                        </h2>

                        <div className="space-y-1">
                            {category.faqs.map((faq, i) => {
                                const key = `${category.title}-${i}`
                                return (
                                    <div key={key} className="border-b border-trust-50 last:border-0">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === key ? null : key)}
                                            className="w-full text-left py-3 flex items-center justify-between gap-4 group"
                                        >
                                            {/* Headline Usability: concise, front-loaded */}
                                            <span className="text-base font-medium text-trust-700 group-hover:text-primary-600 transition-colors">
                                                {faq.q}
                                            </span>
                                            <svg
                                                className={`w-5 h-5 text-trust-400 shrink-0 transition-transform duration-200 ${openFaq === key ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === key && (
                                            <div className="pb-4 text-sm text-trust-600 leading-relaxed pl-0.5 animate-in">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact fallback */}
            <div className="mt-8 card text-center">
                <p className="text-base text-trust-600 mb-3">Still need help?</p>
                <button className="btn-primary">Contact Support</button>
            </div>
        </div>
    )
}
