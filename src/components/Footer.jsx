import { useState } from 'react'
import { Pill } from 'lucide-react'

/*
 * V1 FIX: Dense footer (50+ links) → Collapsible sections, ≤7 items per group
 * Miller's 7±2, Hick's Law, Tesler's Law, Nielsen #8
 */
export default function Footer() {
    const [openSection, setOpenSection] = useState(null)

    const sections = [
        {
            title: 'For Patients',
            items: ['Find Doctors', 'Video Consult', 'Book Lab Tests', 'Read Health Articles', 'Health App']
        },
        {
            title: 'For Doctors',
            items: ['Doctor Profile', 'Practo Consult', 'Practo Health Feed']
        },
        {
            title: 'Company',
            items: ['About', 'Blog', 'Careers', 'Contact Us']
        },
        {
            title: 'More',
            items: ['Help', 'Privacy Policy', 'Terms & Conditions']
        }
    ]

    return (
        <footer className="bg-trust-800 text-trust-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Desktop: grid layout */}
                <div className="hidden md:grid md:grid-cols-4 gap-8">
                    {sections.map(section => (
                        <div key={section.title}>
                            <h3 className="text-white font-semibold text-base mb-4">{section.title}</h3>
                            <ul className="space-y-2.5">
                                {section.items.map(item => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-trust-400 hover:text-white transition-colors duration-200">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Mobile: collapsible accordion — V1 fix */}
                <div className="md:hidden space-y-1">
                    {sections.map(section => (
                        <div key={section.title} className="border-b border-trust-700">
                            <button
                                onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                                className="w-full flex items-center justify-between py-4 text-white font-semibold text-base"
                            >
                                {section.title}
                                <svg
                                    className={`w-5 h-5 transition-transform duration-200 ${openSection === section.title ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openSection === section.title && (
                                <ul className="pb-4 space-y-2.5 pl-2">
                                    {section.items.map(item => (
                                        <li key={item}>
                                            <a href="#" className="text-sm text-trust-400 hover:text-white transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-8 pt-6 border-t border-trust-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Pill className="w-6 h-6 stroke-[1.5]" />
                        <span className="text-white font-bold text-lg">BetterPracto</span>
                    </div>
                    <p className="text-sm text-trust-500">© 2026 BetterPracto. Designed with HCI principles.</p>
                </div>
            </div>
        </footer>
    )
}
