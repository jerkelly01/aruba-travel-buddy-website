'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { conciergeHostsApi } from '@/lib/admin-api';

type Tab = 'info' | 'rooms' | 'integrations' | 'escalation';

export default function HostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const hostId = params.hostId as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('info');
  const [host, setHost] = useState<any>(null);
  const [info, setInfo] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [escalation, setEscalation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && hostId) fetchAll();
  }, [isAuthenticated, hostId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await conciergeHostsApi.getHost(hostId);
      if (res.success && res.data) {
        const d = res.data as any;
        setHost(d.host);
        setInfo(d.info || []);
        setRooms(d.rooms || []);
        setIntegrations(d.integrations || []);
        setEscalation(d.escalation || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  // --- Info Section Helpers ---
  const updateInfoField = (sectionId: string, field: string, value: any) => {
    setInfo(prev => prev.map(s => s.section_id === sectionId ? { ...s, [field]: value } : s));
  };
  const updateWifiField = (sectionId: string, field: string, value: string) => {
    setInfo(prev => prev.map(s => {
      if (s.section_id !== sectionId) return s;
      return { ...s, wifi_data: { ...(s.wifi_data || {}), [field]: value } };
    }));
  };
  const saveSection = async (section: any) => {
    setSaving(true);
    try {
      await conciergeHostsApi.upsertHostInfo(hostId, section);
      flash('Section saved!');
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  // --- Room Helpers ---
  const [newRoom, setNewRoom] = useState('');
  const [newRoomLabel, setNewRoomLabel] = useState('');
  const addRoom = async () => {
    if (!newRoom.trim()) return;
    setSaving(true);
    try {
      await conciergeHostsApi.createRoom(hostId, { room_number: newRoom.trim(), room_label: newRoomLabel.trim() || undefined });
      setNewRoom(''); setNewRoomLabel('');
      await fetchAll(); flash('Room added!');
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };
  const deleteRoom = async (roomId: string) => {
    if (!confirm('Delete this room?')) return;
    await conciergeHostsApi.deleteRoom(hostId, roomId);
    await fetchAll(); flash('Room deleted');
  };
  const updateGuestName = async (roomId: string, guestName: string) => {
    setSaving(true);
    try {
      await conciergeHostsApi.updateRoom(hostId, roomId, {
        current_guest_name: guestName || null,
        status: guestName ? 'occupied' : 'vacant',
        guest_check_in: guestName ? new Date().toISOString() : null,
      });
      await fetchAll(); flash('Guest updated!');
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  // --- Integration Helpers ---
  const [newIntType, setNewIntType] = useState('room_service');
  const [newIntProvider, setNewIntProvider] = useState('custom');
  const [newIntUrl, setNewIntUrl] = useState('');
  const [newIcalUrl, setNewIcalUrl] = useState('');
  const addIntegration = async () => {
    setSaving(true);
    try {
      await conciergeHostsApi.upsertIntegration(hostId, {
        integration_type: newIntType, provider_name: newIntProvider,
        webhook_url: newIntUrl || null, ical_url: newIcalUrl || null,
      });
      setNewIntUrl(''); setNewIcalUrl('');
      await fetchAll(); flash('Integration saved!');
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };
  const deleteIntegration = async (id: string) => {
    if (!confirm('Delete this integration?')) return;
    await conciergeHostsApi.deleteIntegration(hostId, id);
    await fetchAll(); flash('Integration deleted');
  };

  // --- Escalation Helpers ---
  const [newEscMethod, setNewEscMethod] = useState('whatsapp');
  const [newEscValue, setNewEscValue] = useState('');
  const [newEscLabel, setNewEscLabel] = useState('Contact Property Team');
  const addEscalation = async () => {
    if (!newEscValue.trim()) return;
    setSaving(true);
    try {
      await conciergeHostsApi.upsertEscalation(hostId, {
        method: newEscMethod, value: newEscValue.trim(), label: newEscLabel.trim(),
      });
      setNewEscValue('');
      await fetchAll(); flash('Escalation method saved!');
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };
  const deleteEscalation = async (id: string) => {
    if (!confirm('Delete this escalation method?')) return;
    await conciergeHostsApi.deleteEscalation(hostId, id);
    await fetchAll(); flash('Escalation deleted');
  };

  if (authLoading || !isAuthenticated) return null;
  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading host...</div>;
  if (!host) return <div className="flex items-center justify-center min-h-screen text-red-500">Host not found</div>;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'info', label: 'Property Info', icon: '📋' },
    { id: 'rooms', label: 'Rooms & Guests', icon: '🛏️' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'escalation', label: 'Guest Support', icon: '📞' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d3b4d] to-[#0891b2] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin/concierge" className="text-teal-200 hover:text-white text-sm mb-1 inline-block">← Back to Hosts</Link>
          <h1 className="text-2xl font-bold text-white">{host.name}</h1>
          <p className="text-teal-100 text-sm mt-1">{host.address || 'No address set'} · Setup Code: <span className="font-mono bg-white/20 px-2 py-0.5 rounded">{host.setup_code}</span></p>
        </div>
      </div>

      {/* Toast */}
      {msg && (
        <div className="fixed top-4 right-4 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition-colors ${tab === t.id ? 'bg-white text-teal-700 border border-gray-200 border-b-white -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ==================== INFO TAB ==================== */}
        {tab === 'info' && (
          <div className="space-y-4">
            {info.map(section => (
              <div key={section.section_id} className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{section.title}</h3>
                <p className="text-sm text-gray-500 mb-4">Section: {section.section_id}</p>

                {/* Tagline */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input type="text" value={section.tagline || ''} onChange={e => updateInfoField(section.section_id, 'tagline', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                </div>

                {/* Content (for welcome, generic) */}
                {['welcome', 'menu', 'checkout', 'amenities', 'trash'].includes(section.section_id) && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea value={section.content || ''} onChange={e => updateInfoField(section.section_id, 'content', e.target.value)}
                      rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                  </div>
                )}

                {/* WiFi */}
                {section.section_id === 'wifi' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Network Name</label>
                      <input type="text" value={section.wifi_data?.network || ''} onChange={e => updateWifiField(section.section_id, 'network', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="text" value={section.wifi_data?.password || ''} onChange={e => updateWifiField(section.section_id, 'password', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hint</label>
                      <input type="text" value={section.wifi_data?.hint || ''} onChange={e => updateWifiField(section.section_id, 'hint', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                    </div>
                  </div>
                )}

                {/* Rules (items) */}
                {section.section_id === 'rules' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">House Rules (one per line)</label>
                    <textarea value={(section.items || []).join('\n')} onChange={e => updateInfoField(section.section_id, 'items', e.target.value.split('\n').filter((l: string) => l.trim()))}
                      rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                      placeholder="No smoking inside the property.&#10;Quiet hours: 10 PM - 8 AM." />
                  </div>
                )}

                {/* Checkout steps */}
                {section.section_id === 'checkout' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Checkout Steps (one per line)</label>
                    <textarea value={(section.checkout_steps || []).join('\n')} onChange={e => updateInfoField(section.section_id, 'checkout_steps', e.target.value.split('\n').filter((l: string) => l.trim()))}
                      rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                  </div>
                )}

                <button onClick={() => saveSection(section)} disabled={saving}
                  className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ==================== ROOMS TAB ==================== */}
        {tab === 'rooms' && (
          <div>
            {/* Add Room */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Room</h3>
              <div className="flex gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                  <input type="text" value={newRoom} onChange={e => setNewRoom(e.target.value)} placeholder="e.g. 101"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input type="text" value={newRoomLabel} onChange={e => setNewRoomLabel(e.target.value)} placeholder="e.g. Beach Villa"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                </div>
                <button onClick={addRoom} disabled={saving || !newRoom.trim()}
                  className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                  Add Room
                </button>
              </div>
            </div>

            {/* Rooms List */}
            {rooms.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No rooms created yet. Add your first room above.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map(room => (
                  <div key={room.id} className="bg-white rounded-xl shadow p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">Room {room.room_number}</h4>
                        {room.room_label && <p className="text-sm text-gray-500">{room.room_label}</p>}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${room.status === 'occupied' ? 'bg-green-100 text-green-700' : room.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Current Guest Name</label>
                      <div className="flex gap-2">
                        <input type="text" defaultValue={room.current_guest_name || ''} id={`guest-${room.id}`}
                          placeholder="Type guest name..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-teal-500" />
                        <button onClick={() => {
                          const input = document.getElementById(`guest-${room.id}`) as HTMLInputElement;
                          updateGuestName(room.id, input?.value || '');
                        }} className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-teal-700">
                          Set
                        </button>
                      </div>
                    </div>
                    {room.tablet_device_id && <p className="text-xs text-gray-400 mb-2">📱 Tablet linked</p>}
                    <button onClick={() => deleteRoom(room.id)} className="text-red-500 text-xs hover:text-red-700">Delete Room</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== INTEGRATIONS TAB ==================== */}
        {tab === 'integrations' && (
          <div>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Add Integration</h3>
              <p className="text-sm text-gray-500 mb-4">Connect your property management system, Airbnb, Booking.com, VRBO, or any custom webhook.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newIntType} onChange={e => setNewIntType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500">
                    <option value="room_service">Room Service</option>
                    <option value="butler">Butler / Concierge Staff</option>
                    <option value="check_in">Check-In Sync</option>
                    <option value="check_out">Check-Out Sync</option>
                    <option value="ical_sync">Calendar Sync (iCal)</option>
                    <option value="pms_webhook">PMS Webhook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select value={newIntProvider} onChange={e => setNewIntProvider(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500">
                    <option value="custom">Custom Webhook</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="booking_com">Booking.com</option>
                    <option value="vrbo">VRBO</option>
                    <option value="guesty">Guesty</option>
                    <option value="hostaway">Hostaway</option>
                    <option value="oracle_opera">Oracle OPERA</option>
                    <option value="zapier">Zapier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                  <input type="text" value={newIntUrl} onChange={e => setNewIntUrl(e.target.value)} placeholder="https://your-system.com/api/webhook"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">iCal URL (for calendar sync)</label>
                  <input type="text" value={newIcalUrl} onChange={e => setNewIcalUrl(e.target.value)} placeholder="https://airbnb.com/calendar/ical/..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <button onClick={addIntegration} disabled={saving}
                className="mt-4 bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                Save Integration
              </button>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 text-sm mb-2">📖 How to Connect</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li><strong>Airbnb:</strong> Go to Calendar → Export Calendar → Copy the iCal link and paste it above.</li>
                  <li><strong>Booking.com:</strong> Property → Rates &amp; Availability → Sync Calendars → Copy iCal URL.</li>
                  <li><strong>VRBO:</strong> Calendar → Import/Export → Copy the export link.</li>
                  <li><strong>Guesty / Hostaway:</strong> Settings → Integrations → Add a Webhook → Paste our endpoint URL.</li>
                  <li><strong>Zapier:</strong> Create a Zap: &quot;When new Airbnb reservation → POST to our webhook.&quot;</li>
                </ul>
              </div>
            </div>

            {/* Existing Integrations */}
            {integrations.length > 0 && (
              <div className="space-y-3">
                {integrations.map(int => (
                  <div key={int.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900 capitalize">{int.integration_type.replace(/_/g, ' ')}</span>
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{int.provider_name}</span>
                      {int.webhook_url && <p className="text-xs text-gray-400 mt-1 font-mono truncate max-w-md">{int.webhook_url}</p>}
                      {int.ical_url && <p className="text-xs text-gray-400 mt-1 font-mono truncate max-w-md">📅 {int.ical_url}</p>}
                    </div>
                    <button onClick={() => deleteIntegration(int.id)} className="text-red-500 text-sm hover:text-red-700">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== ESCALATION TAB ==================== */}
        {tab === 'escalation' && (
          <div>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Add Support Channel</h3>
              <p className="text-sm text-gray-500 mb-4">When the AI can&apos;t handle a request, guests will be redirected to this contact method with full context pre-filled.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select value={newEscMethod} onChange={e => setNewEscMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500">
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Phone Call</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="webhook">Webhook (PMS Ticket)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newEscMethod === 'email' ? 'Email Address' : newEscMethod === 'webhook' ? 'Webhook URL' : 'Phone Number'}
                  </label>
                  <input type="text" value={newEscValue} onChange={e => setNewEscValue(e.target.value)}
                    placeholder={newEscMethod === 'email' ? 'support@hotel.com' : newEscMethod === 'webhook' ? 'https://...' : '+297 555 1234'}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
                  <input type="text" value={newEscLabel} onChange={e => setNewEscLabel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <button onClick={addEscalation} disabled={saving || !newEscValue.trim()}
                className="mt-4 bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                Add Channel
              </button>
            </div>

            {escalation.length > 0 && (
              <div className="space-y-3">
                {escalation.map(esc => (
                  <div key={esc.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                    <div>
                      <span className="text-lg mr-2">
                        {esc.method === 'whatsapp' ? '💬' : esc.method === 'phone' ? '📞' : esc.method === 'sms' ? '💬' : esc.method === 'email' ? '✉️' : '🔗'}
                      </span>
                      <span className="font-semibold text-gray-900 capitalize">{esc.method}</span>
                      <span className="ml-2 text-sm text-gray-500">{esc.value}</span>
                      <span className="ml-2 text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded">{esc.label}</span>
                    </div>
                    <button onClick={() => deleteEscalation(esc.id)} className="text-red-500 text-sm hover:text-red-700">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
