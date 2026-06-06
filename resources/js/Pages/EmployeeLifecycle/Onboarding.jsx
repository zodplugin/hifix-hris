import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Onboarding({ onboardingTasks = [], allEmployees = [], stats = { active: 0, completed: 0, delayed: 0 } }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, reset, errors, clearErrors } = useForm({
        employee_id: '',
        description: ''
    });

    const handleOpenModal = () => {
        clearErrors();
        reset();
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('onboarding.store'), {
            onSuccess: () => setShowModal(false)
        });
    };

    const handleToggle = (taskId, currentStatus) => {
        router.patch(route('onboarding.toggle', taskId), {
            is_completed: !currentStatus
        }, { preserveScroll: true });
    };

    return (
        <>
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        Onboarding & Offboarding
                    </h2>
                    <button 
                        onClick={handleOpenModal}
                        className="bg-[#141733] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors hover:bg-gray-800">
                        + Buat Checklist Baru
                    </button>
                </div>
            }
        >
            <Head title="Onboarding" />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-2">Onboarding Aktif</p>
                    <h3 className="text-3xl font-bold text-[#141733]">{stats.active} <span className="text-sm font-normal text-gray-400">karyawan</span></h3>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-2">Selesai 100%</p>
                    <h3 className="text-3xl font-bold text-green-600">{stats.completed} <span className="text-sm font-normal text-gray-400">karyawan</span></h3>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-2">Tertunda / Terlambat</p>
                    <h3 className="text-3xl font-bold text-red-500">{stats.delayed} <span className="text-sm font-normal text-gray-400">task</span></h3>
                </div>
            </div>

            <h3 className="text-lg font-bold text-[#141733] mb-4">Daftar Karyawan (In Progress)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {onboardingTasks?.length > 0 ? onboardingTasks.map((emp) => (
                    <div key={emp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {emp.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#141733]">{emp.name}</h4>
                                    <p className="text-sm text-indigo-600 font-medium">{emp.role || '-'}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.progress === 100 ? 'bg-green-100 text-green-700' : 'bg-[#bbff00]/20 text-[#7aab00]'}`}>
                                {emp.progress}%
                            </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                            <div className={`h-2 rounded-full transition-all duration-500 ${emp.progress === 100 ? 'bg-green-500' : 'bg-[#bbff00]'}`} style={{ width: `${emp.progress}%` }}></div>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-3 flex-1">
                            {emp.tasks.map((task) => (
                                <label key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={task.done} 
                                        onChange={() => handleToggle(task.id, task.done)}
                                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500" 
                                    />
                                    <span className={`text-sm ${task.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{task.desc}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="col-span-1 lg:col-span-2 text-center text-gray-500 py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        Belum ada tugas onboarding yang ditambahkan.
                    </div>
                )}
            </div>

        </AuthenticatedLayout>

        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-xl text-[#141733]">Tambah Tugas Onboarding</h3>
                        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Karyawan</label>
                                <select 
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.employee_id}
                                    onChange={e => setData('employee_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Pilih Karyawan --</option>
                                    {allEmployees?.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                                {errors.employee_id && <div className="text-red-500 text-xs mt-1">{errors.employee_id}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi Tugas (Checklist)</label>
                                <input 
                                    type="text" 
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Contoh: Menyiapkan akses VPN"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                            </div>
                            
                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
                                <button type="submit" className="flex-1 py-2.5 bg-[#141733] text-white font-bold rounded-xl hover:bg-[#1f2347] shadow-lg transition-colors">Simpan Tugas</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
