import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ 
    isEmployee = false,
    isManager = false,
    totalEmployees = 0, 
    departmentStats = [], 
    totalPresentToday = 0, 
    totalPendingLeave = 0, 
    latestRequests = [],
    myAttendances = [],
    myPendingLeave = 0,
    myApprovedLeave = 0,
    myTodayShift = null,
    teamPendingLeave = 0,
    teamPresentToday = 0,
    latestTeamRequests = []
}) {
    if (isEmployee) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                                My Dashboard
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Selamat datang di portal Karyawan Anda.</p>
                        </div>
                    </div>
                }
            >
                <Head title="My Dashboard" />

                <div className="space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Jadwal Hari Ini</p>
                                <h3 className="text-xl font-bold text-[#141733]">{myTodayShift ? `${myTodayShift.shift_type} (${myTodayShift.start_time} - ${myTodayShift.end_time})` : 'Libur'}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Cuti Disetujui</p>
                                <h3 className="text-3xl font-bold text-green-600">{myApprovedLeave}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Cuti Pending</p>
                                <h3 className="text-3xl font-bold text-yellow-600">{myPendingLeave}</h3>
                            </div>
                        </div>
                    </div>

                    {isManager && (
                        <div className="bg-[#141733] rounded-2xl p-6 shadow-sm border border-gray-100 text-white mt-8">
                            <h3 className="text-xl font-bold mb-6 text-[#bbff00]">Team Overview (My Department)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-sm font-medium text-gray-300 mb-1">Tim Hadir Hari Ini</p>
                                    <h3 className="text-3xl font-bold">{teamPresentToday}</h3>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-sm font-medium text-gray-300 mb-1">Cuti Tim (Pending Approval)</p>
                                    <h3 className="text-3xl font-bold">{teamPendingLeave}</h3>
                                </div>
                            </div>

                            <h4 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Latest Team Requests</h4>
                            <div className="space-y-3">
                                {latestTeamRequests.length === 0 ? (
                                    <p className="text-gray-400 text-sm">Tidak ada request terbaru dari tim.</p>
                                ) : (
                                    latestTeamRequests.map(req => (
                                        <div key={req.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#bbff00] text-[#141733] flex items-center justify-center font-bold text-xs">
                                                    {req.initials}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{req.employee_name}</p>
                                                    <p className="text-xs text-gray-400">{req.type} ({req.duration} hari)</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-yellow-400">{req.status}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Attendances List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#141733] mb-6">Riwayat Kehadiran Terakhir</h3>
                        <div className="space-y-4">
                            {myAttendances.length === 0 ? (
                                <p className="text-gray-500 text-sm">Belum ada riwayat kehadiran.</p>
                            ) : (
                                myAttendances.map(att => (
                                    <div key={att.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-bold text-gray-900">{att.date}</p>
                                            <p className="text-xs text-gray-500">In: {att.check_in_time} | Out: {att.check_out_time || '-'}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${att.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {att.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                            Hifix HRIS Dashboard
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Selamat datang kembali! Berikut adalah ringkasan hari ini.</p>
                    </div>
                    <div className="flex gap-3">
                        <a href={route('core-hr.export')} className="bg-white border border-gray-200 text-[#141733] px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors inline-block text-center">
                            Lihat Laporan
                        </a>
                        <a href={route('core-hr') + "?create=true"} className="bg-[#bbff00] text-[#141733] px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#a5e600] transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Karyawan Baru
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Karyawan</p>
                            <h3 className="text-3xl font-bold text-[#141733]">{totalEmployees}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Hadir Hari Ini</p>
                            <h3 className="text-3xl font-bold text-[#141733]">{totalPresentToday}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#bbff00]/20 flex items-center justify-center text-[#92cc00]">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Cuti / Izin</p>
                            <h3 className="text-3xl font-bold text-[#141733]">{totalPendingLeave}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>

                    <div className="bg-[#141733] rounded-2xl p-6 shadow-md border border-gray-900 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/70 mb-1">Payroll Bulan Ini</p>
                            <h3 className="text-3xl font-bold text-[#bbff00]">Menunggu</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Modules Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Time & Attendance */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-[#141733]">Time & Attendance (Today)</h3>
                            <button className="text-sm font-bold text-[#141733] hover:text-[#bbff00]">Lihat Semua</button>
                        </div>
                        <div className="space-y-4">
                            {latestRequests.length === 0 ? (
                                <div className="text-center text-sm text-gray-500 py-4">Belum ada pengajuan.</div>
                            ) : (
                                latestRequests.map((req, idx) => {
                                    const colors = ['indigo', 'pink', 'green', 'yellow', 'purple'];
                                    const color = colors[idx % colors.length];
                                    const statusColors = {
                                        Pending: 'bg-yellow-100 text-yellow-800',
                                        Approved: 'bg-green-100 text-green-800',
                                        Rejected: 'bg-red-100 text-red-800',
                                    };
                                    
                                    return (
                                        <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600`}>
                                                    <span className="font-bold text-sm">{req.initials}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{req.employee_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {req.type} ({req.duration} {req.type === 'Overtime' ? 'Jam' : 'Hari'})
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[req.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Talent & Performance */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-[#141733]">Talent & Performance (Q2)</h3>
                            <button className="text-sm font-bold text-[#141733] hover:text-[#bbff00]">Detail KPI</button>
                        </div>
                        <div className="space-y-6">
                            {departmentStats.map((dept, index) => {
                                const percentage = totalEmployees > 0 ? Math.round((dept.count / totalEmployees) * 100) : 0;
                                const colors = ['bg-[#141733]', 'bg-[#bbff00]', 'bg-indigo-400', 'bg-pink-400'];
                                const colorClass = colors[index % colors.length];

                                return (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-bold text-gray-700">{dept.name}</span>
                                            <span className="font-bold text-gray-900">{dept.count} Orang ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
