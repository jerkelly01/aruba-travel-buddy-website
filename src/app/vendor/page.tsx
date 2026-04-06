'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

// Mock types for UI scaffolding
interface Booking {
    id: string;
    customer_name: string;
    date: string;
    time: string;
    party_size: number;
    status: 'confirmed' | 'pending' | 'cancelled';
}

export default function VendorDashboard() {
    const router = useRouter();
    const { user, isLoading, logout, isAuthenticated } = useAuth();

    const [activeTab, setActiveTab] = useState<'bookings' | 'calendar'>('bookings');

    // Scaffolded state
    const [bookings, setBookings] = useState<Booking[]>([
        { id: '1', customer_name: 'John Doe', date: '2026-04-10', time: '19:00', party_size: 2, status: 'confirmed' },
        { id: '2', customer_name: 'Sarah Smith', date: '2026-04-11', time: '18:30', party_size: 4, status: 'pending' },
    ]);

    const [blockedDates, setBlockedDates] = useState<string[]>(['2026-04-15', '2026-04-16']);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/vendor/login');
        }
        // TODO: Fetch real vendor profile to get their entity_id
        // TODO: Fetch bookings from Supabase Edge Function
        // TODO: Fetch blocked dates from vendor_availability table
    }, [isLoading, isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/vendor/login');
    };

    const toggleBlockDate = (date: string) => {
        if (blockedDates.includes(date)) {
            setBlockedDates(blockedDates.filter(d => d !== date));
            // TODO: DELETE from vendor_availability
        } else {
            setBlockedDates([...blockedDates, date]);
            // TODO: INSERT into vendor_availability
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">Loading Vendor Portal...</div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#1a365d] shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Aruba Travel Buddy for Business</h1>
                        <p className="text-blue-200 mt-1">Vendor Extranet | {user?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white/10 text-white border border-white/20 px-5 py-2 rounded-lg hover:bg-white/20 transition-colors font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Navigation Tabs */}
                <div className="flex space-x-4 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 px-2 font-medium text-lg ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Incoming Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`pb-4 px-2 font-medium text-lg ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Calendar & Availability
                    </button>
                </div>

                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Your Upcoming Bookings</h2>
                            <button className="text-blue-600 font-medium hover:text-blue-800">Export .CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party Size</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.date}</div>
                                                <div className="text-sm text-gray-500">{booking.time}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.party_size} guests
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-4">Confirm</button>
                                                <button className="text-red-600 hover:text-red-900">Cancel</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {bookings.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">You don't have any upcoming bookings right now.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Availability</h2>
                            <p className="text-gray-600 mb-6">Click on a date to mark it as blocked. Customers will not be able to book through Aruba Travel Buddy on blocked dates.</p>

                            {/* Simple Calendar Mockup for the demo */}
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center font-semibold text-gray-400 text-sm py-2">{day}</div>
                                ))}
                                {/* Pad empty days */}
                                {[...Array(3)].map((_, i) => <div key={`empty-${i}`} className="p-2 border border-transparent"></div>)}

                                {/* 30 Days of April */}
                                {[...Array(30)].map((_, i) => {
                                    const day = i + 1;
                                    const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
                                    const isBlocked = blockedDates.includes(dateStr);

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => toggleBlockDate(dateStr)}
                                            className={`h-24 p-2 border rounded-lg flex flex-col justify-between transition-all ${isBlocked
                                                ? 'bg-red-50 border-red-200 hover:bg-red-100'
                                                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                                                }`}
                                        >
                                            <span className={`font-semibold ${isBlocked ? 'text-red-700' : 'text-gray-700'}`}>{day}</span>
                                            {isBlocked && (
                                                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded w-full">Blocked</span>
                                            )}
                                            {!isBlocked && (
                                                <span className="text-xs text-green-600 font-medium">Available</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
                                <h3 className="font-bold text-lg mb-2">Sync Your Calendar</h3>
                                <p className="text-blue-100 text-sm mb-4">Want to see these bookings directly on your iPhone or Google Calendar?</p>
                                <button className="w-full bg-white text-blue-700 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-50 transition-colors text-sm">
                                    Get iCal Link
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-800 mb-2">Integration Types</h3>
                                <p className="text-sm text-gray-600 mb-4">Do you use FareHarbor, OpenTable, or another booking software?</p>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 mb-2">
                                    <span className="font-medium text-gray-700 text-sm">FareHarbor Integration</span>
                                    <span className="text-blue-600 text-sm">Connect →</span>
                                </div>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <span className="font-medium text-gray-700 text-sm">Zapier Webhooks</span>
                                    <span className="text-blue-600 text-sm">Connect →</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
