import { useState, useEffect } from 'react'
import * as LucideIcons from 'lucide-react'

/*
 * V6 FIX: No contextual help → In-app searchable FAQ + Quick Reference
 * Nielsen #10: Help and Documentation
 * Shneiderman #8: Reduce short-term memory load
 *
 * END-SEM ADDITIONS:
 *   E1 — Quick Reference card (Dix et al., 2004)
 *   F1 — In-page Jump Navigation: anchor pills to skip to each section
 *         (demonstrates Navigation Design / Skip-link concept visually)
 *   E2 — Tips & Warnings panel (proactive help)
 *   E3 — Emergency contact card (always visible system support)
 */

const SECTION_IDS = {
    booking: 'section-booking',
    consultations: 'section-consultations',
    payments: 'section-payments',
    account: 'section-account',
    emergency: 'section-emergency',
    tips: 'section-tips',
}

export default function Help() {
    const [searchQuery, setSearchQuery] = useState('')
    const [openFaq, setOpenFaq] = useState(null)
    const [activeSection, setActiveSection] = useState(null)

    const categories = [
        {
            id: SECTION_IDS.booking,
            title: 'Booking & Appointments',
            icon: <LucideIcons.Calendar className="w-5 h-5 text-primary-600" />,
            color: 'text-primary-600',
            faqs: [
                { q: 'How do I book an appointment?', a: 'Search for a doctor by specialty or name → click a doctor card → select an available time slot → confirm your details → booked! You will receive a confirmation on screen immediately.' },
                { q: 'Can I reschedule my appointment?', a: 'Yes. Go to your dashboard, find the appointment, and click "Reschedule". You can pick a new date and time without losing your booking priority.' },
                { q: 'How do I cancel a booking?', a: 'Navigate to your appointment details and select "Cancel Appointment". Cancellations made 2+ hours before the appointment are free of charge.' },
                { q: 'Can I book for a family member?', a: 'Yes. On the confirmation step, enter the family member\'s name and contact number instead of your own. The booking is linked to your account.' },
                { q: 'How many days in advance can I book?', a: 'Appointments can be scheduled up to 30 days in advance. Slots beyond 30 days will open on a rolling basis.' },
            ]
        },
        {
            id: SECTION_IDS.consultations,
            title: 'Consultations',
            icon: <LucideIcons.Stethoscope className="w-5 h-5 text-emerald-600" />,
            color: 'text-emerald-600',
            faqs: [
                { q: 'What is a video consultation?', a: 'A video consultation lets you speak with a verified doctor from home via a secure video call. You receive a digital prescription after the consultation.' },
                { q: 'How long is a typical consultation?', a: 'Most consultations last 10–15 minutes. Your doctor may extend if needed at no additional cost.' },
                { q: 'What should I prepare before a video consultation?', a: 'List your current medications and their dosages. Note your symptoms and when they started. Have a photo ID and insurance card handy. Ensure stable internet and a quiet, private space.' },
                { q: 'Will I get a prescription digitally?', a: 'Yes. A digitally signed prescription is sent to your registered email within 15 minutes of the consultation ending.' },
            ]
        },
        {
            id: SECTION_IDS.payments,
            title: 'Payments & Fees',
            icon: <LucideIcons.CreditCard className="w-5 h-5 text-orange-600" />,
            color: 'text-orange-600',
            faqs: [
                { q: 'What payment methods are accepted?', a: 'We accept UPI (PhonePe, GPay, BHIM), credit/debit cards (Visa, Mastercard, RuPay), net banking, and major wallets (Paytm, Amazon Pay).' },
                { q: 'Is there a booking fee?', a: 'No. There is no additional platform fee. You only pay the doctor\'s consultation fee shown on their profile.' },
                { q: 'Are refunds available?', a: 'Full refunds are processed within 5–7 business days for cancellations made 2+ hours before the appointment. No-shows are non-refundable.' },
                { q: 'Is the payment secure?', a: 'Yes. All transactions are PCI-DSS compliant and end-to-end encrypted. We do not store card details on our servers.' },
            ]
        },
        {
            id: SECTION_IDS.account,
            title: 'Account & Privacy',
            icon: <LucideIcons.Shield className="w-5 h-5 text-purple-600" />,
            color: 'text-purple-600',
            faqs: [
                { q: 'Is my health data secure?', a: 'Yes. All health data is AES-256 encrypted at rest and in transit. We comply with health data privacy regulations and never share your information without explicit consent.' },
                { q: 'How do I update my profile?', a: 'Go to Settings from the navigation menu. You can update your name, contact info, and health preferences at any time.' },
                { q: 'How do I delete my account?', a: 'Contact support at privacy@betterpracto.com with the subject "Account Deletion Request". We process deletions within 30 days per data privacy regulations.' },
                { q: 'Can I download my health records?', a: 'Yes. Go to Settings → My Health Records → Export. All records are exported in PDF format for easy sharing with other providers.' },
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

    // Scroll to section
    const scrollToSection = (id) => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActiveSection(id)
        }
    }

    return (
        <div className="page-enter-active max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-3xl font-bold text-trust-900 mb-1">Help &amp; Support</h1>
            <p className="text-base text-trust-500 mb-6">Find answers to common questions or jump to a section below</p>

            {/* ─── E1: QUICK REFERENCE ──────────────────────────────────────── */}
            <div className="mb-6 border border-primary-100 rounded-2xl overflow-hidden">
                <div className="bg-primary-600 px-5 py-3 flex items-center gap-2">
                    <LucideIcons.Zap className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white tracking-wide">QUICK REFERENCE — Common Actions</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-0 bg-white divide-y sm:divide-y-0 sm:divide-x divide-trust-100">
                    {[
                        { icon: <LucideIcons.Search className="w-4 h-4 text-primary-500" />, action: 'Search doctors', tip: 'Home → Search bar → type specialty or symptom' },
                        { icon: <LucideIcons.Calendar className="w-4 h-4 text-emerald-500" />, action: 'Book appointment', tip: 'Find Doctors → Card → View Profile → Book' },
                        { icon: <LucideIcons.Video className="w-4 h-4 text-blue-500" />, action: 'Video consult', tip: 'Home → Video Consult card → Select doctor' },
                        { icon: <LucideIcons.HelpCircle className="w-4 h-4 text-purple-500" />, action: 'Get help', tip: 'Nav bar → Help → search or jump to a section' },
                    ].map(item => (
                        <div key={item.action} className="flex items-start gap-3 px-4 py-3 hover:bg-primary-50 transition-colors">
                            <span className="mt-0.5 shrink-0">{item.icon}</span>
                            <div>
                                <p className="text-sm font-semibold text-trust-800">{item.action}</p>
                                <p className="text-xs text-trust-500 mt-0.5">{item.tip}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── F1: IN-PAGE JUMP NAVIGATION ──────────────────────────────────
                 Navigation Design Guideline — Block F:
                 "Jump to section" pills act as skip-links within the page.
                 Users who know which section they need can jump directly
                 without scrolling through the entire page (Bypass Blocks principle).
                 Active section gets a filled primary style; others are outlined.
            ──────────────────────────────────────────────────────────────────── */}
            <div className="mb-6">
                <p className="text-xs font-semibold text-trust-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <LucideIcons.Navigation className="w-3.5 h-3.5" />
                    Jump to section
                </p>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: SECTION_IDS.booking, label: 'Booking', icon: <LucideIcons.Calendar className="w-3.5 h-3.5" /> },
                        { id: SECTION_IDS.consultations, label: 'Consultations', icon: <LucideIcons.Stethoscope className="w-3.5 h-3.5" /> },
                        { id: SECTION_IDS.payments, label: 'Payments', icon: <LucideIcons.CreditCard className="w-3.5 h-3.5" /> },
                        { id: SECTION_IDS.account, label: 'Account', icon: <LucideIcons.Shield className="w-3.5 h-3.5" /> },
                        { id: SECTION_IDS.emergency, label: 'Emergency', icon: <LucideIcons.Phone className="w-3.5 h-3.5" /> },
                        { id: SECTION_IDS.tips, label: 'Tips', icon: <LucideIcons.Lightbulb className="w-3.5 h-3.5" /> },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                activeSection === item.id
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                    : 'bg-white text-trust-600 border-trust-200 hover:border-primary-400 hover:text-primary-600'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── Search ───────────────────────────────────────────────────── */}
            <div className="relative mb-6">
                <LucideIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-trust-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search across all help topics..."
                    className="input-field pl-12"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-trust-400 hover:text-trust-600"
                        aria-label="Clear search"
                    >
                        <LucideIcons.X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ─── FAQ categories ───────────────────────────────────────────── */}
            <div className="space-y-5">
                {filteredCategories.map(category => (
                    <div key={category.title} id={category.id} className="card scroll-mt-20">
                        <h2 className={`text-lg font-semibold flex items-center gap-2 mb-3 ${category.color}`}>
                            {category.icon}
                            {category.title}
                        </h2>
                        <div className="space-y-0.5">
                            {category.faqs.map((faq, i) => {
                                const key = `${category.title}-${i}`
                                return (
                                    <div key={key} className="border-b border-trust-50 last:border-0">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === key ? null : key)}
                                            className="w-full text-left py-3 flex items-center justify-between gap-4 group"
                                            aria-expanded={openFaq === key}
                                        >
                                            <span className="text-sm font-medium text-trust-700 group-hover:text-primary-600 transition-colors">
                                                {faq.q}
                                            </span>
                                            <LucideIcons.ChevronDown
                                                className={`w-4 h-4 text-trust-400 shrink-0 transition-transform duration-200 ${openFaq === key ? 'rotate-180' : ''}`}
                                            />
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

            {/* ─── E2: TIPS & WARNINGS (Proactive Help) ────────────────────── */}
            <div id={SECTION_IDS.tips} className="mt-6 scroll-mt-20">
                <h2 className="text-lg font-semibold text-trust-900 flex items-center gap-2 mb-3">
                    <LucideIcons.Lightbulb className="w-5 h-5 text-amber-500" />
                    Tips &amp; Best Practices
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                    {[
                        { icon: <LucideIcons.Clock className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-50 border-blue-100', title: 'Book 24h in advance', tip: 'Popular slots fill within hours. Book at least a day ahead for peak-hour appointments.' },
                        { icon: <LucideIcons.FileText className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50 border-emerald-100', title: 'Bring test reports', tip: 'Upload or keep recent blood test, scan, or X-ray reports ready before your consultation.' },
                        { icon: <LucideIcons.Wifi className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-50 border-purple-100', title: 'Stable internet for video', tip: 'A minimum of 2 Mbps upload speed is recommended for video consultations without drops.' },
                        { icon: <LucideIcons.BellRing className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-50 border-orange-100', title: 'Enable reminders', tip: 'Check the reminder checkbox after booking to get SMS alerts 1 hour before your appointment.' },
                    ].map(t => (
                        <div key={t.title} className={`flex gap-3 p-4 rounded-xl border ${t.bg}`}>
                            <span className="mt-0.5 shrink-0">{t.icon}</span>
                            <div>
                                <p className="text-sm font-semibold text-trust-800">{t.title}</p>
                                <p className="text-xs text-trust-600 mt-0.5">{t.tip}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── E3: EMERGENCY CONTACTS ───────────────────────────────────── */}
            <div id={SECTION_IDS.emergency} className="mt-6 scroll-mt-20 card border-red-100 bg-red-50">
                <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-3">
                    <LucideIcons.Phone className="w-5 h-5 text-red-500" />
                    Emergency Contacts
                </h2>
                <p className="text-sm text-red-600 mb-3">
                    If you are experiencing a medical emergency, <strong>do not use this platform</strong>. Call emergency services immediately.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                    {[
                        { label: 'Ambulance', number: '108', icon: <LucideIcons.Ambulance className="w-4 h-4" /> },
                        { label: 'National Helpline', number: '104', icon: <LucideIcons.HeartPulse className="w-4 h-4" /> },
                        { label: 'Support Chat', number: '24/7 in-app', icon: <LucideIcons.MessageCircle className="w-4 h-4" /> },
                    ].map(e => (
                        <div key={e.label} className="bg-white rounded-xl px-4 py-3 border border-red-100 flex items-center gap-3">
                            <span className="text-red-500">{e.icon}</span>
                            <div>
                                <p className="text-xs text-trust-500">{e.label}</p>
                                <p className="text-base font-bold text-red-600">{e.number}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Contact fallback ─────────────────────────────────────────── */}
            <div className="mt-6 card text-center">
                <p className="text-base text-trust-600 mb-1">Couldn't find what you're looking for?</p>
                <p className="text-sm text-trust-400 mb-4">Our support team typically responds within 2 hours on weekdays.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="btn-primary flex items-center justify-center gap-2">
                        <LucideIcons.MessageCircle className="w-4 h-4" />
                        Chat with Support
                    </button>
                    <button className="btn-secondary flex items-center justify-center gap-2">
                        <LucideIcons.Mail className="w-4 h-4" />
                        Email Us
                    </button>
                </div>
            </div>
        </div>
    )
}
