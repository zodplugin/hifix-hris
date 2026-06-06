import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function Careers({ jobs = [] }) {
    const [selectedJob, setSelectedJob] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        job_posting_id: '',
        name: '',
        email: '',
        phone: '',
        resume_file: null
    });

    const handleApply = (job) => {
        setSelectedJob(job);
        setData({
            ...data,
            job_posting_id: job.id,
            name: '',
            email: '',
            phone: '',
            resume_file: null
        });
    };

    const submitApplication = (e) => {
        e.preventDefault();
        post(route('careers.apply'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Lamaran berhasil dikirim!');
                setSelectedJob(null);
                reset();
            },
            onError: () => {
                toast.error('Pastikan form terisi dengan benar (Resume PDF maksimal 5MB)');
            }
        });
    };

    return (
        <>
            <Head>
                <title>Karir - HRIS by Hifix</title>
                <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <Toaster position="top-right" />
            <div className="bg-white text-gray-900 antialiased overflow-x-hidden min-h-screen" style={{ fontFamily: "'Figtree', sans-serif" }}>
                
                {/* Header */}
                <div className="p-2 md:p-4 pb-0">
                    <header className="relative w-full rounded-[2rem] overflow-hidden min-h-[40vh] flex flex-col">
                        {/* Background Image */}
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Team" className="absolute inset-0 w-full h-full object-cover object-center" />
                        <div className="absolute inset-0 bg-[#141733]/70 mix-blend-multiply"></div>
                        <div className="bg-gradient-to-r from-[#141733]/90 to-transparent absolute top-0 right-0 bottom-0 left-0"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#141733] to-transparent opacity-90"></div>
                        
                        {/* Navigation */}
                        <nav className="relative z-20 flex justify-between items-center px-6 py-8 md:px-12 text-white">
                            <Link href="/" className="relative inline-block pb-2.5">
                                <span className="text-2xl font-black tracking-widest text-white leading-none">HRIS</span>
                                <span className="absolute bottom-0 right-0 text-[8px] font-black tracking-widest text-[#bbff00] uppercase translate-y-0.5">by Hifix</span>
                            </Link>
                            <div className="hidden md:flex gap-4">
                                <Link href="/" className="text-white hover:text-[#bbff00] px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </nav>

                        {/* Hero Content */}
                        <div className="relative z-20 flex-1 flex flex-col justify-center px-6 py-12 md:px-12 max-w-3xl">
                            <h1 className="text-4xl md:text-5xl md:leading-tight tracking-tight font-bold text-white mb-4">
                                Bergabunglah bersama <span className="text-[#bbff00]">Tim Kami</span>
                            </h1>
                            <p className="text-base md:text-lg text-white/80 max-w-xl font-light leading-relaxed">
                                Temukan peluang karir yang tepat untuk Anda dan bantu kami membangun masa depan HRIS yang lebih baik di Indonesia.
                            </p>
                        </div>
                    </header>
                </div>

                {/* Job Listings Section */}
                <section className="py-20 px-6 md:px-12 max-w-[90rem] mx-auto">
                    <div className="flex flex-col mb-12">
                        <h2 className="text-3xl font-bold text-[#141733] mb-2">Lowongan Terbuka</h2>
                        <p className="text-gray-500">Temukan peran yang sesuai dengan passion dan keahlian Anda.</p>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Saat ini belum ada lowongan terbuka. Silakan cek kembali nanti.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <div key={job.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-[#bbff00]/50 transition-all flex flex-col group">
                                    <div className="bg-[#bbff00]/10 text-[#7aab00] text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                                        {job.department?.name || 'Umum'}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#141733] mb-3 group-hover:text-[#bbff00] transition-colors">{job.title}</h3>
                                    <p className="text-sm text-gray-500 mb-8 flex-1 line-clamp-3">
                                        {job.description || "Bergabunglah dengan tim kami untuk peran ini dan bantu kami mencapai tujuan perusahaan."}
                                    </p>
                                    <button 
                                        onClick={() => handleApply(job)}
                                        className="w-full bg-[#141733] text-white px-5 py-3 rounded-full text-sm font-bold shadow-sm transition-colors hover:bg-gray-800"
                                    >
                                        Lamar Pekerjaan Ini
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>

            {/* Application Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4" style={{ fontFamily: "'Figtree', sans-serif" }}>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row relative">
                        
                        {/* Close button for Mobile (absolute top-right) */}
                        <button onClick={() => setSelectedJob(null)} className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 bg-white shadow-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* Left: Job Details */}
                        <div className="w-full md:w-1/2 p-6 md:p-10 bg-gray-50 overflow-y-auto border-r border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-[#bbff00]/20 text-[#7aab00] text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                                    {selectedJob.department?.name || 'Umum'}
                                </div>
                                <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1.5 rounded-full">Full-Time</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#141733] mb-6 leading-tight">{selectedJob.title}</h3>
                            <div className="prose prose-sm text-gray-600 max-w-none">
                                <h4 className="font-bold text-gray-900 mb-2">Deskripsi Pekerjaan</h4>
                                <p className="mb-6 whitespace-pre-wrap leading-relaxed">{selectedJob.description}</p>
                            </div>
                        </div>

                        {/* Right: Application Form */}
                        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto relative bg-white">
                            <button onClick={() => setSelectedJob(null)} className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            
                            <h4 className="text-xl font-bold text-[#141733] mb-6 mt-2">Kirim Lamaran Anda</h4>
                            <form onSubmit={submitApplication} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" 
                                        placeholder="Masukkan nama lengkap Anda"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" 
                                        placeholder="email@contoh.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nomor Telepon / WhatsApp</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" 
                                        placeholder="08123456789"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Unggah CV / Resume (PDF)</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#bbff00] transition-colors bg-gray-50">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none px-1">
                                                    <span>Pilih file PDF</span>
                                                    <input id="file-upload" name="file-upload" type="file" accept=".pdf" className="sr-only" onChange={e => setData('resume_file', e.target.files[0])} />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {data.resume_file ? <span className="font-bold text-green-600">{data.resume_file.name}</span> : 'Maksimal 5MB'}
                                            </p>
                                        </div>
                                    </div>
                                    {errors.resume_file && <p className="text-red-500 text-xs mt-1">{errors.resume_file}</p>}
                                </div>
                                
                                <div className="pt-4 flex gap-3">
                                    <button type="submit" disabled={processing} className="w-full bg-[#bbff00] text-[#141733] px-4 py-3.5 rounded-xl text-base font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50">
                                        {processing ? 'Mengirim...' : 'Kirim Lamaran Sekarang'}
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
