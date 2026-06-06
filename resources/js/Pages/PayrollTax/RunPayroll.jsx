import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function RunPayroll({ payrolls, currentPeriod, stats }) {
    const { flash, errors } = usePage().props;
    const [isProcessing, setIsProcessing] = useState(false);
    const [markingPaidId, setMarkingPaidId] = useState(null);

    const handleProcess = () => {
        setIsProcessing(true);
        router.post(route('run-payroll.process'), {}, {
            onFinish: () => setIsProcessing(false),
            onError: () => setIsProcessing(false)
        });
    };

    const handleMarkPaid = (id) => {
        setMarkingPaidId(id);
        router.patch(route('run-payroll.mark-paid', { id }), {}, {
            onFinish: () => setMarkingPaidId(null),
            onError: () => setMarkingPaidId(null)
        });
    };

    const formatRp = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        Run Payroll
                    </h2>
                    <div className="flex gap-2">
                        <a href={route('run-payroll.export', { period: currentPeriod })} className="bg-white border border-gray-200 text-[#141733] px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export CSV
                        </a>
                        <button 
                            onClick={handleProcess} 
                            disabled={isProcessing}
                            className="bg-[#bbff00] text-[#141733] px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-[#a5e600] transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#141733]" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Finalize & Generate Payroll
                                </>
                            )}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Run Payroll" />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{Object.values(errors)[0]}</span>
                </div>
            )}

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-2">
                <div className="bg-[#141733] rounded-xl p-5 shadow-sm text-white flex flex-col justify-between">
                    <p className="text-sm font-medium text-gray-400">Payroll Period</p>
                    <h3 className="text-2xl font-bold mt-2">{currentPeriod}</h3>
                    <p className="text-xs text-gray-400 mt-2">Cut-off: 25th prev month</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 col-span-1 md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Total Anggaran Gaji (Gross)</p>
                    <h3 className="text-3xl font-bold text-[#141733] mt-2">{formatRp(stats.total_gross)}</h3>
                    <div className="flex gap-4 mt-2 text-xs font-medium">
                        <span className="text-red-500">Total Potongan: {formatRp(stats.total_deductions)}</span>
                        <span className="text-gray-400">Total {stats.total_count} Karyawan</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-sm font-medium text-gray-500">Status Pembayaran</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`w-3 h-3 rounded-full ${stats.paid_count === stats.total_count && stats.total_count > 0 ? 'bg-green-500' : 'bg-yellow-400 animate-pulse'}`}></span>
                        <h3 className={`text-xl font-bold ${stats.paid_count === stats.total_count && stats.total_count > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {stats.paid_count === stats.total_count && stats.total_count > 0 ? 'All Paid' : `${stats.paid_count}/${stats.total_count} Paid`}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Payroll Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h3 className="font-bold text-[#141733] text-lg">Detail Penggajian Karyawan</h3>
                        <p className="text-xs text-gray-500 mt-1">Review dengan seksama sebelum melakukan finalisasi.</p>
                    </div>
                    <div className="relative w-72">
                        <input type="text" placeholder="Cari karyawan, ID..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-[#bbff00] focus:border-[#bbff00] shadow-sm transition-all outline-none" />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Informasi Karyawan</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Gaji Pokok</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right text-green-600">Tunjangan (+)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right text-red-500">Potongan (-)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right text-red-500">PPh 21 (-)</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#141733] uppercase tracking-wider text-right bg-[#bbff00]/10 border-l border-[#bbff00]/20">Take Home Pay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payrolls.length > 0 ? payrolls.map((emp, idx) => {
                                const bpjsKes = emp.basic_salary * 0.01;
                                const bpjsTk = emp.basic_salary * 0.03;
                                const totalBpjs = bpjsKes + bpjsTk;
                                const pph21 = emp.deductions - totalBpjs;

                                return (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={`https://i.pravatar.cc/150?u=${emp.employee_id}`} alt={emp.employee_name} className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-100 shadow-sm" />
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm">{emp.employee_name}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{emp.department} &bull; <span className="font-mono text-gray-400">{emp.employee_code}</span></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-sm text-gray-700">{formatRp(emp.basic_salary)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">{formatRp(emp.allowances)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-500">{formatRp(totalBpjs)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-500">{formatRp(pph21 > 0 ? pph21 : 0)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-base text-[#141733] bg-[#bbff00]/5 border-l border-[#bbff00]/20 flex justify-between items-center h-full">
                                            <div className="flex flex-col items-start gap-1">
                                                <span>{formatRp(emp.net_salary)}</span>
                                                {emp.status.toLowerCase() === 'paid' ? (
                                                    <span className="text-[10px] bg-green-100 border border-green-200 text-green-700 px-2 py-0.5 rounded uppercase font-bold tracking-wide">Paid</span>
                                                ) : (
                                                    <span className="text-[10px] bg-yellow-100 border border-yellow-200 text-yellow-700 px-2 py-0.5 rounded uppercase font-bold tracking-wide">Draft</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Link href={route('payslip', { id: emp.id })} className="text-xs text-center bg-[#141733] text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors shadow-sm font-medium">View Slip</Link>
                                                {emp.status.toLowerCase() !== 'paid' && (
                                                    <button 
                                                        onClick={() => handleMarkPaid(emp.id)} 
                                                        disabled={markingPaidId === emp.id}
                                                        className="text-[11px] text-center bg-[#bbff00] text-[#141733] px-3 py-1.5 rounded hover:bg-[#a5e600] transition-colors shadow-sm font-bold border border-[#a5e600] flex items-center justify-center gap-1 disabled:opacity-50"
                                                    >
                                                        {markingPaidId === emp.id ? (
                                                            <>
                                                                <svg className="animate-spin h-3 w-3 text-[#141733]" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                                ...
                                                            </>
                                                        ) : (
                                                            'Tandai Dibayar'
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Tidak ada data payroll untuk periode ini.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-gray-50/80 font-bold border-t border-gray-200">
                            <tr>
                                <td className="px-6 py-4 text-sm text-gray-500">TOTAL KESELURUHAN</td>
                                <td className="px-6 py-4 text-right text-sm text-gray-700">-</td>
                                <td className="px-6 py-4 text-right text-sm text-green-600">-</td>
                                <td colSpan="2" className="px-6 py-4 text-right text-sm text-red-500">{formatRp(stats.total_deductions)}</td>
                                <td className="px-6 py-4 text-right text-base text-[#141733] bg-[#bbff00]/20 border-l border-[#bbff00]/30 shadow-inner">{formatRp(stats.total_net)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
