import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useRef, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SettingsIndex({ settings }) {
    const { data, setData, processing, errors } = useForm({
        office_lat: settings?.office_lat || '-6.200000',
        office_lng: settings?.office_lng || '106.816666',
        office_radius: settings?.office_radius || '100',
        clock_in_limit: settings?.clock_in_limit || '09:00',
        company_signature_file: null,
    });

    const [sigMode, setSigMode] = useState('draw'); // 'draw' or 'upload'
    const companySigCanvas = useRef(null);
    const [settingsCanvasDims, setSettingsCanvasDims] = useState({ width: 440, height: 196 });
    const settingsContainerRef = useCallback((node) => {
        if (node !== null) {
            setSettingsCanvasDims({
                width: node.clientWidth,
                height: node.clientHeight
            });
        }
    }, []);

    const [mapCenter, setMapCenter] = useState([
        parseFloat(data.office_lat),
        parseFloat(data.office_lng)
    ]);

    const handlePreview = () => {
        setMapCenter([parseFloat(data.office_lat), parseFloat(data.office_lng)]);
    };

    const submit = (e) => {
        e.preventDefault();
        
        const payload = {
            office_lat: data.office_lat,
            office_lng: data.office_lng,
            office_radius: data.office_radius,
            clock_in_limit: data.clock_in_limit,
        };

        if (sigMode === 'draw') {
            if (companySigCanvas.current && !companySigCanvas.current.isEmpty()) {
                payload.company_signature_base64 = companySigCanvas.current.getCanvas().toDataURL('image/png');
            }
        } else {
            if (data.company_signature_file) {
                payload.company_signature_file = data.company_signature_file;
            }
        }

        router.post(route('settings.update'), payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                handlePreview();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl text-[#141733] leading-tight">Company Settings</h2>}
        >
            <Head title="Settings" />

            <div className="py-6 space-y-6">
                
                {/* Geofencing Settings */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8">
                    
                    {/* Form Section */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-[#141733]">Pengaturan Absensi & Kehadiran</h3>
                            <p className="text-sm text-gray-500">Atur titik pusat kantor, radius maksimal, serta jam kerja masuk karyawan.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Latitude</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.office_lat}
                                        onChange={e => setData('office_lat', e.target.value)}
                                        placeholder="-6.200000"
                                        required
                                    />
                                    {errors.office_lat && <p className="text-sm text-red-600 mt-1">{errors.office_lat}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Longitude</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.office_lng}
                                        onChange={e => setData('office_lng', e.target.value)}
                                        placeholder="106.816666"
                                        required
                                    />
                                    {errors.office_lng && <p className="text-sm text-red-600 mt-1">{errors.office_lng}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Radius Absensi (Meter)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.office_radius}
                                        onChange={e => setData('office_radius', e.target.value)}
                                        placeholder="100"
                                        min="10"
                                        required
                                    />
                                    {errors.office_radius && <p className="text-sm text-red-600 mt-1">{errors.office_radius}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Batas Jam Masuk</label>
                                    <input 
                                        type="time" 
                                        className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.clock_in_limit}
                                        onChange={e => setData('clock_in_limit', e.target.value)}
                                        required
                                    />
                                    {errors.clock_in_limit && <p className="text-sm text-red-600 mt-1">{errors.clock_in_limit}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tanda Tangan Resmi Perusahaan (HR Manager)</label>
                                
                                {/* Mode Selection Tabs */}
                                <div className="flex gap-2 mb-3 bg-gray-100 p-1 rounded-lg w-fit">
                                    <button 
                                        type="button" 
                                        onClick={() => setSigMode('draw')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${sigMode === 'draw' ? 'bg-[#141733] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        Gambar Langsung (Canvas)
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setSigMode('upload')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${sigMode === 'upload' ? 'bg-[#141733] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        Unggah Berkas Gambar
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-start border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                                    {/* Preview Block */}
                                    <div className="flex flex-col gap-1 shrink-0">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">TTD Aktif Sekarang</span>
                                        <div className="w-36 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                            {settings?.company_signature_url ? (
                                                <img src={settings.company_signature_url} alt="TTD Perusahaan" className="max-w-full max-h-full object-contain p-2" />
                                            ) : (
                                                <span className="text-[10px] text-gray-400">Belum Ada</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Interaction Block */}
                                    <div className="flex-1 w-full">
                                        {sigMode === 'draw' ? (
                                            <div className="w-full">
                                                <div ref={settingsContainerRef} className="border border-gray-300 rounded-lg overflow-hidden bg-white relative" style={{ height: '200px' }}>
                                                    <span className="absolute top-1 left-2 text-[9px] text-gray-400 select-none">Silakan Tanda Tangan:</span>
                                                    <SignatureCanvas 
                                                        ref={companySigCanvas} 
                                                        penColor="#141733"
                                                        canvasProps={{ 
                                                            width: settingsCanvasDims.width, 
                                                            height: settingsCanvasDims.height, 
                                                            className: 'cursor-crosshair' 
                                                        }} 
                                                    />
                                                </div>
                                                <div className="flex justify-end mt-1">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => companySigCanvas.current.clear()} 
                                                        className="text-xs text-red-500 font-bold hover:text-red-700"
                                                    >
                                                        Hapus & Ulangi
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <div className="w-full bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-center gap-1.5">
                                                    {data.company_signature_file && (
                                                        <div className="w-full h-12 flex justify-start items-center overflow-hidden border-b border-gray-100 pb-2">
                                                            <img src={URL.createObjectURL(data.company_signature_file)} alt="Preview Upload" className="max-h-full object-contain" />
                                                        </div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#141733] file:text-white hover:file:bg-gray-800 cursor-pointer"
                                                        onChange={e => setData('company_signature_file', e.target.files[0])}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-gray-400">Rekomendasi format PNG transparan landscape.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.company_signature_file && <p className="text-sm text-red-600 mt-1">{errors.company_signature_file}</p>}
                                {errors.company_signature_base64 && <p className="text-sm text-red-600 mt-1">{errors.company_signature_base64}</p>}
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={handlePreview}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Preview di Peta
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-6 py-2 bg-[#bbff00] text-[#141733] rounded-xl font-bold shadow-md hover:bg-[#aade00] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#141733]" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Pengaturan'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Map Preview Section */}
                    <div className="w-full md:w-1/2 h-[400px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative">
                        <MapContainer 
                            key={`${mapCenter[0]}-${mapCenter[1]}-${data.office_radius}`} // Force re-render when coordinates change
                            center={mapCenter} 
                            zoom={17} 
                            scrollWheelZoom={true} 
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                attribution='&copy; OpenStreetMap'
                            />
                            <Marker position={mapCenter} />
                            <Circle 
                                center={mapCenter} 
                                radius={parseInt(data.office_radius) || 100} 
                                pathOptions={{ fillColor: '#bbff00', color: '#88cc00', fillOpacity: 0.2 }}
                            />
                        </MapContainer>
                        <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-bold text-gray-600 z-[400]">
                            Live Map Preview
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
