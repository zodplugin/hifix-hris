import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Tax({ employees, terBrackets }) {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [bruto, setBruto] = useState(0);
    const [ptkp, setPtkp] = useState('');
    const [category, setCategory] = useState('A');
    const [terRate, setTerRate] = useState(0);

    const formatRp = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    // Determine category based on PTKP
    const determineCategory = (ptkpStatus) => {
        if (['TK/0', 'TK/1', 'K/0'].includes(ptkpStatus)) return 'A';
        if (['TK/2', 'TK/3', 'K/1', 'K/2'].includes(ptkpStatus)) return 'B';
        if (['K/3'].includes(ptkpStatus)) return 'C';
        return 'A'; // Default fallback
    };

    // Calculate TER
    useEffect(() => {
        if (selectedEmployeeId) {
            const emp = employees.find(e => e.id == selectedEmployeeId);
            if (emp) {
                setBruto(emp.basic_salary);
                setPtkp(emp.ptkp_status);
                
                const cat = determineCategory(emp.ptkp_status);
                setCategory(cat);

                // Find bracket
                const brackets = terBrackets[cat];
                const matchingBracket = brackets.find(b => emp.basic_salary > b.min && emp.basic_salary <= b.max);
                if (matchingBracket) {
                    setTerRate(matchingBracket.rate);
                } else if (emp.basic_salary === 0) {
                    setTerRate(0);
                } else {
                    // Fallback to highest if exceeds
                    setTerRate(brackets[brackets.length - 1].rate);
                }
            }
        }
    }, [selectedEmployeeId]);

    const taxAmount = bruto * (terRate / 100);
    const currentBrackets = terBrackets[category] || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        PPh 21 TER (Tarif Efektif Rata-rata)
                    </h2>
                    <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                        Unduh Rekap Laporan Pajak
                    </button>
                </div>
            }
        >
            <Head title="PPh 21 TER" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* Calculator Column */}
                <div className="lg:col-span-1">
                    <div className="bg-[#141733] rounded-t-2xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-1">Kalkulator Pajak Karyawan</h3>
                        <p className="text-xs text-gray-400">Sesuai Peraturan Pemerintah No. 58 Tahun 2023</p>
                    </div>
                    <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pilih Karyawan</label>
                            <select 
                                className="w-full border-gray-200 rounded-lg text-sm focus:ring-[#bbff00] focus:border-[#bbff00]"
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            >
                                <option value="">-- Pilih Karyawan --</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedEmployeeId && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status PTKP</label>
                                        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold px-3 py-2 text-gray-700">
                                            {ptkp}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori TER</label>
                                        <div className="w-full bg-indigo-50 border border-indigo-200 rounded-lg text-sm font-black px-3 py-2 text-indigo-700 text-center">
                                            Kategori {category}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Penghasilan Bruto (Sebulan)</label>
                                    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold px-3 py-2 text-gray-700">
                                        {formatRp(bruto)}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-500">Tarif TER Ditemukan:</span>
                                        <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{terRate}%</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                        <div className="text-xs text-gray-500 font-bold uppercase mb-1">Estimasi Potongan PPh 21</div>
                                        <div className="text-2xl font-black text-red-600">{formatRp(taxAmount)}</div>
                                    </div>
                                </div>
                            </>
                        )}
                        {!selectedEmployeeId && (
                            <div className="py-8 text-center text-gray-400 text-sm font-medium">
                                Silakan pilih karyawan untuk melihat simulasi pajak PPh 21 TER.
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-[#141733] text-lg">Tabel TER Kategori {category}</h3>
                                <p className="text-xs text-gray-500">Penghitungan PPh 21 Berdasarkan PP No. 58/2023</p>
                            </div>
                            <span className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-xl text-xs font-black shadow-sm">
                                Berlaku untuk: 
                                {category === 'A' ? ' TK/0, TK/1, K/0' : 
                                 category === 'B' ? ' TK/2, TK/3, K/1, K/2' : 
                                 ' K/3'}
                            </span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto no-scrollbar max-h-[600px] p-4">
                            <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden border border-gray-100">
                                <thead>
                                    <tr className="bg-[#141733] text-white">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Lapisan Penghasilan Bruto (Rp)</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Tarif Efektif</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {currentBrackets.map((bracket, idx) => {
                                        const isMatched = selectedEmployeeId && bruto > bracket.min && bruto <= bracket.max;
                                        
                                        return (
                                            <tr key={idx} className={`transition-colors ${isMatched ? 'bg-[#bbff00]/20 border-l-4 border-[#bbff00] scale-[1.01] shadow-sm font-bold relative z-10' : 'hover:bg-gray-50'}`}>
                                                <td className={`px-6 py-3.5 ${isMatched ? 'text-[#141733]' : 'text-gray-600'}`}>
                                                    {bracket.min === 0 
                                                        ? `Sampai dengan ${formatRp(bracket.max).replace('Rp', '')}`
                                                        : bracket.max === 999999999 
                                                            ? `> ${formatRp(bracket.min).replace('Rp', '')}`
                                                            : `> ${formatRp(bracket.min).replace('Rp', '')} s.d ${formatRp(bracket.max).replace('Rp', '')}`
                                                    }
                                                </td>
                                                <td className={`px-6 py-3.5 text-right font-black ${isMatched ? 'text-indigo-700 text-lg' : 'text-gray-600'}`}>
                                                    {bracket.rate}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
