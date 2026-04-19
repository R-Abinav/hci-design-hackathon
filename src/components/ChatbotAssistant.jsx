import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react'

/*
 * END-SEM BLOCK E — User Support Systems: Assistants (Dix et al., 2004)
 * Reference: end_sem_reference.txt §4 — "Assistants passively monitor user
 * behaviour and offer suggestions when relevant. Ideally they are unobtrusive
 * and under user control."
 *
 * Design principles applied:
 *  - NON-INTRUSIVE: Icon is small (52px), placed bottom-right, never auto-opens.
 *    Contrast with Clippy (counter-example: intrusive, irrelevant suggestions).
 *  - UNDER USER CONTROL: User must click to open; can close any time (X button).
 *  - CONTEXTUAL: Responses drawn from app-specific FAQ content.
 *  - FLEXIBLE: Supports both quick-reply chips (novices) and free-text (experts).
 *  - UNOBTRUSIVE (Reference requirement): Does not interrupt primary workflow.
 *    The window floats; behind it the full app remains interactive.
 *
 * Reference: end_sem_reference.txt lines 352-353
 * "Assistants passively monitor user behavior and offer suggestions when
 *  relevant. Ideally, they're unobtrusive and under user control. The infamous
 *  example is Microsoft's Clippy, which failed because it was intrusive and its
 *  suggestions were often irrelevant. A better example is MS Office Smart Tags,
 *  which appear near the object of interest without demanding attention."
 */

const BOT_NAME = 'Practo Assistant'

// ── Knowledge base: maps keywords → responses ──────────────────────────────
const KB = [
    {
        patterns: ['book', 'appointment', 'schedule', 'slot'],
        response: 'To book an appointment:\n1. Go to **Find Doctors** in the nav bar\n2. Click a doctor card → **View Profile**\n3. Select an available time slot\n4. Fill in your details and confirm 🎉',
        chips: ['Find Doctors', 'Cancel an appointment?'],
    },
    {
        patterns: ['cancel', 'reschedule', 'change'],
        response: 'You can cancel or reschedule any appointment from your **dashboard**. Go to your appointment → click **Reschedule** or **Cancel**. Cancellations 2+ hours before the appointment are **free of charge**.',
        chips: ['Book an appointment?', 'Payment questions?'],
    },
    {
        patterns: ['pay', 'payment', 'fee', 'price', 'cost', 'charge', 'upi', 'card'],
        response: 'We accept **UPI, credit/debit cards, net banking, and wallets** (Paytm, Amazon Pay). There is **no platform fee** — you only pay the doctor\'s consultation fee shown on their profile.',
        chips: ['Refund policy?', 'Book an appointment?'],
    },
    {
        patterns: ['refund', 'money back'],
        response: 'Refunds are processed within **5–7 business days** for cancellations made 2+ hours before your appointment. No-shows are non-refundable. Contact support@betterpracto.com for urgent cases.',
        chips: ['Contact support?', 'Cancel appointment?'],
    },
    {
        patterns: ['video', 'consult', 'online', 'call'],
        response: 'Video consultations are available with verified doctors from home. After a session, you receive a **digital prescription by email**. You need a stable internet connection (2+ Mbps). Start from the **Home** page → Video Consult card.',
        chips: ['Book appointment?', 'Payment?'],
    },
    {
        patterns: ['account', 'profile', 'settings', 'update', 'edit'],
        response: 'To update your profile, go to **Settings** from the navigation menu. You can update your name, contact info, and health preferences. To delete your account, email privacy@betterpracto.com.',
        chips: ['Privacy question?', 'Something else?'],
    },
    {
        patterns: ['privacy', 'data', 'security', 'safe', 'secure', 'encrypt'],
        response: 'Your health data is **AES-256 encrypted** at rest and in transit. We comply with health data privacy regulations and **never share your information** without explicit consent.',
        chips: ['Account settings?', 'Something else?'],
    },
    {
        patterns: ['doctor', 'find', 'search', 'specialist', 'specialty'],
        response: 'Use the **Find Doctors** page (nav bar) to search by specialty, symptom, or doctor name. Filter by specialty using the pills at the top, and sort by Rating, Experience, or Fee.',
        chips: ['Book an appointment?', 'Video consult?'],
    },
    {
        patterns: ['emergency', '108', '104', 'ambulance', 'urgent', 'help'],
        response: '🚨 **Medical Emergency?** Please call **108 (Ambulance)** or **104 (National Health Helpline)** immediately. Do not use this platform for emergencies.',
        chips: ['Back to general help'],
    },
    {
        patterns: ['hello', 'hi', 'hey', 'help', 'start', 'what can you do'],
        response: 'Hi there! 👋 I\'m your **BetterPracto Assistant**. I can help you with:\n- Booking & appointments\n- Video consultations\n- Payments & refunds\n- Account & privacy\n\nWhat do you need help with?',
        chips: ['Book appointment', 'Video consult', 'Payment help', 'Find doctors'],
    },
]

const DEFAULT_CHIPS = ['Book appointment', 'Video consult', 'Payment help', 'Find doctors', 'Emergency?']

