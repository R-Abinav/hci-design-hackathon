import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pill, Hospital, ShieldCheck, RefreshCw } from 'lucide-react'

/*
 * V9 FIX: Password fully masked → Show/hide toggle
 * Case Study: Stop Password Masking (Lecture 5)
 * Also: V7 (min 14px text), V10 (left-loaded content), Feedback (loaders)
 *
 * BLOCK K — CAPTCHA (End-Sem Reference §6, lines 626–746)
 * ─────────────────────────────────────────────────────────
 * CAPTCHA chosen: reCAPTCHA v2 ("I'm not a robot" checkbox)
 *
 * WHY reCAPTCHA (not distorted-text / Gimpy)?
 *   • End-Sem reference (line 705-712) identifies reCAPTCHA (founded 2008,
 *     acquired by Google) as the major real-world evolution of CAPTCHA.
 *   • The classic "checkbox" UX requires ZERO visual puzzle-solving by the user
 *     → eliminates friction while still blocking bots. Google's risk-engine
 *     silently analyses mouse-movement, timing, and browser fingerprint behind
 *     the scenes. Humans see a single click; bots see an unsolvable challenge.
 *   • This aligns with Web Usability Principle 2: "Don't squander users' patience"
 *     — medical appointment booking is a high-stress flow; adding a distorted
 *     text puzzle creates unnecessary cognitive load.
 *   • Healthcare context: elderly users struggle with distorted-text CAPTCHAs
 *     (Universal Design concern). reCAPTCHA is frictionless for these users.
 *
 * CAPTCHA UX rules applied (reference §4):
 *   1. Submit button DISABLED until checkbox is ticked → Tolerance for Error.
 *   2. Simulated verification delay (spinner) → Informative Feedback (Shneiderman).
 *   3. Refresh button → allows regenerating challenge (accessibility guideline).
 *   4. reCAPTCHA branding shown (Google logo, shield icon) → Authority + Trust.
 *   5. Visual lock animation on verified state → Closure + immediate feedback.
 *
 * NOTE: This is a front-end simulation of reCAPTCHA for the prototype.
 * In production, integrate the real @google-recaptcha library with site key.
 */

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Block K — reCAPTCHA state
    const [captchaChecked, setCaptchaChecked] = useState(false)
    const [captchaVerifying, setCaptchaVerifying] = useState(false)
    const [captchaVerified, setCaptchaVerified] = useState(false)

    const navigate = useNavigate()

    const VALID_EMAIL = 'user@betterpracto.com'
    const VALID_PASSWORD = 'password123'

    // Simulate reCAPTCHA risk-engine verification delay
    const handleCaptchaCheck = async () => {
        if (captchaVerified) return
        setCaptchaChecked(true)
        setCaptchaVerifying(true)
        // Simulate the reCAPTCHA backend risk-score evaluation (~1.2s)
        await new Promise(r => setTimeout(r, 1200))
        setCaptchaVerifying(false)
        setCaptchaVerified(true)
    }

    const handleCaptchaReset = () => {
        setCaptchaChecked(false)
        setCaptchaVerifying(false)
        setCaptchaVerified(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        // Block K: Block submission if CAPTCHA not verified
        if (!captchaVerified) {
            setError('Please complete the CAPTCHA verification below before signing in.')
            return
        }

        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
            onLogin({ name: 'Abinav', email })
            navigate('/')
        } else {
            setLoading(false)
            setError('Invalid email or password. Try user@betterpracto.com / password123')
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* V10: Left side — form (69% attention goes left) */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <Pill className="w-8 h-8 text-primary-600 stroke-[1.5]" />
                        <span className="text-2xl font-bold text-primary-700">Better<span className="text-primary-500">Practo</span></span>
                    </div>

                    <h1 className="text-3xl font-bold text-trust-900 mb-2">Welcome back</h1>
                    <p className="text-base text-trust-500 mb-8">Sign in to access your healthcare dashboard</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-trust-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@betterpracto.com"
                                className="input-field"
                                autoComplete="email"
                            />
                        </div>

                        {/* Password field — V9: Show/hide toggle */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-trust-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input-field pr-12"
                                    autoComplete="current-password"
                                />
                                {/* V9: Toggle button for show/hide password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-trust-400 hover:text-trust-600 transition-colors p-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════════════════════
                            BLOCK K — reCAPTCHA v2 "I'm not a robot" widget
                            Reference: end_sem_reference.txt §6, lines 705-712
                            ═══════════════════════════════════════════════════════════
                            The widget simulates the real Google reCAPTCHA v2 UI:
                              1. Unchecked checkbox with label "I'm not a robot"
                              2. On click → spinner (risk-engine evaluation phase)
                              3. On verified → green checkmark (✓)
                              4. reCAPTCHA branding (shield + "reCAPTCHA" wordmark + Google)
                              5. Refresh button to reset the challenge
                        ═══════════════════════════════════════════════════════════ */}
                        <div>
                            <div
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                                    captchaVerified
                                        ? 'border-emerald-300 bg-emerald-50'
                                        : 'border-trust-200 bg-trust-50 hover:border-trust-300'
                                }`}
                            >
                                {/* Left: checkbox + label */}
                                <div className="flex items-center gap-3">
                                    <button
                                        id="recaptcha-checkbox"
                                        type="button"
                                        onClick={handleCaptchaCheck}
                                        disabled={captchaVerified}
                                        aria-label="I'm not a robot CAPTCHA checkbox"
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                                            captchaVerified
                                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                                : captchaChecked && captchaVerifying
                                                ? 'bg-white border-trust-300'
                                                : 'bg-white border-trust-400 hover:border-primary-400 cursor-pointer'
                                        }`}
                                    >
                                        {captchaVerifying ? (
                                            /* Spinner during verification */
                                            <svg className="w-4 h-4 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : captchaVerified ? (
                                            /* Green checkmark on verified */
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : null}
                                    </button>
                                    <span className={`text-sm font-medium ${captchaVerified ? 'text-emerald-700' : 'text-trust-700'}`}>
                                        {captchaVerified ? 'Verified ✓' : "I'm not a robot"}
                                    </span>
                                </div>

                                {/* Right: reCAPTCHA branding */}
                                <div className="flex flex-col items-center gap-0.5">
                                    {/* Shield icon + reCAPTCHA wordmark */}
                                    <ShieldCheck className="w-8 h-8 text-trust-400" strokeWidth={1.5} />
                                    <div className="text-center">
                                        <div className="text-[9px] font-bold text-trust-500 tracking-wide leading-none">reCAPTCHA</div>
                                        <div className="text-[8px] text-trust-400 leading-none">Privacy - Terms</div>
                                    </div>
                                </div>
                            </div>

                            {/* Refresh / reset button — CAPTCHA accessibility guideline */}
                            {captchaVerified && (
                                <button
                                    type="button"
                                    onClick={handleCaptchaReset}
                                    className="mt-1.5 flex items-center gap-1 text-xs text-trust-400 hover:text-trust-600 transition-colors"
                                >
                                    <RefreshCw className="w-3 h-3" /> Reset verification
                                </button>
                            )}
                        </div>
                        {/* End Block K */}

                        {/* Error message — Nielsen #9: plain language */}
                        {error && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit — Fitts's Law: large target. Disabled until CAPTCHA verified */}
                        <button
                            type="submit"
                            disabled={loading || !captchaVerified}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!captchaVerified ? 'Please complete the CAPTCHA first' : ''}
                        >
                            {loading ? (
                                <>
                                    <div className="loader !w-5 !h-5 !border-2 !border-white/30 !border-t-white"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Credentials hint — Learnability */}
                    <div className="mt-6 p-4 rounded-xl bg-primary-50 border border-primary-100">
                        <p className="text-sm font-medium text-primary-700 mb-1">Demo Credentials</p>
                        <p className="text-sm text-primary-600">
                            Email: <code className="bg-primary-100 px-1.5 py-0.5 rounded text-xs font-mono">user@betterpracto.com</code>
                        </p>
                        <p className="text-sm text-primary-600">
                            Password: <code className="bg-primary-100 px-1.5 py-0.5 rounded text-xs font-mono">password123</code>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side — trust imagery */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center p-12">
                <div className="text-center text-white max-w-md">
                    <Hospital className="w-20 h-20 text-primary-200 mx-auto mb-6 stroke-1" />
                    <h2 className="text-3xl font-bold mb-4">Your Health, Simplified</h2>
                    <p className="text-lg text-primary-200 leading-relaxed">
                        Book appointments, consult top doctors, and manage your health — all in one place. Designed with care for you.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-6 text-primary-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">20K+</div>
                            <div className="text-sm">Doctors</div>
                        </div>
                        <div className="w-px h-10 bg-primary-500"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">1M+</div>
                            <div className="text-sm">Patients</div>
                        </div>
                        <div className="w-px h-10 bg-primary-500"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">4.8★</div>
                            <div className="text-sm">Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
