import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function Recruitment({ candidatesData = [], departments = [], jobPostings = [] }) {
    const [candidates, setCandidates] = useState(candidatesData);
    const [showJobModal, setShowJobModal] = useState(false);

    // Form for new job posting
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        department_id: '',
        description: ''
    });

    // Handle Kanban Drag and Drop
    const handleDragStart = (e, candidateId) => {
        e.dataTransfer.setData('candidateId', candidateId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-gray-200/50');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-gray-200/50');
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-gray-200/50');
        
        const candidateId = e.dataTransfer.getData('candidateId');
        
        // Optimistic UI update
        const candidateToUpdate = candidates.find(c => c.id === parseInt(candidateId));
        if (candidateToUpdate && candidateToUpdate.status !== newStatus) {
            const oldStatus = candidateToUpdate.status;
            
            setCandidates(candidates.map(c => 
                c.id === parseInt(candidateId) ? { ...c, status: newStatus } : c
            ));

            // Backend update
            router.put(route('recruitment.status.update', candidateId), {
                status: newStatus
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Status pelamar diperbarui!');
                },
                onError: () => {
                    // Revert on error
                    setCandidates(candidates.map(c => 
                        c.id === parseInt(candidateId) ? { ...c, status: oldStatus } : c
                    ));
                    toast.error('Gagal memperbarui status');
                }
            });
        }
    };

    const submitJob = (e) => {
        e.preventDefault();
        post(route('recruitment.job.store'), {
            onSuccess: () => {
                setShowJobModal(false);
                reset();
                toast.success('Lowongan berhasil dibuka!');
            }
        });
    };

    // Filter candidates by column
    const getCandidatesByStatus = (status) => candidates.filter(c => c.status === status);

    const renderCard = (candidate) => (
        <div 
            key={candidate.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, candidate.id)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-[#bbff00]/50 transition-all"
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-[#141733] text-sm">{candidate.name}</h4>
                <a 
                    href={`/storage/${candidate.resume_path}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#bbff00] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Lihat CV"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </a>
            </div>
            <p className="text-xs font-medium text-indigo-600 mb-1">{candidate.job_posting?.title}</p>
            <p className="text-[10px] text-gray-500 mb-3">{candidate.email} • {candidate.phone}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(candidate.created_at).toLocaleDateString('id-ID')}</span>
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-600">{candidate.name.charAt(0)}</span>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        Recruitment (ATS)
                    </h2>
                    <div className="flex gap-3">
                        <a href={route('careers')} target="_blank" rel="noreferrer" className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-200 transition-colors">
                            Lihat Halaman Karir
                        </a>
                        <button onClick={() => setShowJobModal(true)} className="bg-[#141733] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors hover:bg-gray-800">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Buka Lowongan
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Recruitment" />
            <Toaster position="top-right" />

            {/* Active Job Postings List */}
            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm mb-6 mt-2">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-[#141733]">Daftar Lowongan Kerja Aktif</h3>
                        <p className="text-xs text-gray-500">Daftar posisi pekerjaan yang sedang dibuka untuk publik di halaman Karir.</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                        {jobPostings.filter(j => j.status === 'active').length} Posisi Aktif
                    </span>
                </div>
                
                {jobPostings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobPostings.map((job) => (
                            <div key={job.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all flex flex-col justify-between gap-3">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-bold text-[#141733] text-sm leading-snug">{job.title}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {job.status === 'active' ? 'Aktif' : 'Non-aktif'}
                                        </span>
                                    </div>
                                    <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md mt-1.5">
                                        {job.department ? job.department.name : 'Umum'}
                                    </span>
                                    {job.description && (
                                        <p className="text-xs text-gray-500 mt-2.5 line-clamp-2">{job.description}</p>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-1">
                                    <span className="text-[10px] text-gray-400 font-medium">Dibuka: {new Date(job.created_at).toLocaleDateString('id-ID')}</span>
                                    <span className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                                        {job.candidates_count || 0} Pelamar
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                        <p className="text-sm text-gray-400 font-medium">Belum ada lowongan kerja yang dibuka.</p>
                    </div>
                )}
            </div>

            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 mt-4 min-h-[calc(100vh-12rem)] items-start">
                
                {/* Column 1: Applied */}
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'applied')}
                    className="min-w-[300px] w-1/4 bg-gray-100/50 rounded-2xl p-4 flex flex-col max-h-full border border-gray-200/50 shrink-0 transition-colors"
                >
                    <div className="flex justify-between items-center mb-4 px-1 pointer-events-none">
                        <h3 className="font-bold text-[#141733]">Applied</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{getCandidatesByStatus('applied').length}</span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
                        {getCandidatesByStatus('applied').map(renderCard)}
                    </div>
                </div>

                {/* Column 2: Screening */}
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'screening')}
                    className="min-w-[300px] w-1/4 bg-gray-100/50 rounded-2xl p-4 flex flex-col max-h-full border border-gray-200/50 shrink-0 transition-colors"
                >
                    <div className="flex justify-between items-center mb-4 px-1 pointer-events-none">
                        <h3 className="font-bold text-blue-800">Screening</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{getCandidatesByStatus('screening').length}</span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
                        {getCandidatesByStatus('screening').map(renderCard)}
                    </div>
                </div>

                {/* Column 3: Interview */}
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'interview')}
                    className="min-w-[300px] w-1/4 bg-gray-100/50 rounded-2xl p-4 flex flex-col max-h-full border border-gray-200/50 shrink-0 transition-colors"
                >
                    <div className="flex justify-between items-center mb-4 px-1 pointer-events-none">
                        <h3 className="font-bold text-orange-800">Interview</h3>
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full">{getCandidatesByStatus('interview').length}</span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
                        {getCandidatesByStatus('interview').map(renderCard)}
                    </div>
                </div>

                {/* Column 4: Offered */}
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'offered')}
                    className="min-w-[300px] w-1/4 bg-[#bbff00]/10 rounded-2xl p-4 flex flex-col max-h-full border border-[#bbff00]/30 shrink-0 transition-colors"
                >
                    <div className="flex justify-between items-center mb-4 px-1 pointer-events-none">
                        <h3 className="font-bold text-[#7aab00]">Offered</h3>
                        <span className="bg-[#bbff00] text-[#141733] text-xs font-bold px-2 py-0.5 rounded-full">{getCandidatesByStatus('offered').length}</span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
                        {getCandidatesByStatus('offered').map(renderCard)}
                    </div>
                </div>
            </div>

            {/* Create Job Modal */}
            {showJobModal && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h3 className="text-lg font-bold text-[#141733]">Buka Lowongan Baru</h3>
                            <button onClick={() => setShowJobModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={submitJob} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Judul Pekerjaan</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" 
                                    placeholder="Contoh: Senior Fullstack Developer"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Departemen</label>
                                <select 
                                    required 
                                    value={data.department_id}
                                    onChange={e => setData('department_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]"
                                >
                                    <option value="">-- Pilih Departemen --</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi & Syarat</label>
                                <textarea 
                                    rows={4}
                                    required
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" 
                                    placeholder="Jelaskan secara singkat tanggung jawab dan persyaratannya..."
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-2">
                                <button type="button" onClick={() => setShowJobModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
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
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Lowongan'
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
