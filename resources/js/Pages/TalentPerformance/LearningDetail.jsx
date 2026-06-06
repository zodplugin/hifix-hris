import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';

export default function LearningDetail({ course }) {
    
    const handleComplete = () => {
        router.post(route('learning.progress'), { course_id: course.id });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('learning')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                            Kelas: {course.title}
                        </h2>
                        <div className="flex gap-2 items-center mt-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">{course.category}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs font-bold text-indigo-600">+{course.xp_reward} XP</span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Kelas: ${course.title}`} />

            <div className="max-w-4xl mx-auto mt-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Video Player Area */}
                    <div className="aspect-video bg-black relative">
                        {course.video_url ? (
                            <iframe 
                                className="w-full h-full"
                                src={course.video_url} 
                                title="Course Video Player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/50 text-sm">
                                Tidak ada video untuk kelas ini.
                            </div>
                        )}
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-[#141733] mb-4">Deskripsi Modul</h3>
                        <div className="prose max-w-none text-gray-600 mb-8">
                            <p>{course.description}</p>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-8 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-500">Status Anda</p>
                                {course.progress === 100 ? (
                                    <p className="text-green-600 font-bold flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Lulus (Selesai)
                                    </p>
                                ) : (
                                    <p className="text-yellow-600 font-bold flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Sedang Belajar
                                    </p>
                                )}
                            </div>
                            
                            {course.progress < 100 ? (
                                <button 
                                    onClick={handleComplete}
                                    className="bg-[#bbff00] text-[#141733] px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-[#a5e600] transition-colors flex items-center gap-2"
                                >
                                    Tandai Selesai & Klaim {course.xp_reward} XP
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                            ) : (
                                <button disabled className="bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-bold cursor-not-allowed">
                                    Materi Sudah Diselesaikan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
