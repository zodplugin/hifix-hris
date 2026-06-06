import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Overtime({ isEmployee = false, requests, counts, currentFilter, allEmployees }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        employee_id: '',
        type: 'Lembur',
        start_date: '',
        end_date: '',
        duration: '',
        reason: ''
    });

    const submitManualRequest = (e) => {
        e.preventDefault();
        post(route('overtime.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const updateStatus = (id, status) => {
        router.patch(route('overtime.status', id), { status }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        Overtime & Leave Workflow
                    </h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            + Buat Pengajuan
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Overtime & Leave" />

            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Kategori Inbox</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link 
                                    href={route('overtime', { status: 'Pending' })}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-bold text-sm transition-colors ${currentFilter === 'Pending' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Menunggu Approval</span>
                                    {counts.Pending > 0 && <span className={`px-2 py-0.5 rounded-full text-xs ${currentFilter === 'Pending' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>{counts.Pending}</span>}
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={route('overtime', { status: 'Approved' })}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-bold text-sm transition-colors ${currentFilter === 'Approved' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Disetujui</span>
                                    {counts.Approved > 0 && <span className={`px-2 py-0.5 rounded-full text-xs ${currentFilter === 'Approved' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>{counts.Approved}</span>}
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={route('overtime', { status: 'Rejected' })}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-bold text-sm transition-colors ${currentFilter === 'Rejected' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Ditolak</span>
                                    {counts.Rejected > 0 && <span className={`px-2 py-0.5 rounded-full text-xs ${currentFilter === 'Rejected' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>{counts.Rejected}</span>}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Inbox List */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="font-bold text-[#141733] text-lg">
                            {currentFilter === 'Pending' ? 'Permintaan Perlu Ditinjau' : currentFilter === 'Approved' ? 'Riwayat Disetujui' : 'Riwayat Ditolak'}
                        </h3>
                    </div>

                    {requests.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 font-medium shadow-sm">
                            Tidak ada pengajuan dalam kategori ini.
                        </div>
                    ) : (
                        requests.map((req, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow relative overflow-hidden">
                                {req.status === 'Approved' && <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>}
                                {req.status === 'Rejected' && <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>}
                                {req.status === 'Pending' && <div className="absolute top-0 right-0 w-2 h-full bg-orange-400"></div>}
                                
                                {/* Profile Info */}
                                <div className="flex items-start gap-4 md:w-1/3">
                                    <img src={req.img} alt={req.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                                    <div>
                                        <h4 className="font-bold text-[#141733] text-base">{req.name}</h4>
                                        <div className="text-xs text-gray-500 font-medium">{req.id}</div>
                                        <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            req.type === 'Lembur' ? 'bg-orange-100 text-orange-700' :
                                            req.type === 'Cuti Tahunan' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {req.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="md:w-1/3 border-l-0 md:border-l border-gray-100 pl-0 md:pl-6">
                                    <div className="mb-2">
                                        <div className="text-xs text-gray-400 font-bold uppercase mb-0.5">Waktu / Durasi</div>
                                        <div className="text-sm font-medium text-gray-900">{req.date}</div>
                                        <div className="text-sm font-bold text-indigo-600">{req.time}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 font-bold uppercase mb-0.5">Alasan / Catatan</div>
                                        <div className="text-sm text-gray-700">{req.reason}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {req.status === 'Pending' && !isEmployee && (
                                    <div className="md:w-1/3 flex items-center justify-end gap-3 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                                        <button 
                                            onClick={() => updateStatus(req.raw_id, 'Rejected')}
                                            className="flex-1 md:flex-none px-4 py-2 bg-white border-2 border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-colors"
                                        >
                                            Tolak
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(req.raw_id, 'Approved')}
                                            className="flex-1 md:flex-none px-6 py-2 bg-[#141733] text-white rounded-lg text-sm font-bold hover:bg-gray-800 shadow-sm transition-colors"
                                        >
                                            Setujui
                                        </button>
                                    </div>
                                )}
                                {(req.status !== 'Pending' || isEmployee) && (
                                    <div className="md:w-1/3 flex flex-col justify-center items-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 pr-4">
                                        <div className="text-xs text-gray-400 font-bold uppercase">Status</div>
                                        <div className={`text-lg font-black ${req.status === 'Approved' ? 'text-green-600' : req.status === 'Rejected' ? 'text-red-600' : 'text-yellow-500'}`}>
                                            {req.status === 'Approved' ? 'Disetujui' : req.status === 'Rejected' ? 'Ditolak' : 'Menunggu'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Manual Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-xl text-[#141733]">Buat Pengajuan</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={submitManualRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Karyawan</label>
                                    <select 
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.employee_id}
                                        onChange={e => setData('employee_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih Karyawan --</option>
                                        {allEmployees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tipe Pengajuan</label>
                                    <select 
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        required
                                    >
                                        <option value="Lembur">Lembur</option>
                                        <option value="Cuti Tahunan">Cuti Tahunan</option>
                                        <option value="Izin Sakit">Izin Sakit</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Mulai</label>
                                        <input 
                                            type="date"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Selesai (Opsional)</label>
                                        <input 
                                            type="date"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Durasi</label>
                                    <input 
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Contoh: 3 Jam, 2 Hari"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Alasan</label>
                                    <textarea 
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        rows="3"
                                        value={data.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
