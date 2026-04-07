'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    fetchBlockedDates,
    fetchVendorBookings,
    createWalkinBooking,
    updateBookingStatus as syncBookingStatus,
    setBlockedDate as syncBlockedDate,
    saveVendorSettings,
    type EntityProfile,
} from '@/lib/vendor-api';

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'no-show';

interface Booking {
    id: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    date: string;        // YYYY-MM-DD
    time: string;        // HH:MM
    party_size: number;
    status: BookingStatus;
    notes?: string;
    is_manual?: boolean;
    created_at: string;  // ISO
}

interface ScheduleSettings {
    openTime: string;
    closeTime: string;
    intervalMinutes: number;
    maxGuestsPerSlot: number;
    slotPadding: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INTERVAL_OPTIONS = [15, 30, 45, 60, 90, 120] as const;
const SCHEDULE_KEY = 'arubaVendorScheduleSettings';
const BOOKINGS_KEY  = 'arubaVendorBookings';
const BLOCKED_KEY   = 'arubaVendorBlockedDates';
const PROFILE_KEY   = 'arubaVendorProfile';

const ENTITY_TYPE_LABELS: Record<string, string> = {
    restaurant:     'Restaurant',
    tour:           'Tour',
    experience:     'Local Experience',
    transportation: 'Transportation',
};

const ENTITY_TYPE_EMOJI: Record<string, string> = {
    restaurant: '🍽️', tour: '🌊', experience: '🎯', transportation: '🚗',
};
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const DEFAULT_SCHEDULE: ScheduleSettings = {
    openTime: '09:00',
    closeTime: '21:00',
    intervalMinutes: 60,
    maxGuestsPerSlot: 20,
    slotPadding: 0,
};

const SEED_BOOKINGS: Booking[] = [
    { id: '1', customer_name: 'John Doe',      customer_email: 'john@example.com',    customer_phone: '+1 305 555 0101', date: '2026-04-10', time: '19:00', party_size: 2, status: 'confirmed', created_at: '2026-04-01T10:00:00Z' },
    { id: '2', customer_name: 'Sarah Smith',   customer_email: 'sarah@example.com',   date: '2026-04-11', time: '18:00', party_size: 4, status: 'pending',   notes: 'Anniversary dinner – please prepare flowers', created_at: '2026-04-02T14:30:00Z' },
    { id: '3', customer_name: 'Mike Johnson',  customer_phone: '+1 786 555 0202',     date: '2026-04-10', time: '20:00', party_size: 3, status: 'confirmed', created_at: '2026-04-02T09:15:00Z' },
    { id: '4', customer_name: 'Emma Wilson',   customer_email: 'emma@example.com',    date: '2026-04-12', time: '19:00', party_size: 6, status: 'pending',   notes: 'Allergic to shellfish', created_at: '2026-04-03T11:00:00Z' },
    { id: '5', customer_name: 'Carlos Rivera', customer_email: 'carlos@example.com',  customer_phone: '+1 954 555 0303', date: '2026-04-07', time: '18:00', party_size: 2, status: 'confirmed', created_at: '2026-03-30T16:45:00Z' },
    { id: '6', customer_name: 'Anika Patel',   customer_email: 'anika@example.com',   date: '2026-04-06', time: '19:00', party_size: 5, status: 'no-show',   created_at: '2026-03-28T08:00:00Z', is_manual: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeSchedule(raw?: Partial<ScheduleSettings> | null): ScheduleSettings {
    const b = { ...DEFAULT_SCHEDULE, ...raw };
    return {
        ...b,
        intervalMinutes: (INTERVAL_OPTIONS as readonly number[]).includes(b.intervalMinutes)
            ? b.intervalMinutes : DEFAULT_SCHEDULE.intervalMinutes,
        maxGuestsPerSlot: Math.max(1, Math.min(500, Number(b.maxGuestsPerSlot) || DEFAULT_SCHEDULE.maxGuestsPerSlot)),
        slotPadding:      Math.max(0, Number(b.slotPadding) || 0),
    };
}

function generateSlots(s: ScheduleSettings): string[] {
    const slots: string[] = [];
    const [oh, om] = s.openTime.split(':').map(Number);
    const [ch, cm] = s.closeTime.split(':').map(Number);
    let cur = oh * 60 + om;
    const end = ch * 60 + cm;
    while (cur < end) {
        slots.push(`${Math.floor(cur / 60).toString().padStart(2, '0')}:${(cur % 60).toString().padStart(2, '0')}`);
        cur += s.intervalMinutes + s.slotPadding;
    }
    return slots;
}

function fmt12(t: string): string {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtDateLong(d: string): string {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function fmtDateMed(d: string): string {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function todayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}

function dateISO(y: number, mo: number, d: number): string {
    return `${y}-${(mo + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
}

const SS: Record<BookingStatus, { pill: string; dot: string; label: string }> = {
    confirmed:  { pill: 'bg-green-100 text-green-800',   dot: 'bg-green-500',  label: 'Confirmed' },
    pending:    { pill: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500', label: 'Pending'   },
    cancelled:  { pill: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400',   label: 'Cancelled' },
    'no-show':  { pill: 'bg-red-100 text-red-700',       dot: 'bg-red-500',    label: 'No-show'   },
};

// ─── Supabase booking mapper ───────────────────────────────────────────────────

function mapSupabaseBooking(b: Record<string, unknown>): Booking {
    const time = b.booking_time ? String(b.booking_time).substring(0, 5) : '09:00';
    const rawStatus = String(b.status || 'pending');
    const status: BookingStatus =
        rawStatus === 'no_show' ? 'no-show' :
        (['confirmed', 'pending', 'cancelled', 'no-show'] as BookingStatus[]).includes(rawStatus as BookingStatus)
            ? rawStatus as BookingStatus : 'pending';

    return {
        id:             String(b.id),
        customer_name:  String(b.customer_name || 'Customer'),
        customer_email: b.contact_email  ? String(b.contact_email)  : undefined,
        customer_phone: b.contact_phone  ? String(b.contact_phone)  : undefined,
        date:           String(b.booking_date),
        time,
        party_size:     Number(b.party_size) || 1,
        status,
        notes:          b.special_requests ? String(b.special_requests) : undefined,
        is_manual:      Boolean(b.is_manual),
        created_at:     String(b.created_at || new Date().toISOString()),
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VendorDashboard() {
    const router = useRouter();
    const { user, isLoading, logout, isAuthenticated } = useAuth();

    const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'settings'>('bookings');

    // Data
    const [bookings, setBookings]       = useState<Booking[]>(SEED_BOOKINGS);
    const [blockedDates, setBlockedDates] = useState<string[]>(['2026-04-15', '2026-04-16']);

    // Bookings tab
    const [bookingFilter, setBookingFilter] = useState<BookingStatus | 'all'>('all');
    const [searchQuery, setSearchQuery]     = useState('');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    // Calendar
    const [calYear, setCalYear]   = useState(() => new Date().getFullYear());
    const [calMonth, setCalMonth] = useState(() => new Date().getMonth()); // 0-based
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showAddForm, setShowAddForm]   = useState(false);

    // Schedule
    const [schedule, setSchedule]         = useState<ScheduleSettings>(DEFAULT_SCHEDULE);
    const [draftSchedule, setDraftSchedule] = useState<ScheduleSettings>(DEFAULT_SCHEDULE);
    const [scheduleSaved, setScheduleSaved] = useState(false);

    const timeSlots = useMemo(() => generateSlots(schedule), [schedule]);
    const [newBooking, setNewBooking] = useState({
        customer_name: '', customer_email: '', customer_phone: '',
        time: '', party_size: '2', notes: '',
    });

    // Integrations
    const [showIntegrationModal, setShowIntegrationModal] = useState<'fareharbor' | 'zapier' | null>(null);
    const [integrationForm, setIntegrationForm] = useState({ shortname: '', apiKey: '', webhookUrl: '' });
    const [isSyncing, setIsSyncing] = useState(false);
    const [icalKey, setIcalKey]     = useState<string | null>(null);

    // Entity profile — connects this dashboard to a real business in Supabase
    const [entityProfile, setEntityProfile] = useState<EntityProfile | null>(null);
    const [draftProfile, setDraftProfile]   = useState<{ entity_type: string; entity_id: string }>({ entity_type: 'restaurant', entity_id: '' });
    const [isSupabaseSyncing, setIsSupabaseSyncing] = useState(false);
    const [supabaseSyncLabel, setSupabaseSyncLabel] = useState<string | null>(null);

    // ─── Auth guard ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push('/vendor/login');
    }, [isLoading, isAuthenticated, router]);

    // ─── Load localStorage + bootstrap Supabase ──────────────────────────────
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const s = localStorage.getItem(SCHEDULE_KEY);
            if (s) { const p = normalizeSchedule(JSON.parse(s) as Partial<ScheduleSettings>); setSchedule(p); setDraftSchedule(p); }
            const b = localStorage.getItem(BOOKINGS_KEY);
            if (b) setBookings(JSON.parse(b) as Booking[]);
            const bl = localStorage.getItem(BLOCKED_KEY);
            if (bl) setBlockedDates(JSON.parse(bl) as string[]);

            // Load entity profile — if set, fetch live data from Supabase
            const prof = localStorage.getItem(PROFILE_KEY);
            if (prof) {
                const profile = JSON.parse(prof) as EntityProfile;
                setEntityProfile(profile);
                setDraftProfile({ entity_type: profile.entity_type, entity_id: profile.entity_id });
                loadFromSupabase(profile);
            }
        } catch { /* corrupt storage */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Persist ─────────────────────────────────────────────────────────────
    useEffect(() => { try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)); } catch { } }, [bookings]);
    useEffect(() => { try { localStorage.setItem(BLOCKED_KEY, JSON.stringify(blockedDates)); } catch { } }, [blockedDates]);

    // ─── Sync form time with slots ───────────────────────────────────────────
    useEffect(() => {
        setNewBooking(prev => ({ ...prev, time: timeSlots[0] || '09:00' }));
    }, [timeSlots]);

    // ─── Derived ─────────────────────────────────────────────────────────────
    const today        = todayISO();
    const pendingCount = useMemo(() => bookings.filter(b => b.status === 'pending').length, [bookings]);
    const todayActive  = useMemo(() => bookings.filter(b => b.date === today && (b.status === 'confirmed' || b.status === 'pending')), [bookings, today]);
    const todayGuests  = useMemo(() => todayActive.reduce((s, b) => s + b.party_size, 0), [todayActive]);

    const filteredBookings = useMemo(() => {
        let list = [...bookings];
        if (bookingFilter !== 'all') list = list.filter(b => b.status === bookingFilter);
        const q = searchQuery.trim().toLowerCase();
        if (q) list = list.filter(b =>
            b.customer_name.toLowerCase().includes(q) ||
            b.customer_email?.toLowerCase().includes(q) ||
            b.customer_phone?.includes(q) ||
            b.date.includes(q)
        );
        return list.sort((a, b) => {
            const aUp = a.date >= today, bUp = b.date >= today;
            if (aUp !== bUp) return aUp ? -1 : 1;
            if (a.date !== b.date) return aUp ? (a.date < b.date ? -1 : 1) : (a.date > b.date ? -1 : 1);
            return aUp ? (a.time < b.time ? -1 : 1) : (a.time > b.time ? -1 : 1);
        });
    }, [bookings, bookingFilter, searchQuery, today]);

    const getBookingsForDate = useCallback(
        (date: string) => bookings.filter(b => b.date === date && b.status !== 'cancelled'),
        [bookings]
    );

    const selectedDateBookings = useMemo(
        () => selectedDate ? getBookingsForDate(selectedDate) : [],
        [selectedDate, getBookingsForDate]
    );
    const isSelectedBlocked = selectedDate ? blockedDates.includes(selectedDate) : false;

    // Calendar grid
    const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const calFirstDay    = new Date(calYear, calMonth, 1).getDay();

    // Slot helpers
    const getSlotBookings = (date: string, time: string) =>
        bookings.filter(b => b.date === date && b.time === time && b.status !== 'cancelled');
    const getSlotGuests   = (date: string, time: string) =>
        getSlotBookings(date, time).reduce((s, b) => s + b.party_size, 0);

    // ─── Supabase sync helpers ────────────────────────────────────────────────

    const loadFromSupabase = async (profile: EntityProfile) => {
        setIsSupabaseSyncing(true);
        setSupabaseSyncLabel('Syncing with Supabase…');
        try {
            const [dbBookings, dbBlocked] = await Promise.all([
                fetchVendorBookings(profile.entity_type, profile.entity_id),
                fetchBlockedDates(profile.entity_type, profile.entity_id),
            ]);
            if (dbBookings.length > 0) setBookings(dbBookings.map(mapSupabaseBooking));
            if (dbBlocked.length > 0)  setBlockedDates(dbBlocked);
            setSupabaseSyncLabel('Synced ✓');
            setTimeout(() => setSupabaseSyncLabel(null), 3000);
        } catch {
            setSupabaseSyncLabel(null);
        } finally {
            setIsSupabaseSyncing(false);
        }
    };

    // ─── Entity profile handlers ──────────────────────────────────────────────

    const handleConnectProfile = () => {
        const profile: EntityProfile = {
            entity_type: draftProfile.entity_type,
            entity_id:   draftProfile.entity_id.trim(),
            entity_name: ENTITY_TYPE_LABELS[draftProfile.entity_type] || draftProfile.entity_type,
        };
        setEntityProfile(profile);
        try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { }
        loadFromSupabase(profile);
    };

    const handleDisconnectProfile = () => {
        setEntityProfile(null);
        try { localStorage.removeItem(PROFILE_KEY); } catch { }
    };

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleLogout = () => { logout(); router.push('/vendor/login'); };

    const handleUpdateStatus = (id: string, status: BookingStatus) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        setSelectedBooking(prev => prev?.id === id ? { ...prev, status } : prev);
        // Supabase: map no-show → no_show
        if (entityProfile) {
            const supabaseStatus = status === 'no-show' ? 'no_show' : status;
            syncBookingStatus(id, supabaseStatus).catch(console.error);
        }
    };

    const handleCancelBooking = (id: string) => {
        if (!confirm('Cancel this booking? The customer will be notified.')) return;
        handleUpdateStatus(id, 'cancelled');
        if (selectedBooking?.id === id) setSelectedBooking(null);
    };

    const handleDayClick = (dateStr: string) => {
        setSelectedDate(dateStr);
        setShowAddForm(false);
        setNewBooking(prev => ({ ...prev, customer_name: '', customer_email: '', customer_phone: '', party_size: '2', notes: '', time: timeSlots[0] || '09:00' }));
    };

    const handleToggleBlock = () => {
        if (!selectedDate) return;
        const nowBlocked = blockedDates.includes(selectedDate);
        setBlockedDates(prev =>
            nowBlocked ? prev.filter(d => d !== selectedDate) : [...prev, selectedDate]
        );
        if (entityProfile) {
            syncBlockedDate(entityProfile.entity_type, entityProfile.entity_id, selectedDate, !nowBlocked)
                .catch(console.error);
        }
    };

    const handleAddManualBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;
        const existing = getSlotGuests(selectedDate, newBooking.time);
        const incoming = parseInt(newBooking.party_size);
        if (existing + incoming > schedule.maxGuestsPerSlot) {
            alert(`Slot is at capacity (${existing}/${schedule.maxGuestsPerSlot} guests). Choose a different time or increase max guests in Settings.`);
            return;
        }
        const localId = `manual-${Date.now()}`;
        const localBooking: Booking = {
            id: localId,
            customer_name:  newBooking.customer_name,
            customer_email: newBooking.customer_email  || undefined,
            customer_phone: newBooking.customer_phone  || undefined,
            date:       selectedDate,
            time:       newBooking.time,
            party_size: incoming,
            notes:      newBooking.notes || undefined,
            status:     'confirmed',
            is_manual:  true,
            created_at: new Date().toISOString(),
        };
        setBookings(prev => [...prev, localBooking]);
        setShowAddForm(false);
        setNewBooking(prev => ({ ...prev, customer_name: '', customer_email: '', customer_phone: '', party_size: '2', notes: '' }));

        // Sync to Supabase — replace local id with real id on success
        if (entityProfile) {
            createWalkinBooking({
                entity_type:    entityProfile.entity_type,
                entity_id:      entityProfile.entity_id,
                customer_name:  localBooking.customer_name,
                customer_email: localBooking.customer_email,
                customer_phone: localBooking.customer_phone,
                date:           selectedDate,
                time:           localBooking.time,
                party_size:     incoming,
                notes:          localBooking.notes,
            }).then(result => {
                if (result) {
                    setBookings(prev => prev.map(b => b.id === localId ? { ...b, id: result.id } : b));
                }
            }).catch(console.error);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Date', 'Time', 'Name', 'Email', 'Phone', 'Guests', 'Status', 'Source', 'Notes'];
        const rows = filteredBookings.map(b => [
            b.date, fmt12(b.time), b.customer_name,
            b.customer_email ?? '', b.customer_phone ?? '',
            b.party_size, b.status,
            b.is_manual ? 'Walk-in' : 'Online',
            b.notes ?? '',
        ]);
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${today}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGenerateIcal = () =>
        setIcalKey(`https://arubatravelbuddy.com/api/sync/v1/cal_${Math.random().toString(36).slice(-12)}.ics`);

    const handleConnectIntegration = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSyncing(true);
        setTimeout(() => { setIsSyncing(false); setShowIntegrationModal(null); setIntegrationForm({ shortname: '', apiKey: '', webhookUrl: '' }); }, 1500);
    };

    const handleSaveSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        const next = normalizeSchedule(draftSchedule);
        setSchedule(next);
        setDraftSchedule(next);
        try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(next)); } catch { }
        setScheduleSaved(true);
        setTimeout(() => setScheduleSaved(false), 3500);
        // Sync to Supabase so the app picks up the new slot schedule
        if (entityProfile) {
            saveVendorSettings(entityProfile.entity_type, entityProfile.entity_id, {
                open_time:           next.openTime,
                close_time:          next.closeTime,
                interval_minutes:    next.intervalMinutes,
                max_guests_per_slot: next.maxGuestsPerSlot,
                slot_padding:        next.slotPadding,
            }).catch(console.error);
        }
    };

    const prevMonth = () => {
        if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1);
        setSelectedDate(null);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1);
        setSelectedDate(null);
    };
    const goToToday = () => {
        const d = new Date();
        setCalYear(d.getFullYear()); setCalMonth(d.getMonth());
        setSelectedDate(today); setActiveTab('calendar');
    };

    // ─── Loading / auth guard ─────────────────────────────────────────────────
    if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-gray-500 animate-pulse">Loading…</div></div>;
    if (!isAuthenticated) return null;

    // ─── Filter counts ────────────────────────────────────────────────────────
    const filterCounts: Record<string, number> = {
        all:       bookings.length,
        pending:   bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        'no-show': bookings.filter(b => b.status === 'no-show').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    // ─── JSX ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#f5f7fa]">

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-[#0f2044] to-[#1a365d] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#1a365d] font-black text-base shadow">A</div>
                            <div>
                                <div className="text-white font-bold leading-tight">Aruba Travel Buddy</div>
                                <div className="text-blue-300 text-xs uppercase tracking-widest font-semibold">Vendor Portal</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={goToToday}
                                className="hidden sm:flex items-center gap-1.5 bg-white/10 text-white/80 border border-white/20 px-3 py-2 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium"
                            >
                                📅 Today
                            </button>
                            {entityProfile && (
                                <div className="hidden sm:flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    {ENTITY_TYPE_EMOJI[entityProfile.entity_type]} Live
                                </div>
                            )}
                            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                                <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xs">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'V'}
                                </div>
                                <div>
                                    <div className="text-white text-sm font-medium leading-tight">{user?.name}</div>
                                    <div className="text-blue-300 text-xs">{user?.email}</div>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-1.5 bg-white/10 text-white/80 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6 py-3 overflow-x-auto">
                        {/* Pending */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">⏳</div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">{pendingCount}</div>
                                <div className="text-xs text-gray-500 font-medium">Pending</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 shrink-0" />
                        {/* Confirmed */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">✅</div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">{bookings.filter(b => b.status === 'confirmed').length}</div>
                                <div className="text-xs text-gray-500 font-medium">Confirmed</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 shrink-0" />
                        {/* Today */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">📆</div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">{todayActive.length}</div>
                                <div className="text-xs text-gray-500 font-medium">Today · {todayGuests} guests</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 shrink-0" />
                        {/* Blocked */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl">🚫</div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">{blockedDates.length}</div>
                                <div className="text-xs text-gray-500 font-medium">Blocked Dates</div>
                            </div>
                        </div>
                        {pendingCount > 0 && (
                            <>
                                <div className="w-px h-8 bg-gray-200 shrink-0" />
                                <button
                                    onClick={() => { setBookingFilter('pending'); setActiveTab('bookings'); }}
                                    className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 shrink-0 hover:bg-yellow-100 transition-colors"
                                >
                                    <span className="text-yellow-700 text-sm font-semibold">⚠ {pendingCount} need{pendingCount === 1 ? 's' : ''} confirmation</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit mb-6">
                    {(['bookings', 'calendar', 'settings'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { if (tab === 'settings') setDraftSchedule(schedule); setActiveTab(tab); }}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-[#1a365d] text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            {tab === 'bookings' ? '📋 Bookings' : tab === 'calendar' ? '📅 Calendar' : '⚙️ Settings'}
                        </button>
                    ))}
                </div>

                {/* ══ BOOKINGS TAB ══ */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Toolbar */}
                        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-sm">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or date…"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
                                )}
                            </div>
                            {/* Filters */}
                            <div className="flex flex-wrap gap-1.5">
                                {(['all', 'pending', 'confirmed', 'no-show', 'cancelled'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setBookingFilter(f)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${bookingFilter === f ? 'bg-[#1a365d] text-white border-transparent' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {f === 'all' ? 'All' : f === 'no-show' ? 'No-show' : f.charAt(0).toUpperCase() + f.slice(1)}
                                        {' '}
                                        <span className="opacity-70">({filterCounts[f]})</span>
                                    </button>
                                ))}
                            </div>
                            {/* Export */}
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors shrink-0"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Export CSV
                            </button>
                        </div>

                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-4xl mb-3">📭</div>
                                <p className="text-gray-500 font-medium">No bookings match your filters</p>
                                <p className="text-sm text-gray-400 mt-1">Try clearing the search or changing the filter</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredBookings.map(booking => (
                                            <tr
                                                key={booking.id}
                                                onClick={() => setSelectedBooking(booking)}
                                                className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">{fmtDateMed(booking.date)}</div>
                                                    <div className="text-xs text-gray-400 mt-0.5">{fmt12(booking.time)}</div>
                                                    {booking.date === today && <span className="text-xs text-blue-600 font-semibold">Today</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">{booking.customer_name}</div>
                                                    {booking.customer_email && <div className="text-xs text-gray-400">{booking.customer_email}</div>}
                                                    {booking.customer_phone && <div className="text-xs text-gray-400">{booking.customer_phone}</div>}
                                                    <div className="flex gap-1 mt-1">
                                                        {booking.is_manual && <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">Walk-in</span>}
                                                        {booking.notes && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Has notes</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-gray-900">{booking.party_size}</span>
                                                    <span className="text-xs text-gray-400 ml-1">guests</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${SS[booking.status].pill}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${SS[booking.status].dot}`} />
                                                        {SS[booking.status].label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                        {booking.status === 'pending' && (
                                                            <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors">
                                                                ✓ Confirm
                                                            </button>
                                                        )}
                                                        {booking.status === 'confirmed' && booking.date < today && (
                                                            <button onClick={() => handleUpdateStatus(booking.id, 'no-show')} className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">
                                                                No-show
                                                            </button>
                                                        )}
                                                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                            <button onClick={() => handleCancelBooking(booking.id)} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
                                    Showing {filteredBookings.length} of {bookings.length} bookings · Click any row for details
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ══ CALENDAR TAB ══ */}
                {activeTab === 'calendar' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Calendar */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            {/* Month nav */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
                                        ‹
                                    </button>
                                    <h2 className="text-lg font-bold text-gray-900 min-w-[160px] text-center">{MONTHS[calMonth]} {calYear}</h2>
                                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
                                        ›
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="hidden sm:flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 inline-block" />Today</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block" />Blocked</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />Pending</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1.5">
                                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                                    <div key={d} className="text-center text-xs font-semibold text-gray-400 pb-2">{d}</div>
                                ))}
                                {Array.from({ length: calFirstDay }).map((_, i) => <div key={`e${i}`} />)}
                                {Array.from({ length: calDaysInMonth }).map((_, i) => {
                                    const day     = i + 1;
                                    const dateStr = dateISO(calYear, calMonth, day);
                                    const isBlocked   = blockedDates.includes(dateStr);
                                    const isSelected  = selectedDate === dateStr;
                                    const isToday     = dateStr === today;
                                    const dayBookings = getBookingsForDate(dateStr);
                                    const hasPending  = dayBookings.some(b => b.status === 'pending');

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => handleDayClick(dateStr)}
                                            className={`h-16 p-1.5 border rounded-xl flex flex-col items-center justify-between transition-all text-center relative ${
                                                isSelected  ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 shadow-sm'
                                                : isBlocked ? 'bg-red-50 border-red-200 hover:bg-red-100'
                                                : isToday   ? 'border-blue-500 bg-blue-500 shadow-sm'
                                                            : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30'
                                            }`}
                                        >
                                            {hasPending && <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />}
                                            <span className={`font-bold text-sm ${isToday ? 'text-white' : isBlocked ? 'text-red-600' : isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{day}</span>
                                            {isBlocked && <span className="text-xs text-red-500 font-medium">Closed</span>}
                                            {!isBlocked && dayBookings.length > 0 && (
                                                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${isToday ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>{dayBookings.length}</span>
                                            )}
                                            {!isBlocked && dayBookings.length === 0 && <span className={`text-xs ${isToday ? 'text-blue-200' : 'text-gray-300'}`}>—</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-4">
                            {selectedDate ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Day header */}
                                    <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-base">{fmtDateMed(selectedDate)}</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''} · {selectedDateBookings.reduce((s, b) => s + b.party_size, 0)} guests</p>
                                            </div>
                                            <button
                                                onClick={handleToggleBlock}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors shrink-0 ${isSelectedBlocked ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100' : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'}`}
                                            >
                                                {isSelectedBlocked ? '✓ Unblock' : '🚫 Block'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Time-slot capacity grid */}
                                    {!isSelectedBlocked && (
                                        <div className="p-3 space-y-1.5 max-h-64 overflow-y-auto">
                                            {timeSlots.length === 0 ? (
                                                <p className="text-xs text-gray-400 text-center py-4">No slots configured. Check Settings.</p>
                                            ) : timeSlots.map(slot => {
                                                const slotBks  = getSlotBookings(selectedDate, slot);
                                                const guests   = getSlotGuests(selectedDate, slot);
                                                const pct      = Math.min(100, (guests / schedule.maxGuestsPerSlot) * 100);
                                                const isFull   = guests >= schedule.maxGuestsPerSlot;
                                                const barColor = isFull ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-400' : 'bg-blue-500';
                                                return (
                                                    <div key={slot} className={`rounded-xl border p-2.5 ${slotBks.length > 0 ? 'border-blue-100 bg-blue-50/60' : 'border-gray-100 bg-gray-50/60'}`}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-bold text-gray-700">{fmt12(slot)}</span>
                                                            <span className={`text-xs font-semibold ${isFull ? 'text-red-600' : 'text-gray-500'}`}>
                                                                {guests}/{schedule.maxGuestsPerSlot} guests{isFull ? ' · Full' : ''}
                                                            </span>
                                                        </div>
                                                        {/* Capacity bar */}
                                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                                                            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                                                        </div>
                                                        {/* Bookings on this slot */}
                                                        {slotBks.map(b => (
                                                            <button
                                                                key={b.id}
                                                                onClick={() => setSelectedBooking(b)}
                                                                className="w-full text-left flex items-center justify-between mt-1 bg-white border border-gray-100 rounded-lg px-2.5 py-1.5 hover:border-blue-300 hover:shadow-sm transition-all group"
                                                            >
                                                                <div>
                                                                    <div className="text-xs font-semibold text-gray-800">{b.customer_name}</div>
                                                                    <div className="text-xs text-gray-400">{b.party_size} guest{b.party_size !== 1 ? 's' : ''}</div>
                                                                </div>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SS[b.status].pill}`}>{SS[b.status].label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {isSelectedBlocked && (
                                        <div className="p-6 text-center">
                                            <div className="text-3xl mb-2">🚫</div>
                                            <p className="text-sm text-gray-500 font-medium">This date is blocked</p>
                                            <p className="text-xs text-gray-400 mt-1">Click Unblock to accept bookings</p>
                                        </div>
                                    )}

                                    {/* Add walk-in */}
                                    {!isSelectedBlocked && (
                                        <div className="p-4 border-t border-gray-100">
                                            {!showAddForm ? (
                                                <button
                                                    onClick={() => setShowAddForm(true)}
                                                    className="w-full py-2.5 border-2 border-dashed border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
                                                >
                                                    + Add Walk-in Booking
                                                </button>
                                            ) : (
                                                <form onSubmit={handleAddManualBooking} className="space-y-3">
                                                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">New Walk-in</p>
                                                    <input required type="text" placeholder="Customer Name *" value={newBooking.customer_name} onChange={e => setNewBooking({ ...newBooking, customer_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
                                                    <input type="email" placeholder="Email (optional)" value={newBooking.customer_email} onChange={e => setNewBooking({ ...newBooking, customer_email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
                                                    <input type="tel" placeholder="Phone (optional)" value={newBooking.customer_phone} onChange={e => setNewBooking({ ...newBooking, customer_phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1 font-medium">Time</label>
                                                            <select value={newBooking.time} onChange={e => setNewBooking({ ...newBooking, time: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50">
                                                                {timeSlots.map(t => {
                                                                    const g = getSlotGuests(selectedDate, t);
                                                                    const full = g >= schedule.maxGuestsPerSlot;
                                                                    return <option key={t} value={t} disabled={full}>{fmt12(t)}{full ? ' (Full)' : ` (${g}/${schedule.maxGuestsPerSlot})`}</option>;
                                                                })}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1 font-medium">Guests</label>
                                                            <input required type="number" min="1" max="50" value={newBooking.party_size} onChange={e => setNewBooking({ ...newBooking, party_size: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                                        </div>
                                                    </div>
                                                    <textarea placeholder="Notes (optional)" rows={2} value={newBooking.notes} onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50" />
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-2.5 text-gray-600 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200">Cancel</button>
                                                        <button type="submit" className="flex-1 py-2.5 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4a7f] shadow-sm">Add</button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                                    <div className="text-4xl mb-3">👈</div>
                                    <p className="text-sm font-medium text-gray-500">Select a date to view<br />or manage bookings</p>
                                </div>
                            )}

                            {/* iCal */}
                            <div className="bg-gradient-to-br from-[#0f2044] to-[#2a5298] rounded-2xl shadow-md p-5 text-white">
                                <h3 className="font-bold text-base mb-1.5">📲 Sync Your Calendar</h3>
                                <p className="text-blue-200 text-sm mb-4">See bookings in your iPhone or Google Calendar automatically.</p>
                                {icalKey ? (
                                    <>
                                        <div className="bg-white/10 p-3 rounded-xl text-xs break-all font-mono text-blue-100 mb-2">{icalKey}</div>
                                        <p className="text-xs text-blue-300">Paste into "Subscribe to Calendar" in Google or Apple iOS.</p>
                                    </>
                                ) : (
                                    <button onClick={handleGenerateIcal} className="w-full bg-white text-[#1a365d] font-bold py-2.5 px-4 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-sm">Generate iCal Link</button>
                                )}
                            </div>

                            {/* Integrations */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <h3 className="font-bold text-gray-800 mb-1">🔗 Connect Your System</h3>
                                <p className="text-sm text-gray-500 mb-4">Already using booking software? Connect it here.</p>
                                <div className="space-y-2">
                                    <button onClick={() => setShowIntegrationModal('fareharbor')} className="w-full flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">🎡</div>
                                            <span className="font-semibold text-gray-700 text-sm">FareHarbor</span>
                                        </div>
                                        <span className="text-blue-600 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">Connect →</span>
                                    </button>
                                    <button onClick={() => setShowIntegrationModal('zapier')} className="w-full flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">⚡</div>
                                            <span className="font-semibold text-gray-700 text-sm">Zapier Webhooks</span>
                                        </div>
                                        <span className="text-blue-600 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">Connect →</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ SETTINGS TAB ══ */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl space-y-6">

                        {/* ── Business Profile ── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Business profile</h2>
                                    <p className="text-sm text-gray-500 mt-1">Link your listing to sync live availability with the Aruba Travel Buddy app.</p>
                                </div>
                                {entityProfile && (
                                    <span className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Connected
                                    </span>
                                )}
                            </div>

                            {entityProfile ? (
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="w-11 h-11 rounded-xl bg-white border border-green-200 flex items-center justify-center text-2xl shadow-sm">
                                            {ENTITY_TYPE_EMOJI[entityProfile.entity_type] || '🏢'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-gray-900">{entityProfile.entity_name}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 capitalize font-mono truncate">
                                                {entityProfile.entity_type} · {entityProfile.entity_id}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleDisconnectProfile}
                                            className="shrink-0 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                    {supabaseSyncLabel && (
                                        <p className="text-xs text-gray-400 text-center">{supabaseSyncLabel}</p>
                                    )}
                                    <p className="text-xs text-gray-400">
                                        Customers booking this {ENTITY_TYPE_LABELS[entityProfile.entity_type]?.toLowerCase() || entityProfile.entity_type} in the app will see your schedule settings, blocked dates, and live capacity.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => loadFromSupabase(entityProfile)}
                                        disabled={isSupabaseSyncing}
                                        className="text-xs font-semibold text-blue-600 hover:underline disabled:opacity-50"
                                    >
                                        {isSupabaseSyncing ? 'Refreshing…' : '↻ Refresh from Supabase'}
                                    </button>
                                </div>
                            ) : (
                                <div className="p-6 space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-1">Business type</label>
                                            <select
                                                value={draftProfile.entity_type}
                                                onChange={e => setDraftProfile({ ...draftProfile, entity_type: e.target.value })}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                            >
                                                <option value="restaurant">Restaurant</option>
                                                <option value="tour">Tour</option>
                                                <option value="experience">Local Experience</option>
                                                <option value="transportation">Transportation</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-1">
                                                Entity ID <span className="text-gray-400 font-normal">(UUID from admin)</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 3f2c1a90-…"
                                                value={draftProfile.entity_id}
                                                onChange={e => setDraftProfile({ ...draftProfile, entity_id: e.target.value })}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                                        Find your entity ID in the <strong>Admin panel → {ENTITY_TYPE_LABELS[draftProfile.entity_type] || draftProfile.entity_type}s</strong> listing page.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleConnectProfile}
                                        disabled={!draftProfile.entity_id.trim()}
                                        className="px-5 py-2.5 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4a7f] disabled:opacity-40 shadow-sm transition-colors"
                                    >
                                        Connect business
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ── Schedule & Capacity ── */}
                        <form onSubmit={handleSaveSchedule} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Schedule & capacity</h2>
                                <p className="text-sm text-gray-500 mt-1">Controls how available time slots are shown to customers and staff.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Hours */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-1">Opening time</label>
                                        <input type="time" value={draftSchedule.openTime} onChange={e => setDraftSchedule({ ...draftSchedule, openTime: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-1">Closing time</label>
                                        <input type="time" value={draftSchedule.closeTime} onChange={e => setDraftSchedule({ ...draftSchedule, closeTime: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                    </div>
                                </div>

                                {/* Interval */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Slot interval</label>
                                    <p className="text-xs text-gray-500 mb-2">Length of each bookable time block (e.g. 30 min for quick turns, 60 min for seatings).</p>
                                    <select value={draftSchedule.intervalMinutes} onChange={e => setDraftSchedule({ ...draftSchedule, intervalMinutes: Number(e.target.value) })} className="w-full max-w-xs border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 bg-gray-50">
                                        {INTERVAL_OPTIONS.map(m => <option key={m} value={m}>{m} minutes</option>)}
                                    </select>
                                </div>

                                {/* Max guests */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Max guests per slot</label>
                                    <p className="text-xs text-gray-500 mb-2">Booking is blocked when this many guests are already in a slot.</p>
                                    <input type="number" min="1" max="500" value={draftSchedule.maxGuestsPerSlot} onChange={e => setDraftSchedule({ ...draftSchedule, maxGuestsPerSlot: parseInt(e.target.value) || 1 })} className="w-full max-w-xs border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                </div>

                                {/* Slot padding */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Turnaround / buffer (minutes)</label>
                                    <p className="text-xs text-gray-500 mb-2">Gap between the end of one slot and the start of the next. Useful for cleanup time.</p>
                                    <select value={draftSchedule.slotPadding} onChange={e => setDraftSchedule({ ...draftSchedule, slotPadding: Number(e.target.value) })} className="w-full max-w-xs border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 bg-gray-50">
                                        {[0, 5, 10, 15, 20, 30].map(m => <option key={m} value={m}>{m === 0 ? 'No buffer' : `${m} minutes`}</option>)}
                                    </select>
                                </div>

                                {/* Preview */}
                                <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                                    <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wide">Slot preview</p>
                                    <p className="text-sm text-blue-700">
                                        {(() => {
                                            const slots = generateSlots(normalizeSchedule(draftSchedule));
                                            if (slots.length === 0) return 'No slots — check your open/close times.';
                                            const shown = slots.slice(0, 5).map(fmt12).join(', ');
                                            return `${shown}${slots.length > 5 ? ` … (+${slots.length - 5} more)` : ''} · ${slots.length} total slots`;
                                        })()}
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                                {scheduleSaved && <span className="text-sm font-semibold text-green-700">✓ Settings saved</span>}
                                <button type="submit" className="ml-auto px-6 py-2.5 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4a7f] shadow-sm transition-colors">
                                    Save settings
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="pb-10" />
            </div>

            {/* ══ BOOKING DETAIL MODAL ══ */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Modal header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{selectedBooking.customer_name}</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Booking #{selectedBooking.id}</p>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">✕</button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${SS[selectedBooking.status].pill}`}>
                                    <span className={`w-2 h-2 rounded-full ${SS[selectedBooking.status].dot}`} />
                                    {SS[selectedBooking.status].label}
                                </span>
                                {selectedBooking.is_manual && <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded-full">Walk-in</span>}
                                {!selectedBooking.is_manual && <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full">Online</span>}
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <div className="text-xs text-gray-500 font-medium mb-0.5">Date</div>
                                    <div className="text-sm font-semibold text-gray-900">{fmtDateLong(selectedBooking.date)}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <div className="text-xs text-gray-500 font-medium mb-0.5">Time</div>
                                    <div className="text-sm font-semibold text-gray-900">{fmt12(selectedBooking.time)}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <div className="text-xs text-gray-500 font-medium mb-0.5">Party size</div>
                                    <div className="text-sm font-semibold text-gray-900">{selectedBooking.party_size} guest{selectedBooking.party_size !== 1 ? 's' : ''}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <div className="text-xs text-gray-500 font-medium mb-0.5">Booked</div>
                                    <div className="text-sm font-semibold text-gray-900">{new Date(selectedBooking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="space-y-2">
                                {selectedBooking.customer_email && (
                                    <a href={`mailto:${selectedBooking.customer_email}`} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100">✉</div>
                                        <div>
                                            <div className="text-xs text-gray-500">Email</div>
                                            <div className="text-sm font-semibold text-gray-900">{selectedBooking.customer_email}</div>
                                        </div>
                                    </a>
                                )}
                                {selectedBooking.customer_phone && (
                                    <a href={`tel:${selectedBooking.customer_phone}`} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100">📞</div>
                                        <div>
                                            <div className="text-xs text-gray-500">Phone</div>
                                            <div className="text-sm font-semibold text-gray-900">{selectedBooking.customer_phone}</div>
                                        </div>
                                    </a>
                                )}
                            </div>

                            {/* Notes */}
                            {selectedBooking.notes && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                    <div className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wide">Special Requests</div>
                                    <p className="text-sm text-amber-900">{selectedBooking.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                                {selectedBooking.status === 'pending' && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                                        className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                        ✓ Confirm booking
                                    </button>
                                )}
                                {selectedBooking.status === 'confirmed' && selectedBooking.date < today && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedBooking.id, 'no-show')}
                                        className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm"
                                    >
                                        Mark no-show
                                    </button>
                                )}
                                <button
                                    onClick={() => handleCancelBooking(selectedBooking.id)}
                                    className={`${selectedBooking.status === 'pending' ? '' : 'flex-1'} py-2.5 px-4 bg-white text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors`}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ══ INTEGRATION MODALS ══ */}
            {showIntegrationModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${showIntegrationModal === 'fareharbor' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                                    {showIntegrationModal === 'fareharbor' ? '🎡' : '⚡'}
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">{showIntegrationModal === 'fareharbor' ? 'Connect FareHarbor' : 'Connect Zapier'}</h2>
                            </div>
                            <button onClick={() => setShowIntegrationModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleConnectIntegration} className="p-6">
                            {showIntegrationModal === 'fareharbor' ? (
                                <>
                                    <p className="text-sm text-gray-600 mb-5 bg-blue-50 border border-blue-100 p-3 rounded-xl">Enter your FareHarbor credentials and we'll automatically sync your live inventory.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Shortname</label>
                                            <input required type="text" placeholder="e.g. arubabeachtours" value={integrationForm.shortname} onChange={e => setIntegrationForm({ ...integrationForm, shortname: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
                                            <input required type="password" placeholder="Paste your FareHarbor API key" value={integrationForm.apiKey} onChange={e => setIntegrationForm({ ...integrationForm, apiKey: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 mb-5 bg-yellow-50 border border-yellow-100 p-3 rounded-xl">We'll POST to your Zapier Webhook URL on every booking created, confirmed, or cancelled.</p>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Webhook URL</label>
                                        <input required type="url" placeholder="https://hooks.zapier.com/hooks/catch/…" value={integrationForm.webhookUrl} onChange={e => setIntegrationForm({ ...integrationForm, webhookUrl: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                    </div>
                                </>
                            )}
                            <div className="mt-6 flex gap-3">
                                <button type="button" onClick={() => setShowIntegrationModal(null)} className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold text-sm">Cancel</button>
                                <button type="submit" disabled={isSyncing} className="flex-1 bg-[#1a365d] text-white px-4 py-3 rounded-xl hover:bg-[#2a4a7f] transition-colors disabled:opacity-50 font-semibold text-sm shadow-sm flex items-center justify-center gap-2">
                                    {isSyncing ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Connecting…</>) : 'Connect'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
