import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/*
 * V9 FIX: Password fully masked → Show/hide toggle
 * Case Study: Stop Password Masking (Lecture 5)
 * Also: V7 (min 14px text), V10 (left-loaded content), Feedback (loaders)
 */
export default function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false) // V9: toggle
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const VALID_EMAIL = 'user@betterpracto.com'
    const VALID_PASSWORD = 'password123'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        setLoading(true)

        // Simulate network request — Shneiderman #3: Informative Feedback
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
            onLogin({ name: 'Abinav', email })
            navigate('/')
        } else {
            setLoading(false)
            // Nielsen #9: Help users recognize errors — plain language
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
                        <span className="text-3xl">💊</span>
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

                        {/* Error message — Nielsen #9: plain language */}
                        {error && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit — Fitts's Law: large target */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
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
                    <div className="text-6xl mb-6">🏥</div>
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
