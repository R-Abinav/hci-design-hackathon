import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Home, Search, HelpCircle, Pill, Keyboard } from 'lucide-react'

/*
 * V8 FIX: Active nav state — underline + color change shows current section
 * Nielsen #1: Visibility of System Status
 * Also: ≤5 nav items (Miller's 7±2)
 *
 * END-SEM ADDITIONS (Block F — Navigation Design Guidelines):
 *   F1 — Keyboard Toast notification: detects first Tab press and shows a
 *         non-intrusive "Keyboard navigation active" toast (bottom-right).
 *         This follows the WCAG 2.4.1 spirit without covering the navbar.
 *   F2 — aria-label on <nav>: identifies the primary navigation landmark.
 *   F3 — Logo keyboard-navigable: role="link", tabIndex, onKeyDown Enter.
 */
export default function Navbar({ user, onLogout }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [keyboardToast, setKeyboardToast] = useState(false)
    const navigate = useNavigate()

    // F1 — Detect first keyboard Tab press, show a friendly toast
    useEffect(() => {
        let shown = false
        const handleKeyDown = (e) => {
            if (e.key === 'Tab' && !shown) {
                shown = true
                setKeyboardToast(true)
                // Auto-dismiss after 3 seconds
                setTimeout(() => setKeyboardToast(false), 3000)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const navItems = [
        { to: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
        { to: '/search', label: 'Find Doctors', icon: <Search className="w-5 h-5" /> },
        { to: '/help', label: 'Help', icon: <HelpCircle className="w-5 h-5" /> },
    ]

    return (
        <>
            {/* F1 — Keyboard Navigation Toast (Block F)
                 Appears in the bottom-right corner only when the Tab key is
                 first pressed. Non-intrusive — does NOT cover the navbar or
                 any content. Auto-dismisses after 3 seconds.
                 Screen-reader users get this announced as a live region. */}
            {keyboardToast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-primary-700 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-in"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <Keyboard className="w-4 h-4 shrink-0" />
                    <span>Keyboard navigation active — use Tab to move between elements</span>
                    <button
                        onClick={() => setKeyboardToast(false)}
                        className="ml-1 text-white/70 hover:text-white text-lg leading-none"
                        aria-label="Dismiss"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* F2 — aria-label identifies this as the primary navigation landmark */}
            <nav aria-label="Primary navigation" className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-trust-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* F3 — Logo keyboard-navigable with visible focus ring */}
                        <div
                            role="link"
                            tabIndex={0}
                            aria-label="Go to home page"
                            className="flex items-center gap-2 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 p-1"
                            onClick={() => navigate('/')}
                            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
                        >
                            <Pill className="w-8 h-8 text-primary-600 stroke-[1.5]" />
                            <span className="text-xl font-bold text-primary-700">Better<span className="text-primary-500">Practo</span></span>
                        </div>

                        {/* Nav items — V8: active state indicators */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === '/'}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-1.5 ${isActive
                                            ? 'text-primary-700 bg-primary-50 border-b-2 border-primary-600'
                                            : 'text-trust-600 hover:text-primary-600 hover:bg-trust-100'
                                        }`
                                    }
                                >
                                    {item.icon}
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>

                        {/* User section */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-trust-600">
                                <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                                    {user?.name?.[0] || 'U'}
                                </span>
                                <span className="font-medium">{user?.name || 'User'}</span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="text-sm text-trust-500 hover:text-red-500 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-red-50"
                            >
                                Logout
                            </button>

                            {/* Mobile menu button */}
                            <button
                                className="md:hidden p-2 rounded-lg text-trust-500 hover:bg-trust-100"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle mobile menu"
                                aria-expanded={mobileOpen}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileOpen
                                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    }
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    {mobileOpen && (
                        <div className="md:hidden pb-4 space-y-1">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === '/'}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive
                                            ? 'text-primary-700 bg-primary-50 border-l-4 border-primary-600'
                                            : 'text-trust-600 hover:bg-trust-100'
                                        }`
                                    }
                                >
                                    {item.icon}
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
        </>
    )
}
