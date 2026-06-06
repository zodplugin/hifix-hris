import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function Feedback({ 
    reviews = [], 
    competencyAverages = { leadership: 0, communication: 0, initiative: 0, teamwork: 0, technical: 0, culture: 0 }, 
    overallAverage = 0, 
    colleagues = [], 
    currentPeriod = 'Q1-2026' 
}) {
    const [showModal, setShowModal] = useState(false);

    // Form setup for peer review submission
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        period: currentPeriod,
        leadership: 3,
        communication: 3,
        initiative: 3,
        teamwork: 3,
        technical: 3,
        culture: 3,
        comments: ''
    });

    const getRadarPolygon = (averages) => {
        const l = (averages.leadership || 0) / 5;
        const c = (averages.communication || 0) / 5;
        const i = (averages.initiative || 0) / 5;
        const cu = (averages.culture || 0) / 5;
        const tw = (averages.teamwork || 0) / 5;
        const tc = (averages.technical || 0) / 5;

        // Coordinates mapping for hexagon (Center: 50%, 50%)
        const points = [
            { x: 50, y: 50 - 50 * l },
            { x: 50 + 50 * c * 0.866, y: 50 - 50 * c * 0.5 },
            { x: 50 + 50 * i * 0.866, y: 50 + 50 * i * 0.5 },
            { x: 50, y: 50 + 50 * cu },
            { x: 50 - 50 * tw * 0.866, y: 50 + 50 * tw * 0.5 },
            { x: 50 - 50 * tc * 0.866, y: 50 - 50 * tc * 0.5 },
        ];

        return `polygon(${points.map(p => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`).join(', ')})`;
    };

    const submitFeedback = (e) => {
        e.preventDefault();
        post(route('feedback.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
                toast.success('Ulasan 360 derajat berhasil disimpan!');
            },
            onError: (errs) => {
                toast.error(errs.error || 'Gagal menyimpan ulasan.');
            }
        });
    };

    const competencies = [
        { key: 'leadership', label: 'Leadership' },
        { key: 'communication', label: 'Communication' },
        { key: 'initiative', label: 'Initiative' },
        { key: 'teamwork', label: 'Teamwork' },
        { key: 'technical', label: 'Technical' },
        { key: 'culture', label: 'Culture' }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        360 Degree Feedback
                    </h2>
                    <button 
                        onClick={() => setShowModal(true)} 
                        className="bg-[#bbff00] text-[#141733] px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#a5e600] transition-colors"
                    >
                        Mulai Review Rekan Kerja
                    </button>
                </div>
            }
        >
            <Head title="360 Degree Feedback" />
            <Toaster position="top-right" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* Radar Chart Area */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                    <h3 className="font-bold text-[#141733] self-start mb-6">Peta Kompetensi Anda</h3>
                    
                    {/* Radar Chart Visual */}
                    <div className="relative w-48 h-48 mb-6 mt-4">
                        {/* Hexagons grid representing scales */}
                        <div className="absolute inset-0 border border-gray-100" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                        <div className="absolute inset-4 border border-gray-150" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                        <div className="absolute inset-8 border border-gray-200" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                        <div className="absolute inset-12 border border-gray-200" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                        
                        {/* Axes lines */}
                        <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-gray-200"></div>
                        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-200 transform rotate-60"></div>
                        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-200 transform -rotate-60"></div>
                        
                        {/* Dynamic Data Polygon */}
                        <div 
                            className="absolute inset-0 bg-[#bbff00]/40 border border-[#92cc00] transition-all duration-500 hover:bg-[#bbff00]/50" 
                            style={{ clipPath: getRadarPolygon(competencyAverages) }}
                        ></div>

                        {/* Chart Axis Labels */}
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-gray-500 bg-white px-1">Lead: {competencyAverages.leadership}</span>
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-gray-500 bg-white px-1">Culture: {competencyAverages.culture}</span>
                        <span className="absolute top-1/4 -right-16 text-[9px] font-bold text-gray-500 bg-white px-1">Comm: {competencyAverages.communication}</span>
                        <span className="absolute bottom-1/4 -right-8 text-[9px] font-bold text-gray-500 bg-white px-1">Init: {competencyAverages.initiative}</span>
                        <span className="absolute top-1/4 -left-8 text-[9px] font-bold text-gray-500 bg-white px-1">Tech: {competencyAverages.technical}</span>
                        <span className="absolute bottom-1/4 -left-12 text-[9px] font-bold text-gray-500 bg-white px-1">Team: {competencyAverages.teamwork}</span>
                    </div>

                    <div className="w-full text-center mt-auto pt-6 border-t border-gray-50">
                        <div className="text-3xl font-black text-[#141733]">{overallAverage > 0 ? overallAverage : '0.0'} <span className="text-sm font-normal text-gray-400">/ 5.0</span></div>
                        <p className="text-xs text-gray-500 mt-1">Skor Rata-Rata Komulatif ({currentPeriod})</p>
                    </div>
                </div>

                {/* Feedback Inbox */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Active Period Card */}
                    <div className="bg-[#141733] text-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-lg text-[#bbff00] mb-1">Evaluasi Kinerja Rekan Sejawat ({currentPeriod})</h3>
                            <p className="text-sm text-gray-300">Bagikan penilaian yang membangun secara rahasia kepada rekan kerja Anda.</p>
                        </div>
                        <button 
                            onClick={() => setShowModal(true)} 
                            className="bg-white text-[#141733] px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap hover:bg-[#bbff00] transition-colors"
                        >
                            Berikan Ulasan
                        </button>
                    </div>

                    {/* Feedback List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-[#141733]">Ulasan yang Diterima</h3>
                            <span className="text-xs text-gray-400 font-medium">Ditampilkan secara anonim demi privasi</span>
                        </div>
                        <div className="p-5 space-y-4">
                            
                            {reviews.length > 0 ? reviews.map((rev) => (
                                <div key={rev.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative">
                                    <div className={`absolute top-4 right-4 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${rev.score >= 80 ? 'bg-green-100 text-green-700' : (rev.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}`}>
                                        Skor KPI: {rev.score}
                                    </div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden border border-gray-100">
                                            <span className="font-bold text-xs text-gray-600">{rev.reviewer_name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-[#141733]">{rev.reviewer_name}</div>
                                            <div className="text-[10px] text-gray-400">{rev.created_at}</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 italic leading-relaxed">"{rev.comments || 'Tidak ada catatan tertulis.'}"</p>
                                </div>
                            )) : (
                                <div className="text-center text-gray-500 text-sm py-8">Belum ada evaluasi atau feedback yang dikirimkan kepada Anda periode ini.</div>
                            )}

                        </div>
                    </div>
                </div>

            </div>

            {/* Peer Review Form Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl shrink-0">
                            <h3 className="text-lg font-bold text-[#141733]">Berikan Ulasan Rekan Kerja</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={submitFeedback} className="overflow-y-auto p-6 space-y-5 flex-1 no-scrollbar">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Rekan Kerja (Colleague)</label>
                                <select 
                                    required 
                                    value={data.employee_id}
                                    onChange={e => setData('employee_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00] text-sm"
                                >
                                    <option value="">-- Pilih Rekan Kerja --</option>
                                    {colleagues.map(col => (
                                        <option key={col.id} value={col.id}>{col.name}</option>
                                    ))}
                                </select>
                                {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <h4 className="font-bold text-sm text-[#141733] mb-3">Nilai Kompetensi Rekan (Skala 1 - 5)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {competencies.map((comp) => (
                                        <div key={comp.key} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-700">{comp.label}</label>
                                                <span className="text-xs font-bold text-[#141733] bg-[#bbff00]/40 px-2 py-0.5 rounded">{data[comp.key]} / 5</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="1" 
                                                max="5" 
                                                step="1"
                                                value={data[comp.key]}
                                                onChange={e => setData(comp.key, parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#141733]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Ulasan Tertulis / Masukan Konstruktif</label>
                                <textarea 
                                    rows={3}
                                    value={data.comments}
                                    onChange={e => setData('comments', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00] text-sm" 
                                    placeholder="Tuliskan masukan yang membangun mengenai performa kerja rekan Anda..."
                                />
                                {errors.comments && <p className="text-red-500 text-xs mt-1">{errors.comments}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="bg-[#141733] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Mengirim...
                                        </>
                                    ) : (
                                        'Kirim Ulasan'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
