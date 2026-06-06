import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Learning({ myCourses, leaderboard, myTotalXp, myRank }) {

    const handleProgress = (courseId) => {
        router.visit(route('learning.show', courseId));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        Learning Management (LMS)
                    </h2>
                    <div className="flex gap-4 items-center">
                        <div className="text-right">
                            <div className="text-xs font-bold text-gray-500 uppercase">Peringkat & XP Anda</div>
                            <div className="text-lg font-bold text-[#bbff00]">#{myRank} • {new Intl.NumberFormat('id-ID').format(myTotalXp)} XP</div>
                        </div>
                        <img src="https://ui-avatars.com/api/?name=Anda&background=random" className="w-10 h-10 rounded-full border-2 border-[#bbff00]" alt="Profile" />
                    </div>
                </div>
            }
        >
            <Head title="Learning Management" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* Course Grid (Netflix Style) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[#141733] text-lg">Modul Wajib Anda</h3>
                        <a href="#" className="text-sm font-bold text-indigo-600 hover:underline">Lihat Katalog</a>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myCourses.map((course) => (
                            <div 
                                key={course.id} 
                                onClick={() => handleProgress(course.id, course.progress)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                            >
                                <div className="h-40 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                                    <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-[#141733] uppercase">
                                        {course.category}
                                    </div>
                                    <div className="absolute bottom-3 left-3 z-20 bg-indigo-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase shadow-md">
                                        +{course.xp} XP
                                    </div>
                                    {course.progress === 100 && (
                                        <div className="absolute top-3 right-3 z-20 bg-green-500 text-white p-1 rounded-full shadow-sm">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-[#141733] mb-3 line-clamp-2">{course.title}</h4>
                                    
                                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                                        <span>Progres</span>
                                        <span className={course.progress === 100 ? 'text-green-600' : 'text-[#141733]'}>{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 relative overflow-hidden">
                                        <div 
                                            className={`h-1.5 rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-500' : 'bg-[#bbff00]'}`} 
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                    {course.progress < 100 && (
                                        <div className="text-[10px] text-gray-400 mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            Klik untuk membuka kelas
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gamification / Leaderboard */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#141733]">Leaderboard Belajar</h3>
                                <p className="text-xs text-gray-500">Peringkat bulan ini</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {leaderboard.length === 0 ? (
                                <div className="text-center text-sm text-gray-400 py-4">Belum ada data skor.</div>
                            ) : (
                                leaderboard.map((user, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                            idx === 0 ? 'bg-yellow-50 border-yellow-100 shadow-sm' : 
                                            idx === 1 ? 'bg-gray-50 border-gray-200' :
                                            idx === 2 ? 'bg-orange-50 border-orange-100' : 'bg-white border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 font-bold text-center ${
                                                idx === 0 ? 'text-yellow-600' : 
                                                idx === 1 ? 'text-gray-500' :
                                                idx === 2 ? 'text-orange-600' : 'text-gray-400'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            <img src={user.avatar} className={`w-8 h-8 rounded-full border ${
                                                idx === 0 ? 'border-yellow-200' : 
                                                idx === 1 ? 'border-gray-300' :
                                                idx === 2 ? 'border-orange-200' : 'border-gray-100'
                                            }`} />
                                            <div className="font-bold text-sm text-[#141733]">{user.name}</div>
                                        </div>
                                        <div className={`text-sm font-bold ${
                                            idx === 0 ? 'text-yellow-700' : 
                                            idx === 1 ? 'text-gray-700' :
                                            idx === 2 ? 'text-orange-700' : 'text-gray-500'
                                        }`}>
                                            {new Intl.NumberFormat('id-ID').format(user.xp)} XP
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <button className="w-full mt-6 text-sm font-bold text-indigo-600 hover:underline">Lihat Semua Peringkat</button>
                    </div>
                </div>

            </div>

        </AuthenticatedLayout>
    );
}