function findResponse(query) {
    const q = query.toLowerCase()
    for (const entry of KB) {
        if (entry.patterns.some(p => q.includes(p))) {
            return entry
        }
    }
    return {
        response: "I'm not sure about that — let me connect you with our support team 😊. You can also visit the **Help** page for FAQs, or email **support@betterpracto.com**.",
        chips: DEFAULT_CHIPS,
    }
}

// ── Markdown-lite renderer (bold only) ──────────────────────────────────────
function MsgText({ text }) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return (
        <span className="whitespace-pre-wrap leading-relaxed">
            {parts.map((p, i) =>
                p.startsWith('**') && p.endsWith('**')
                    ? <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
                    : <span key={i}>{p}</span>
            )}
        </span>
    )
}

export default function ChatbotAssistant() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: "Hey! 👋 How can I help you today?",
            chips: DEFAULT_CHIPS,
            id: 0,
        }
    ])
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const bottomRef = useRef(null)
    const inputRef = useRef(null)

    // Auto-scroll on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, typing])

    // Focus input when opened
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 150)
    }, [open])

    const sendMessage = (text) => {
        const trimmed = text.trim()
        if (!trimmed) return

        const userMsg = { from: 'user', text: trimmed, id: Date.now() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setTyping(true)

        // Simulate a short "thinking" delay (200-600ms)
        const delay = 200 + Math.random() * 400
        setTimeout(() => {
            const { response, chips } = findResponse(trimmed)
            setTyping(false)
            setMessages(prev => [...prev, { from: 'bot', text: response, chips, id: Date.now() + 1 }])
        }, delay)
    }

    return (
        <>
            {/* ── FAB: Non-obtrusive chat icon ──────────────────────────────────
                 52×52px — small enough to not distract, large enough to tap (≥44px).
                 Only shows a subtle pulse on first load to draw attention once.
                 After the user has seen it, no more animation. Dix et al.:
                 "Unobtrusive — should not interrupt or block the user's primary work." */}
            <button
                id="chatbot-fab"
                aria-label="Open chat assistant"
                onClick={() => setOpen(true)}
                className={`fixed bottom-6 right-6 z-[150] w-13 h-13 rounded-full bg-primary-600 text-white shadow-xl flex items-center justify-center transition-all duration-200 hover:bg-primary-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${open ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}`}
                style={{ width: 52, height: 52 }}
            >
                <Bot className="w-6 h-6" />
                {/* Tiny "new" dot — disappears after first open */}
                {messages.length === 1 && !open && (
                    <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                )}
            </button>

            {/* ── Chat Window ─────────────────────────────────────────────────── */}
            <div
                id="chatbot-window"
                role="dialog"
                aria-label="BetterPracto Chat Assistant"
                aria-modal="false"
                className={`fixed bottom-6 right-6 z-[160] flex flex-col bg-white rounded-2xl shadow-2xl border border-trust-200 transition-all duration-300 origin-bottom-right ${
                    open
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-90 pointer-events-none'
                }`}
                style={{ width: 340, height: 480 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-primary-600 rounded-t-2xl">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white leading-none">{BOT_NAME}</p>
                            <p className="text-xs text-white/70 mt-0.5">Typically replies instantly</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close chat"
                        className="text-white/70 hover:text-white transition-colors p-1 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5 ${
                                msg.from === 'bot'
                                    ? 'bg-primary-100 text-primary-600'
                                    : 'bg-trust-200 text-trust-600'
                            }`}>
                                {msg.from === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                            </div>

                            <div className={`flex flex-col gap-1.5 max-w-[80%] ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                                {/* Bubble */}
                                <div className={`px-3 py-2 rounded-2xl text-sm ${
                                    msg.from === 'bot'
                                        ? 'bg-trust-100 text-trust-800 rounded-tl-sm'
                                        : 'bg-primary-600 text-white rounded-tr-sm'
                                }`}>
                                    <MsgText text={msg.text} />
                                </div>

                                {/* Quick-reply chips */}
                                {msg.from === 'bot' && msg.chips && (
                                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                                        {msg.chips.map(chip => (
                                            <button
                                                key={chip}
                                                onClick={() => sendMessage(chip)}
                                                className="px-2.5 py-1 text-xs rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-400 transition-colors"
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {typing && (
                        <div className="flex gap-2 items-end">
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                <Bot className="w-3.5 h-3.5 text-primary-600" />
                            </div>
                            <div className="bg-trust-100 px-3 py-2.5 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                {[0, 1, 2].map(i => (
                                    <span
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-trust-400 animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-3 py-3 border-t border-trust-100">
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                        className="flex gap-2 items-center"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            aria-label="Chat message"
                            className="flex-1 text-sm px-3 py-2 rounded-xl border border-trust-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-trust-50 placeholder:text-trust-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || typing}
                            aria-label="Send message"
                            className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-trust-400 mt-2">
                        Powered by BetterPracto · <span className="underline cursor-pointer hover:text-primary-500">Help page</span>
                    </p>
                </div>
            </div>
        </>
    )
}
