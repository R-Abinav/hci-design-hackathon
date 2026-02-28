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

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [showOnboarding, setShowOnboarding] = useState(false)

    const handleLogin = (userData) => {
        setIsLoggedIn(true)
        setUser(userData)
        setShowOnboarding(true) // V4: show onboarding on first login
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUser(null)
    }

    return (
        <div className="min-h-screen flex flex-col bg-trust-50">
            {/* V4: Onboarding overlay for first-time users */}
            {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
            {isLoggedIn && <Navbar user={user} onLogout={handleLogout} />}
            <main className="flex-1">
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
