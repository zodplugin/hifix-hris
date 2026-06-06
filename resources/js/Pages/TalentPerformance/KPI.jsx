import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function KPI({ reviews, currentPeriod, stats, employees }) {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const { data, setData, post, put, reset, errors, clearErrors } = useForm({
        employee_id: '',
        period: currentPeriod,
        score: '',
        feedback: '',
        status: 'pending'
    });

    const handleOpenModal = (review = null) => {
        clearErrors();
        if (review) {
            setIsEdit(true);
            setSelectedId(review.id);
            // Need the raw employee_id, but the review prop only has employee_name currently.
            // Let's modify the controller to return raw employee_id as well. Wait, we can get it from employees list matching name, or better, we must ensure backend passes employee_id.
            // Let's assume backend passes employee_id (I'll modify the controller to pass it)
            setData({
                employee_id: review.employee_id || '',
                period: review.period || currentPeriod,
                score: review.score,
                feedback: review.feedback,
                status: review.status.toLowerCase()
            });
        } else {
            setIsEdit(false);
            setSelectedId(null);
            reset();
            setData('period', currentPeriod);
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('kpi.update', selectedId), {
                onSuccess: () => setShowModal(false)
            });
        } else {
            post(route('kpi.store'), {
                onSuccess: () => setShowModal(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus evaluasi ini?')) {
            router.delete(route('kpi.destroy', id));
        }
    };

    return (
        <>
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        KPI & OKR Tracking
                    </h2>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-[#bbff00] text-[#141733] px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#a5e600] transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Buat Objective Baru
                    </button>
                </div>
            }
        >
            <Head title="KPI & OKR" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-8">
                <div className="bg-[#141733] text-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-400 mb-1">Company Average Score</p>
                        <h3 className="text-4xl font-bold text-[#bbff00]">{stats.average_score}/100</h3>
                        <p className="text-xs text-gray-400 mt-2">Periode: {currentPeriod}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-[#141733]">Top Performers ({currentPeriod})</h3>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Berdasarkan Skor Akhir</span>
                    </div>
                    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
                        {stats.top_performers.length > 0 ? stats.top_performers.map((emp, idx) => (
                            <div key={emp.id} className="flex items-center gap-3 shrink-0">
                                <div className="relative">
                                    <img src={`https://i.pravatar.cc/150?u=${emp.employee_id}`} className={`w-12 h-12 rounded-full border-2 ${idx === 0 ? 'border-[#bbff00]' : 'border-gray-200'}`} />
                                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-[#141733] text-[#bbff00]' : 'bg-gray-200 text-gray-600'}`}>{idx + 1}</div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-[#141733]">{emp.employee_name}</h4>
                                    <p className="text-xs text-gray-500">Skor: {emp.score}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500">Belum ada data Top Performer.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#141733]">Laporan Evaluasi Kinerja (KPI)</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Informasi Karyawan</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reviewer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Skor Akhir</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reviews.length > 0 ? reviews.map((rev, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={`https://i.pravatar.cc/150?u=${rev.id}`} className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-100 shadow-sm" />
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{rev.employee_name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{rev.department} &bull; {rev.job_title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-700">{rev.reviewer_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className={`inline-block px-3 py-1 rounded text-sm font-bold ${rev.score >= 80 ? 'bg-green-100 text-green-700' : (rev.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}`}>
                                            {rev.score}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${rev.status === 'Completed' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {rev.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right flex items-center justify-end gap-3">
                                        <Link href={route('feedback')} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Detail</Link>
                                        <button onClick={() => handleOpenModal(rev)} className="text-gray-500 hover:text-blue-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(rev.id)} className="text-gray-500 hover:text-red-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Tidak ada data review kinerja untuk periode ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </AuthenticatedLayout>

        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-xl text-[#141733]">{isEdit ? 'Edit KPI Review' : 'Buat Objective KPI Baru'}</h3>
                        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto no-scrollbar">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Karyawan</label>
                                <select 
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.employee_id}
                                    onChange={e => setData('employee_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Pilih Karyawan --</option>
                                    {employees?.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                                {errors.employee_id && <div className="text-red-500 text-xs mt-1">{errors.employee_id}</div>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Periode</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Contoh: Q2-2026"
                                        value={data.period}
                                        onChange={e => setData('period', e.target.value)}
                                        required
                                    />
                                    {errors.period && <div className="text-red-500 text-xs mt-1">{errors.period}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Skor Akhir (0-100)</label>
                                    <input 
                                        type="number" 
                                        min="0" max="100"
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.score}
                                        onChange={e => setData('score', e.target.value)}
                                        required
                                    />
                                    {errors.score && <div className="text-red-500 text-xs mt-1">{errors.score}</div>}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Feedback / Umpan Balik</label>
                                <textarea 
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px]"
                                    placeholder="Tuliskan evaluasi kinerja..."
                                    value={data.feedback}
                                    onChange={e => setData('feedback', e.target.value)}
                                ></textarea>
                                {errors.feedback && <div className="text-red-500 text-xs mt-1">{errors.feedback}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select 
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="flex-1 py-2.5 bg-[#141733] text-white font-bold rounded-xl hover:bg-[#1f2347] shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
