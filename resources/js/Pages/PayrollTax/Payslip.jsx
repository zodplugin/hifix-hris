import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function Payslip({ payslip }) {
    const [showSignModal, setShowSignModal] = useState(false);
    const [isSavingSig, setIsSavingSig] = useState(false);
    const sigCanvas = useRef(null);

    const [canvasDims, setCanvasDims] = useState({ width: 440, height: 196 });
    const containerRef = useCallback((node) => {
        if (node !== null) {
            setCanvasDims({
                width: node.clientWidth,
                height: node.clientHeight
            });
        }
    }, []);

    const formatRp = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const handleSaveSignature = () => {
        if (sigCanvas.current.isEmpty()) {
            alert('Tanda tangan tidak boleh kosong!');
            return;
        }

        setIsSavingSig(true);
        const dataURL = sigCanvas.current.getCanvas().toDataURL('image/png');

        router.post(route('payslip.sign', payslip.id), {
            signature_base64: dataURL
        }, {
            onSuccess: () => {
                setShowSignModal(false);
                setIsSavingSig(false);
            },
            onError: () => {
                alert('Gagal menyimpan tanda tangan');
                setIsSavingSig(false);
            }
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-4">
                        <Link href={route('run-payroll')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                            Detail Payslip
                        </h2>
                    </div>
                    <button onClick={handlePrint} className="bg-[#141733] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Cetak / Download PDF
                    </button>
                </div>
            }
        >
            <Head title="Payslip" />

            <div className="max-w-4xl mx-auto my-8 print:my-0">
                {/* SLIP KERTAS */}
                <div className="bg-white p-10 md:p-14 shadow-md border border-gray-200 rounded-sm print:shadow-none print:border-none print:p-0">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-[#141733] pb-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-[#141733] tracking-tight">{payslip.company_name}</h1>
                            <p className="text-sm text-gray-500 mt-1">Gedung HiFix Tower Lt. 12<br/>Jl. Sudirman No. 45, Jakarta Selatan</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">Payslip</h2>
                            <p className="text-sm font-medium text-gray-500 mt-1">Periode: <span className="font-bold text-[#141733]">{payslip.period}</span></p>
                            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded uppercase">{payslip.status}</span>
                        </div>
                    </div>

                    {/* Employee Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 text-sm">
                                <span className="text-gray-500">Nama</span>
                                <span className="col-span-2 font-bold text-[#141733]">: {payslip.employee_name}</span>
                            </div>
                            <div className="grid grid-cols-3 text-sm">
                                <span className="text-gray-500">ID Karyawan</span>
                                <span className="col-span-2 font-medium">: {payslip.employee_code}</span>
                            </div>
                            <div className="grid grid-cols-3 text-sm">
                                <span className="text-gray-500">Tanggal Gabung</span>
                                <span className="col-span-2 font-medium">: {payslip.join_date}</span>
                            </div>
                            <div className="grid grid-cols-3 text-sm">
                                <span className="text-gray-500">Status PTKP</span>
                                <span className="col-span-2 font-medium">: {payslip.ptkp_status}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 text-sm">
                                <span className="text-gray-500">Departemen</span>
                                <span className="col-span-2 font-medium">: {payslip.department}</span>
                            </div>
                            <div className="grid grid-cols-3 text-sm">
                                <span className="text-gray-500">Jabatan</span>
                                <span className="col-span-2 font-medium">: {payslip.job_title}</span>
                            </div>
                            <div className="grid grid-cols-3 text-sm">
                                <span className="text-gray-500">Metode Bayar</span>
                                <span className="col-span-2 font-medium">: {payslip.payment_method}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div className="grid grid-cols-2 gap-12 mb-10">
                        {/* Pendapatan */}
                        <div>
                            <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4 text-[#141733]">PENDAPATAN</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700">Gaji Pokok</span>
                                    <span className="font-medium">{formatRp(payslip.basic_salary)}</span>
                                </div>
                                {payslip.allowances.map((alw, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-700">{alw.name}</span>
                                        <span className="font-medium">{formatRp(alw.amount)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-6 pt-3 border-t border-gray-300 font-bold text-[#141733]">
                                <span>Total Pendapatan (Gross)</span>
                                <span>{formatRp(parseFloat(payslip.basic_salary) + parseFloat(payslip.total_allowances))}</span>
                            </div>
                        </div>

                        {/* Potongan */}
                        <div>
                            <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4 text-red-600">POTONGAN</h3>
                            <div className="space-y-3">
                                {payslip.deductions.map((ded, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-700">{ded.name}</span>
                                        <span className="font-medium text-red-600">-{formatRp(ded.amount)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-6 pt-3 border-t border-gray-300 font-bold text-red-600">
                                <span>Total Potongan</span>
                                <span>-{formatRp(payslip.total_deductions)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Take Home Pay</h3>
                            <p className="text-xs text-gray-400">Total bersih yang ditransfer ke rekening karyawan.</p>
                        </div>
                        <div className="text-3xl font-black text-[#141733] bg-[#bbff00]/20 px-4 py-2 rounded border border-[#bbff00]/50 shadow-inner">
                            {formatRp(payslip.net_salary)}
                        </div>
                    </div>

                    {/* Action to sign payslip */}
                    {!payslip.employee_signature_url && payslip.status.toLowerCase() === 'paid' && (
                        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between print:hidden">
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm">Tanda Tangan Slip Gaji Diperlukan</h4>
                                <p className="text-xs text-yellow-600 mt-0.5">Silakan tanda tangani digital slip gaji ini sebagai konfirmasi penerimaan gaji.</p>
                            </div>
                            <button 
                                onClick={() => setShowSignModal(true)} 
                                className="bg-[#141733] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                Hubungkan Tanda Tangan
                            </button>
                        </div>
                    )}

                    {/* Footer / Signatures */}
                    <div className="mt-16 flex justify-between px-10">
                        <div className="text-center flex flex-col items-center">
                            <p className="text-sm text-gray-500 mb-2">Penerima,</p>
                            <div className="w-40 h-20 bg-white border border-gray-100 rounded flex items-center justify-center overflow-hidden mb-2">
                                {payslip.employee_signature_url ? (
                                    <img src={payslip.employee_signature_url} alt="Tanda Tangan Karyawan" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-[10px] text-gray-400">Belum Ditandatangani</span>
                                )}
                            </div>
                            <div className="w-40 border-b border-gray-400"></div>
                            <p className="text-sm font-bold text-[#141733] mt-2">{payslip.employee_name}</p>
                        </div>
                        <div className="text-center flex flex-col items-center">
                            <p className="text-sm text-gray-500 mb-2">Mengetahui, HR & Finance</p>
                            <div className="w-40 h-20 bg-white border border-gray-100 rounded flex items-center justify-center overflow-hidden mb-2">
                                {payslip.company_signature_url ? (
                                    <img src={payslip.company_signature_url} alt="Tanda Tangan Perusahaan" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-[10px] text-gray-400">Belum Ditandatangani</span>
                                )}
                            </div>
                            <div className="w-40 border-b border-gray-400"></div>
                            <p className="text-sm font-bold text-[#141733] mt-2">HR Manager</p>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center text-xs text-gray-400 italic border-t border-gray-100 pt-4">
                        Dokumen ini digenerate secara otomatis oleh HiFix HRIS. Sah tanpa tanda tangan basah jika dikirim melalui sistem resmi.
                    </div>
                </div>
            </div>

            {/* Signature Drawing Modal */}
            {showSignModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 print:hidden">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-[#141733]">Tanda Tangani Slip Gaji</h3>
                            <button onClick={() => setShowSignModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Silakan gambar tanda tangan digital Anda di area bawah ini sebagai tanda bukti penerimaan gaji periode <strong>{payslip.period}</strong>.
                            </p>
                            
                            <div ref={containerRef} className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden relative" style={{ height: '200px' }}>
                                <span className="absolute top-2 left-3 text-xs text-gray-400 font-medium">Area Tanda Tangan:</span>
                                <SignatureCanvas 
                                    ref={sigCanvas} 
                                    penColor="#141733"
                                    canvasProps={{ 
                                        width: canvasDims.width, 
                                        height: canvasDims.height, 
                                        className: 'cursor-crosshair' 
                                    }} 
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => sigCanvas.current.clear()} 
                                    className="text-sm text-red-500 font-bold hover:text-red-700"
                                >
                                    Hapus & Ulangi
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <button type="button" disabled={isSavingSig} onClick={() => setShowSignModal(false)} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">Batal</button>
                            <button 
                                onClick={handleSaveSignature} 
                                disabled={isSavingSig}
                                className="bg-[#bbff00] text-[#141733] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#a5e600] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSavingSig ? 'Menyimpan...' : 'Simpan Tanda Tangan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx global>{`
                @media print {
                    body {
                        background-color: white !important;
                    }
                    nav {
                        display: none !important;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
