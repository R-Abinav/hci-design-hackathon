import { useNavigate } from 'react-router-dom'
import { Home, Search, HelpCircle, AlertTriangle } from 'lucide-react'

/*
 * Block H — Web Usability Guidelines
 * Web Usability Cheat Sheet #1 (Accessibility): "Custom 404 page" 
 * Krug's Law: "Don't Make Me Think" — a browser-default 404 is
 * disorienting and offers no path forward. A custom 404 must:
 *   1. Confirm what happened (graceful error feedback — Nielsen #9)
 *   2. Provide clear, labeled paths back into the app
 *   3. NOT break the navigation (navbar still visible above)
 */
export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            {/* Visual treatment — large but not alarming */}
            <div className="relative mb-6">
                <span className="text-[8rem] font-black text-trust-100 leading-none select-none">404</span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle className="w-16 h-16 text-amber-400" />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-trust-900 mb-2">Page not found</h1>
            <p className="text-base text-trust-500 max-w-sm mb-8">
                The page you're looking for doesn't exist or may have moved.
                Here are some helpful links to get you back on track:
            </p>

            {/* Recovery paths — Feature Exposure: make all app sections visible */}
            <div className="grid sm:grid-cols-3 gap-3 w-full max-w-md mb-8">
                {[
                    { icon: <Home className="w-5 h-5" />, label: 'Go Home', sub: 'Start fresh', path: '/', color: 'bg-primary-50 border-primary-200 hover:bg-primary-100 text-primary-700' },
                    { icon: <Search className="w-5 h-5" />, label: 'Find Doctors', sub: 'Browse specialists', path: '/search', color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700' },
                    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help Page', sub: 'Browse FAQs', path: '/help', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700' },
                ].map(link => (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${link.color}`}
                    >
                        {link.icon}
                        <span className="text-sm font-semibold">{link.label}</span>
                        <span className="text-xs opacity-70">{link.sub}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={() => navigate(-1)}
                className="text-sm text-trust-400 hover:text-primary-600 transition-colors underline underline-offset-2"
            >
                ← Go back to previous page
            </button>
        </div>
    )
}
