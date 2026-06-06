import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Rostering({ employeesData, dates, rawDates, currentStartDate, displayDateRange }) {
    const { errors } = usePage().props;
    const [selectedCell, setSelectedCell] = useState(null);

    const shiftTypes = ['Pagi', 'Siang', 'Malam', 'Split', 'Off'];

    const getShiftStyle = (shift) => {
        switch (shift) {
            case 'Pagi': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Siang': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Malam': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Split': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Off': return 'bg-gray-100 text-gray-400 border-gray-200 border-dashed';
            default: return 'bg-gray-50';
        }
    };

    const getShiftTime = (shift) => {
        switch (shift) {
            case 'Pagi': return '07:00 - 15:00';
            case 'Siang': return '15:00 - 23:00';
            case 'Malam': return '23:00 - 07:00';
            case 'Split': return '07:00-11:00, 16:00-20:00';
            case 'Off': return 'Day Off';
            default: return '-';
        }
    };

    const navigateWeek = (direction) => {
        const currentDate = new Date(currentStartDate);
        currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        const newStartDate = currentDate.toISOString().split('T')[0];
        
        router.get(route('rostering'), { start_date: newStartDate }, { preserveScroll: true, preserveState: true });
    };

    const handleCopyPrevious = () => {
        if(confirm('Anda yakin ingin menyalin jadwal dari minggu lalu? Ini mungkin menimpa jadwal yang sudah ada pada minggu ini.')) {
            router.post(route('rostering.copy'), { start_date: currentStartDate }, { preserveScroll: true });
        }
    };

    const updateShift = (employeeId, date, shiftType) => {
        router.post(route('rostering.update'), {
            employee_id: employeeId,
            date: date,
            shift_type: shiftType
        }, {
            preserveScroll: true,
            onSuccess: () => setSelectedCell(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        Advanced Rostering
                    </h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCopyPrevious}
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                            Copy Minggu Lalu
                        </button>
                        <button className="bg-[#bbff00] text-[#141733] px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#a5e600] transition-colors">
                            Terbitkan Jadwal
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Rostering" />

            {/* Error handling if exists */}
            {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {Object.values(errors).map((err, i) => <p key={i}>{err}</p>)}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible mt-6 relative z-0">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigateWeek('prev')} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h3 className="font-bold text-[#141733]">{displayDateRange}</h3>
                        <button onClick={() => navigateWeek('next')} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex gap-2 text-xs font-bold">
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></span> Pagi</div>
                        <div className="flex items-center gap-1 ml-2"><span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></span> Siang</div>
                        <div className="flex items-center gap-1 ml-2"><span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-200"></span> Malam</div>
                    </div>
                </div>

                {/* Matrix Grid */}
                <div className="overflow-x-auto no-scrollbar pb-32">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white border-b border-gray-200">
                                <th className="p-4 w-64 border-r border-gray-100 sticky left-0 bg-white z-20 shadow-[1px_0_0_0_#f3f4f6]">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Karyawan</span>
                                </th>
                                {dates?.map((date, i) => (
                                    <th key={i} className={`p-3 text-center border-r border-gray-100 ${i >= 5 ? 'bg-red-50/30' : ''}`}>
                                        <div className="font-bold text-[#141733] whitespace-nowrap">{date}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employeesData?.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 border-r border-gray-100 sticky left-0 bg-white group-hover:bg-gray-50 z-10 shadow-[1px_0_0_0_#f3f4f6] transition-colors">
                                        <div className="font-bold text-sm text-[#141733]">{emp.name}</div>
                                        <div className="text-xs text-gray-500">{emp.role}</div>
                                    </td>
                                    {emp.shift_details.map((shiftInfo, i) => (
                                        <td key={i} className={`p-2 border-r border-gray-100 relative ${i >= 5 ? 'bg-red-50/10' : ''}`}>
                                            <div 
                                                onClick={() => setSelectedCell(selectedCell?.empId === emp.id && selectedCell?.date === shiftInfo.date ? null : { empId: emp.id, date: shiftInfo.date })}
                                                className={`p-2 rounded-lg border text-center cursor-pointer transition-transform hover:scale-105 ${getShiftStyle(shiftInfo.type)}`}
                                            >
                                                <div className="font-bold text-sm">{shiftInfo.type}</div>
                                                <div className="text-[10px] opacity-80 mt-1 hidden md:block whitespace-nowrap">{getShiftTime(shiftInfo.type)}</div>
                                            </div>

                                            {/* Dropdown Menu for changing shift */}
                                            {selectedCell?.empId === emp.id && selectedCell?.date === shiftInfo.date && (
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[60]">
                                                    {shiftTypes.map(type => (
                                                        <button 
                                                            key={type}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent toggling selected cell
                                                                updateShift(emp.id, shiftInfo.date, type);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${shiftInfo.type === type ? 'font-bold text-indigo-600' : 'text-gray-700'}`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
