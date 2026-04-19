import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Home, Search, HelpCircle, Pill } from 'lucide-react'

/*
 * V8 FIX: Active nav state — underline + color change shows current section
 * Nielsen #1: Visibility of System Status
 * Also: ≤5 nav items (Miller's 7±2)
 *
 * END-SEM ADDITIONS (Block F — Navigation Design Guidelines):
 *   F1 — Skip Navigation Link: WCAG 2.1 SC 2.4.1 — visually hidden, appears on focus.
 *         Allows keyboard/screen-reader users to bypass repeated nav and jump to main.
 *   F2 — aria-label on <nav>: identifies this as the primary navigation region.
 *   F3 — Logo keyboard focus ring: logo is now keyboard-navigable with visible focus.
 */
export default function Navbar({ user, onLogout }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()

    const navItems = [
        { to: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
        { to: '/search', label: 'Find Doctors', icon: <Search className="w-5 h-5" /> },
        { to: '/help', label: 'Help', icon: <HelpCircle className="w-5 h-5" /> },
    ]

    return (
        // F2 — aria-label identifies this as the primary navigation region
        <nav aria-label="Primary navigation" className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-trust-200 shadow-sm">

            {/* F1 — SKIP NAVIGATION LINK (Block F — Navigation Design)
                 WCAG 2.1 Success Criterion 2.4.1: Bypass Blocks.
                 Visually hidden by default; appears on keyboard focus.
                 Users pressing Tab first get this link — lets them jump
                 straight to main content without tabbing through all nav links.
                 Critical for screen-reader and keyboard-only users. */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                Skip to main content
            </a>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo — F3: keyboard-navigable with visible focus ring */}
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
                                    `px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                        ? 'text-primary-700 bg-primary-50 border-b-2 border-primary-600'
                                        : 'text-trust-600 hover:text-primary-600 hover:bg-trust-100'
                                    }`
                                }
                            >
                                <span className="mr-1.5">{item.icon}</span>
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
                                    `block px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive
                                        ? 'text-primary-700 bg-primary-50 border-l-4 border-primary-600'
                                        : 'text-trust-600 hover:bg-trust-100'
                                    }`
                                }
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    )
}
