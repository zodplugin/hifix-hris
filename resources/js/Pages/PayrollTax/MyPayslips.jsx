import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyPayslips({ payrolls = [] }) {
    const formatRp = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        My Payslips
                    </h2>
                    <p className="text-sm text-gray-500">Lihat riwayat penggajian Anda</p>
                </div>
            }
        >
            <Head title="My Payslips" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-[#141733] text-white">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Periode</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Gaji Bersih</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payrolls.length > 0 ? payrolls.map((p, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.period}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-700">{formatRp(p.net_salary)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${p.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link href={route('payslip', { id: p.id })} className="text-xs bg-[#bbff00] text-[#141733] px-4 py-2 rounded-lg hover:bg-[#a5e600] transition-colors font-bold shadow-sm">
                                            View Slip
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Belum ada riwayat penggajian.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
