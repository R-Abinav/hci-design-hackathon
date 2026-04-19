import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Onboarding from './components/Onboarding'
import Login from './pages/Login'
import Home from './pages/Home'
import Search from './pages/Search'
import DoctorProfile from './pages/DoctorProfile'
import Booking from './pages/Booking'
import Help from './pages/Help'

// Persist auth across client-side navigation and Vite HMR reloads
// Uses sessionStorage (clears on browser close, but survives page nav)
function getSession() {
    try {
        const raw = sessionStorage.getItem('bp_session')
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

export default function App() {
    const session = getSession()
    const [isLoggedIn, setIsLoggedIn] = useState(!!session)
    const [user, setUser] = useState(session?.user || null)
    // Only show onboarding if this is a fresh login (not a page reload)
    const [showOnboarding, setShowOnboarding] = useState(false)

    const handleLogin = (userData) => {
        setIsLoggedIn(true)
        setUser(userData)
        setShowOnboarding(true) // V4: show onboarding on first login
        sessionStorage.setItem('bp_session', JSON.stringify({ user: userData }))
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUser(null)
        sessionStorage.removeItem('bp_session')
    }

    return (
        <div className="min-h-screen flex flex-col bg-trust-50">
            {/* V4: Onboarding overlay for first-time users */}
            {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
            {isLoggedIn && <Navbar user={user} onLogout={handleLogout} />}
            <main id="main-content" className="flex-1">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            isLoggedIn
                                ? <Navigate to="/" replace />
                                : <Login onLogin={handleLogin} />
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isLoggedIn
                                ? <Home user={user} />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            isLoggedIn
                                ? <Search />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/doctor/:id"
                        element={
                            isLoggedIn
                                ? <DoctorProfile />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/booking/:id"
                        element={
                            isLoggedIn
                                ? <Booking />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/help"
                        element={
                            isLoggedIn
                                ? <Help />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
                </Routes>
            </main>
            {isLoggedIn && <Footer />}
        </div>
    )
}
