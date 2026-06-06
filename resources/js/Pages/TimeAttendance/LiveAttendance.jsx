import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Haversine formula to calculate distance in meters
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

export default function LiveAttendance({ isEmployee = false, myAttendanceToday, allAttendancesToday, settings, stats }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Geofencing states from settings
    const officeLocation = {
        lat: parseFloat(settings?.office_lat || -6.200000),
        lng: parseFloat(settings?.office_lng || 106.816666)
    };
    const radius = parseInt(settings?.office_radius || 100);

    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [isWithinRadius, setIsWithinRadius] = useState(false);
    const [locationError, setLocationError] = useState('');

    const [showWebcam, setShowWebcam] = useState(false);
    const [actionType, setActionType] = useState(null); // 'in' or 'out'
    const webcamRef = useRef(null);

    const captureAndSubmit = useCallback(() => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        
        if (actionType === 'in') {
            router.post(route('clock-in'), {
                photo: imageSrc,
                lat: userLocation.lat,
                lng: userLocation.lng
            }, { onSuccess: () => setShowWebcam(false) });
        } else if (actionType === 'out') {
            router.post(route('clock-out'), {
                photo: imageSrc,
                lat: userLocation.lat,
                lng: userLocation.lng
            }, { onSuccess: () => setShowWebcam(false) });
        }
    }, [webcamRef, actionType, userLocation]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const currentLat = position.coords.latitude;
                    const currentLng = position.coords.longitude;
                    setUserLocation({ lat: currentLat, lng: currentLng });

                    const dist = getDistance(currentLat, currentLng, officeLocation.lat, officeLocation.lng);
                    setDistance(Math.round(dist));
                    setIsWithinRadius(dist <= radius);
                    setLocationError('');
                },
                (error) => {
                    setLocationError('Gagal mendapatkan lokasi. Izinkan akses GPS Anda.');
                    setIsWithinRadius(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLocationError('Geolocation tidak didukung di browser ini.');
        }
    }, [officeLocation.lat, officeLocation.lng, radius]);

    const handleClockIn = () => {
        if (isWithinRadius && userLocation) {
            setActionType('in');
            setShowWebcam(true);
        }
    };

    const handleClockOut = () => {
        if (isWithinRadius && userLocation) {
            setActionType('out');
            setShowWebcam(true);
        }
    };

    const timeString = currentTime.toLocaleTimeString('en-GB'); // 24-hour format
    const dateString = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        Live Attendance (Geofenced)
                    </h2>
                    <div className="flex gap-2">
                        {!isEmployee && (
                            <a href={route('live-attendance.export')} className="bg-white border border-gray-200 text-[#141733] px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export CSV
                            </a>
                        )}
                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Real-time Sync Active
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Live Attendance" />

            {!isEmployee && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-2">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Total Hari Ini</p>
                        <h3 className="text-2xl font-bold text-[#141733]">{stats?.present + stats?.late + stats?.absent || 0}</h3>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-b-4 border-b-green-500">
                        <p className="text-sm font-medium text-gray-500">Hadir (Tepat Waktu)</p>
                        <h3 className="text-2xl font-bold text-green-600">{stats?.present || 0}</h3>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-b-4 border-b-yellow-500">
                        <p className="text-sm font-medium text-gray-500">Terlambat</p>
                        <h3 className="text-2xl font-bold text-yellow-600">{stats?.late || 0}</h3>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-b-4 border-b-red-500">
                        <p className="text-sm font-medium text-gray-500">Absen</p>
                        <h3 className="text-2xl font-bold text-red-600">{stats?.absent || 0}</h3>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 h-auto">
                {/* Clock In Widget & Map */}
                <div className={`w-full ${!isEmployee ? 'lg:w-1/3' : 'max-w-2xl mx-auto'} flex flex-col gap-6`}>
                    {/* Clock In Widget (Light Mode) */}
                    <div className="bg-white text-[#141733] rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">

                        <h4 className="text-gray-500 font-bold mb-2 z-10 text-lg md:text-xl">{dateString}</h4>
                        <div className="text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-black text-[#141733] tabular-nums tracking-tighter mb-8 z-10 drop-shadow-md py-4">
                            {timeString}
                        </div>

                        {/* Geofence Status */}
                        <div className="mb-8 z-10 w-full px-2">
                            {locationError ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <span className="text-red-600 font-bold text-sm">{locationError}</span>
                                </div>
                            ) : distance !== null ? (
                                <div className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors ${isWithinRadius ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                    {isWithinRadius ? (
                                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                    <span className="font-bold text-lg leading-tight">
                                        {isWithinRadius ? 'Di Dalam Area Kantor' : 'Di Luar Area Kantor'}
                                    </span>
                                    <span className="text-sm font-medium opacity-80 bg-white/50 px-2 py-0.5 rounded">Jarak Anda: {distance} meter</span>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                                    <svg className="w-6 h-6 text-[#141733] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    <span className="text-gray-600 font-medium text-sm">Mendeteksi koordinat GPS...</span>
                                </div>
                            )}
                        </div>

                        <div className="w-full flex gap-3 z-10 px-2">
                            {!myAttendanceToday?.clock_in ? (
                                <button
                                    onClick={handleClockIn}
                                    disabled={!isWithinRadius}
                                    className={`flex-1 py-4 rounded-xl font-bold text-xl transition-all ${isWithinRadius ? 'bg-[#bbff00] text-[#141733] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                                    CLOCK IN
                                </button>
                            ) : (
                                <div className="flex-1 shadow-sm rounded-xl overflow-hidden border border-gray-100">
                                    <div className="bg-gray-50 text-gray-600 py-3 text-sm font-medium border-b border-gray-100">
                                        Clocked In at: <span className="text-green-600 font-bold ml-1 text-base">{myAttendanceToday.clock_in}</span>
                                    </div>
                                    <button
                                        onClick={handleClockOut}
                                        disabled={!!myAttendanceToday?.clock_out || !isWithinRadius}
                                        className={`w-full py-4 font-bold text-xl transition-colors ${myAttendanceToday.clock_out ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : (isWithinRadius ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed')}`}>
                                        {myAttendanceToday.clock_out ? `Clocked Out: ${myAttendanceToday.clock_out}` : 'CLOCK OUT'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map Widget */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 min-h-[300px] overflow-hidden relative">
                        <MapContainer center={officeLocation} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%', minHeight: '300px' }}>
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            {/* Office Geofence Circle */}
                            <Circle center={officeLocation} pathOptions={{ fillColor: '#bbff00', color: '#141733' }} radius={radius}>
                                <Popup>Area Kantor (Radius {radius}m)</Popup>
                            </Circle>
                            {/* Office Marker */}
                            <Marker position={officeLocation}>
                                <Popup>Kantor Pusat HiFix</Popup>
                            </Marker>
                            {/* User Marker */}
                            {userLocation && (
                                <Marker position={userLocation}>
                                    <Popup>Posisi Anda</Popup>
                                </Marker>
                            )}
                        </MapContainer>
                        {/* Overlay text over map */}
                        <div className="absolute bottom-4 right-4 z-[400] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-bold text-gray-600">
                            Peta Live Tracker
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                {!isEmployee && (
                    <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-[500px] lg:h-full">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-[#141733]">Log Absensi Hari Ini</h3>
                    </div>
                    <div className="overflow-y-auto no-scrollbar flex-1 p-4 space-y-4">
                        {allAttendancesToday && allAttendancesToday.length > 0 ? (
                            allAttendancesToday.map((log) => (
                                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <img src={`https://i.pravatar.cc/150?u=${log.id}`} alt={log.employee_name} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                                        <div>
                                            <h4 className="font-bold text-sm text-[#141733]">{log.employee_name}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                {log.department}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            {log.photo_in ? (
                                                <img src={log.photo_in} alt="In" className="w-8 h-8 rounded border border-gray-200 object-cover mb-1" />
                                            ) : (
                                                <div className="w-8 h-8 rounded bg-gray-100 mb-1"></div>
                                            )}
                                            <div className="text-xs text-gray-500">In</div>
                                            <div className="text-sm font-bold text-[#141733]">{log.clock_in || '-'}</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            {log.photo_out ? (
                                                <img src={log.photo_out} alt="Out" className="w-8 h-8 rounded border border-gray-200 object-cover mb-1" />
                                            ) : (
                                                <div className="w-8 h-8 rounded bg-gray-100 mb-1"></div>
                                            )}
                                            <div className="text-xs text-gray-500">Out</div>
                                            <div className="text-sm font-bold text-[#141733]">{log.clock_out || '-'}</div>
                                        </div>
                                        <div className="text-center w-16">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${log.status === 'Present' ? 'bg-green-100 text-green-700' : (log.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">
                                Belum ada data absensi hari ini.
                            </div>
                        )}
                    </div>
                </div>
                )}
            </div>

        </AuthenticatedLayout>

        {showWebcam && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col items-center">
                    <h3 className="text-xl font-bold text-[#141733] mb-4">
                        Selfie Verification ({actionType === 'in' ? 'Clock In' : 'Clock Out'})
                    </h3>
                    
                    <div className="w-full bg-gray-900 rounded-xl overflow-hidden aspect-square relative mb-6">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "user" }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-white/30 rounded-xl m-4"></div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button 
                            onClick={() => setShowWebcam(false)}
                            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors">
                            Batal
                        </button>
                        <button 
                            onClick={captureAndSubmit}
                            className="flex-1 py-3 bg-[#bbff00] text-[#141733] font-bold rounded-xl hover:bg-[#aade00] shadow-md transition-colors flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Ambil Foto
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
