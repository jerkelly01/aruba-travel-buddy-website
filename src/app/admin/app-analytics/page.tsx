'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydycncbqobpljrtknpqd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AnalyticsEvent {
    category: string;
    feature_name: string;
    action: string;
    count: number;
}

export default function AppAnalyticsPage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [loading, setLoading] = useState(true);

    // Grouped stats
    const topScreens = events.filter(e => e.action === 'view_screen').sort((a, b) => b.count - a.count).slice(0, 10);
    const topClicks = events.filter(e => e.action === 'click').sort((a, b) => b.count - a.count).slice(0, 10);
    const topCategories = events.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.count;
        return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(topCategories).sort((a, b) => b[1] - a[1]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('authToken');
            if (token && token !== 'mock-token-for-demo') {
                supabase.auth.setSession({ access_token: token, refresh_token: '' });
            }
            fetchAnalytics();
        }
    }, [isAuthenticated, timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const daysObj = { '7d': 7, '30d': 30, '90d': 90 };
            const days = daysObj[timeRange] || 7;

            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            // Group by category, feature, and action
            const { data, error } = await supabase
                .from('app_analytics_events')
                .select('category, feature_name, action')
                .gte('created_at', cutoffDate.toISOString());

            if (error) {
                throw error;
            }

            if (data) {
                // Aggregate on client side since generic RPC requires migration 
                // and we want quick sorting
                const aggregation: Record<string, AnalyticsEvent> = {};

                data.forEach((row: any) => {
                    const key = `${row.category}|${row.feature_name}|${row.action}`;
                    if (!aggregation[key]) {
                        aggregation[key] = {
                            category: row.category,
                            feature_name: row.feature_name,
                            action: row.action,
                            count: 0
                        };
                    }
                    aggregation[key].count += 1;
                });

                setEvents(Object.values(aggregation));
            }
        } catch (error) {
            console.error('Failed to fetch app analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportForAI = () => {
        // Generate a cleanly formatted text summarizing the data
        let exportText = `Aruba Travel Buddy App Usage Report (${timeRange})\n`;
        exportText += `Generated on: ${new Date().toLocaleString()}\n\n`;

        exportText += `--- TOP CATEGORIES ---\n`;
        sortedCategories.forEach(([cat, count]) => {
            exportText += `- ${cat}: ${count} interactions\n`;
        });

        exportText += `\n--- MOST VISITED SCREENS ---\n`;
        topScreens.forEach((e, idx) => {
            exportText += `${idx + 1}. ${e.feature_name} (${e.category}): ${e.count} views\n`;
        });

        exportText += `\n--- MOST CLICKED FEATURES/BUTTONS ---\n`;
        topClicks.forEach((e, idx) => {
            exportText += `${idx + 1}. ${e.feature_name} (${e.category}): ${e.count} clicks\n`;
        });

        exportText += `\nPrompt: "Please analyze this mobile app usage data and tell me which features I should prioritize developing, which ones might need better discoverability, and general UX recommendations."`;

        // Copy to clipboard
        navigator.clipboard.writeText(exportText).then(() => {
            alert("Successfully copied formatted report to clipboard! Paste it into ChatGPT or Claude.");
        }).catch(err => {
            console.error('Could not copy text: ', err);
            // Fallback
            prompt("Copy the text below:", exportText);
        });
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mobile App Analytics</h1>
                            <p className="text-gray-600">Track how users navigate and interact with the React Native App</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/admin" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                                Dashboard
                            </Link>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value as any)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
                            >
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleExportForAI}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:shadow-lg transition cursor-pointer"
                    >
                        <span>🤖 Export for AI Analysis</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-600">Loading analytics...</div>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

                        {/* Top Categories Card */}
                        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Most Popular Categories</h3>
                            <div className="space-y-4">
                                {sortedCategories.slice(0, 5).map(([cat, count], idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b pb-2">
                                        <span className="font-medium text-gray-700">{cat}</span>
                                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-bold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Screens (Views) Card */}
                        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Most Visited Screens</h3>
                            <div className="space-y-4">
                                {topScreens.map((screen, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b pb-2">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700">{screen.feature_name}</span>
                                            <span className="text-xs text-gray-400">{screen.category}</span>
                                        </div>
                                        <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold">{screen.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Clicks Card */}
                        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Clicked Features</h3>
                            <div className="space-y-4">
                                {topClicks.map((click, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b pb-2">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700">{click.feature_name}</span>
                                            <span className="text-xs text-gray-400">{click.category}</span>
                                        </div>
                                        <span className="bg-orange-100 text-orange-800 py-1 px-3 rounded-full text-xs font-bold">{click.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
                        <span className="text-4xl mb-4 block">🏝️</span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No App Events Found</h3>
                        <p className="text-gray-600">
                            We couldn't find any app analytics events in the last {timeRange.replace('d', '')} days. Make sure your React Native app is configured to send tracking data to the newly created table.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
