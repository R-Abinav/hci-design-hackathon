import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Command, Home, Search, HelpCircle, X } from 'lucide-react'

// Phase 7.5 — Universal Design & Efficiency of Use (Shortcuts)
export default function KeyboardShortcuts({ isLoggedIn }) {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input or textarea
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return

            // Show shortcuts: ?
            if (e.key === '?') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }

            // Close modal: Esc
            if (e.key === 'Escape') {
                setIsOpen(false)
            }

            if (!isLoggedIn) return // Only command shortcuts if logged in

            // Global search: Cmd/Ctrl + K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                if (location.pathname !== '/search') {
                    navigate('/search')
                }
            }

            // Go Home: Alt + H
            if (e.altKey && e.key.toLowerCase() === 'h') {
                e.preventDefault()
                if (location.pathname !== '/') {
                    navigate('/')
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [navigate, location, isLoggedIn])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" style={{ animation: 'scale-in 0.3s ease-out' }}>
                <div className="flex items-center justify-between p-6 border-b border-trust-100 bg-trust-50">
                    <div className="flex items-center gap-2">
                        <Command className="w-5 h-5 text-primary-600" />
                        <h2 className="text-xl font-bold text-trust-900">Keyboard Shortcuts</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-trust-400 hover:text-trust-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <ShortcutRow icon={<HelpCircle className="w-4 h-4" />} label="Show Keyboard Shortcuts" keys={['?']} />
                        {isLoggedIn && (
                            <>
                                <ShortcutRow icon={<Search className="w-4 h-4" />} label="Global Search" keys={['⌘', 'K']} altKeys={['Ctrl', 'K']} />
                                <ShortcutRow icon={<Home className="w-4 h-4" />} label="Go to Home" keys={['Alt', 'H']} />
                            </>
                        )}
                        <ShortcutRow label="Close Modals" keys={['Esc']} />
                    </div>
                    <p className="mt-6 text-sm text-center text-trust-500 bg-trust-50 p-3 rounded-lg border border-trust-100">
                        <strong>Efficiency of Use (Heuristic \#7):</strong> Shortcuts accelerate interactions for expert (navigator) users, while remaining unobtrusive for novices.
                    </p>
                </div>
            </div>
        </div>
    )
}

function ShortcutRow({ icon, label, keys, altKeys }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-trust-50 last:border-0">
            <div className="flex items-center gap-3 text-trust-700 font-medium">
                {icon && <span className="text-trust-400">{icon}</span>}
                {label}
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    {keys.map((k, i) => (
                        <kbd key={i} className="px-2 py-1 bg-trust-100 border border-trust-200 rounded text-xs font-mono font-semibold text-trust-700 shadow-sm">
                            {k}
                        </kbd>
                    ))}
                </div>
                {altKeys && (
                    <>
                        <span className="text-trust-400 text-xs text-center">or</span>
                        <div className="flex items-center gap-1">
                            {altKeys.map((k, i) => (
                                <kbd key={i} className="px-2 py-1 bg-trust-100 border border-trust-200 rounded text-xs font-mono font-semibold text-trust-700 shadow-sm">
                                    {k}
                                </kbd>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
