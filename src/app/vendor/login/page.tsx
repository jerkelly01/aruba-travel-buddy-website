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
        <div className="h-screen flex overflow-hidden">
            {/* Left Panel - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f2044] via-[#1a365d] to-[#2a5298] flex-col justify-between p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1a365d] font-black text-lg">A</div>
                        <div>
                            <div className="font-bold text-lg leading-tight">Aruba Travel Buddy</div>
                            <div className="text-blue-300 text-xs uppercase tracking-widest font-semibold">for Business</div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 leading-tight">Your business.<br />Our platform.</h1>
                    <p className="text-blue-200 text-lg leading-relaxed">
                        Manage bookings, sync your calendar, and connect with thousands of tourists discovering Aruba through our app.
                    </p>
                </div>

                <div className="relative z-10 space-y-3">
                    {[
                        { icon: '📅', label: 'Real-time Booking Management' },
                        { icon: '🔗', label: 'FareHarbor & Zapier Integration' },
                        { icon: '📲', label: 'iCal Sync for iPhone & Google' },
                    ].map(f => (
                        <div key={f.label} className="flex items-center gap-3 text-blue-100">
                            <span className="text-xl">{f.icon}</span>
                            <span className="text-sm font-medium">{f.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel — fills remaining height, no scrolling */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 bg-gray-50 overflow-hidden">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-5">
                        <div className="inline-flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#1a365d] rounded-xl flex items-center justify-center text-white font-black">A</div>
                            <div className="text-left">
                                <div className="font-bold text-gray-900 text-sm">Aruba Travel Buddy</div>
                                <div className="text-blue-600 text-xs uppercase tracking-widest font-semibold">for Business</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-7">
                        <div className="mb-5">
                            <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
                            <p className="text-gray-500 mt-0.5 text-sm">Sign in to your Vendor Portal</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
                                    <span>⚠</span> {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Business Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white text-sm text-gray-900 placeholder-gray-400 transition-all"
                                    placeholder="you@yourbusiness.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 pr-16 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white text-sm text-gray-900 placeholder-gray-400 transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-[#1a365d] text-white font-bold rounded-xl hover:bg-[#2a4a7f] disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-md text-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign in to Dashboard'}
                            </button>
                        </form>

                        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                Not a partner yet?{' '}
                                <Link href="/become-a-partner" className="text-blue-600 font-semibold hover:underline">Apply to join →</Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        © {new Date().getFullYear()} Aruba Travel Buddy ·{' '}
                        <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
