'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function VendorLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            router.push('/vendor');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>

            {/* ===== LEFT PANEL — Branding ===== */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-center text-white" style={{ background: 'linear-gradient(145deg, #071529 0%, #0d2240 40%, #0a3060 70%, #0e4a6e 100%)' }}>

                {/* Diagonal shimmer streaks */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -left-20 top-10 w-48 h-[140%] opacity-20 rotate-[20deg]" style={{ background: 'linear-gradient(to bottom, transparent, #38bdf8, #0ea5e9, transparent)' }}></div>
                    <div className="absolute left-20 top-0 w-16 h-[120%] opacity-10 rotate-[20deg]" style={{ background: 'linear-gradient(to bottom, transparent, #d4af37, transparent)' }}></div>
                    <div className="absolute right-8 -top-20 w-32 h-[130%] opacity-15 rotate-[20deg]" style={{ background: 'linear-gradient(to bottom, transparent, #d4af37, #a87e1a, transparent)' }}></div>
                    {/* Palm silhouettes */}
                    <svg className="absolute bottom-0 left-0 opacity-10 text-[#d4af37]" width="280" height="340" viewBox="0 0 280 340" fill="currentColor">
                        <path d="M80 340 Q85 220 90 180 Q60 160 20 100 Q55 140 88 165 Q86 140 88 100 Q70 80 40 30 Q72 70 90 95 Q94 60 100 20 Q104 60 108 95 Q126 70 158 30 Q128 80 110 100 Q112 140 110 165 Q138 140 173 100 Q143 160 110 180 Q115 220 120 340 Z" />
                    </svg>
                    <svg className="absolute bottom-0 right-0 opacity-10 text-[#d4af37]" width="200" height="280" viewBox="0 0 280 340" fill="currentColor">
                        <path d="M80 340 Q85 220 90 180 Q60 160 20 100 Q55 140 88 165 Q86 140 88 100 Q70 80 40 30 Q72 70 90 95 Q94 60 100 20 Q104 60 108 95 Q126 70 158 30 Q128 80 110 100 Q112 140 110 165 Q138 140 173 100 Q143 160 110 180 Q115 220 120 340 Z" />
                    </svg>
                    {/* Tropical leaf bottom left */}
                    <svg className="absolute -bottom-4 -left-4 opacity-15 text-[#38bdf8]" width="300" height="220" viewBox="0 0 300 220" fill="currentColor">
                        <path d="M10 220 Q50 150 120 100 Q180 60 260 10 Q200 80 180 140 Q150 180 10 220Z" />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 px-12 py-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-lg" style={{ background: 'linear-gradient(135deg, #d4af37, #f0d060)', color: '#071529' }}>A</div>
                        <div>
                            <div className="font-bold text-base leading-tight text-white">Aruba Travel Buddy</div>
                            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#d4af37' }}>for Business</div>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: '2.6rem', background: 'linear-gradient(to right, #ffffff, #a8d8f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Your business.<br />Our platform.
                    </h1>
                    <p className="leading-relaxed mb-10" style={{ fontSize: '1rem', color: '#8bb8d4' }}>
                        Manage bookings, sync your calendar, and connect with thousands of tourists discovering Aruba every day.
                    </p>

                    {/* Feature bullets */}
                    <div className="space-y-3">
                        {[
                            { icon: '📅', label: 'Real-time Booking Management' },
                            { icon: '🔗', label: 'FareHarbor & Zapier Integration' },
                            { icon: '📲', label: 'iCal Sync for iPhone & Google' },
                        ].map(f => (
                            <div key={f.label} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                                    {f.icon}
                                </div>
                                <span className="font-medium" style={{ fontSize: '0.95rem', color: '#c5dff0' }}>{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Divider + tagline */}
                    <div className="mt-10 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Designed for Aruba's finest businesses</p>
                    </div>
                </div>
            </div>

            {/* ===== RIGHT PANEL — Form ===== */}
            <div className="flex-1 flex flex-col items-center justify-center overflow-hidden" style={{ background: '#f0f4f8' }}>
                <div className="w-full max-w-sm px-6">

                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-5">
                        <div className="inline-flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: 'linear-gradient(135deg, #d4af37, #f0d060)', color: '#071529' }}>A</div>
                            <div className="text-left">
                                <div className="font-bold text-gray-900 text-sm">Aruba Travel Buddy</div>
                                <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#d4af37' }}>for Business</div>
                            </div>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)' }}>
                        <div className="mb-6">
                            <h2 className="font-extrabold text-gray-900" style={{ fontSize: '1.6rem' }}>Welcome back</h2>
                            <p className="mt-1" style={{ fontSize: '0.9rem', color: '#7a8fa6' }}>Sign in to your Vendor Portal</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-xl flex items-center gap-2" style={{ fontSize: '0.85rem' }}>
                                    <span>⚠</span> {error}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block font-semibold mb-1.5" style={{ fontSize: '0.8rem', color: '#4a5568' }}>Business Email</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ba8b5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@yourbusiness.com"
                                        className="w-full pl-9 pr-4 py-3 rounded-xl outline-none transition-all"
                                        style={{ border: '1.5px solid #e2e8f0', background: '#f7fafc', color: '#1a202c', fontSize: '0.9rem' }}
                                        onFocus={e => e.currentTarget.style.borderColor = '#0e4a6e'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block font-semibold mb-1.5" style={{ fontSize: '0.8rem', color: '#4a5568' }}>Password</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ba8b5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-9 pr-14 py-3 rounded-xl outline-none transition-all"
                                        style={{ border: '1.5px solid #e2e8f0', background: '#f7fafc', color: '#1a202c', fontSize: '0.9rem' }}
                                        onFocus={e => e.currentTarget.style.borderColor = '#0e4a6e'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold transition-colors" style={{ fontSize: '0.75rem', color: '#9ba8b5' }}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {/* Remember / Forgot */}
                            <div className="flex items-center justify-between pt-0.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded" />
                                    <span style={{ fontSize: '0.85rem', color: '#718096' }}>Remember me</span>
                                </label>
                                <a href="#" className="font-semibold hover:underline" style={{ fontSize: '0.85rem', color: '#0e4a6e' }}>Forgot password?</a>
                            </div>

                            {/* CTA Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-1"
                                style={{
                                    fontSize: '0.95rem',
                                    background: isLoading ? '#4a6fa5' : 'linear-gradient(135deg, #0a3060, #0e4a6e)',
                                    color: 'white',
                                    boxShadow: '0 4px 14px rgba(10, 48, 96, 0.4)',
                                    opacity: isLoading ? 0.8 : 1,
                                }}
                            >
                                {isLoading ? (
                                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Signing in...</>
                                ) : 'Sign in to Dashboard →'}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-5 pt-4 border-t text-center" style={{ borderColor: '#f0f4f8' }}>
                            <p className="text-xs" style={{ color: '#9ba8b5' }}>
                                Not a partner yet?{' '}
                                <Link href="/become-a-partner" className="font-semibold hover:underline" style={{ color: '#d4af37' }}>Apply to join →</Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs mt-4" style={{ color: '#a0aec0' }}>
                        © {new Date().getFullYear()} Aruba Travel Buddy ·{' '}
                        <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
