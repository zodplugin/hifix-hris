import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function CoreHR({ employeesData = [], departments = [] }) {
    const loggedInUser = usePage().props.auth.user;
    const [activeTab, setActiveTab] = useState('directory');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('create') === 'true') {
            setShowAddModal(true);
        }
    }, []);
    
    // Department Manager Edit State
    const [editingDept, setEditingDept] = useState(null);
    const [selectedManagerId, setSelectedManagerId] = useState('');

    const handleUpdateManager = (e) => {
        e.preventDefault();
        router.put(route('core-hr.department.update', editingDept.id), {
            manager_id: selectedManagerId || null
        }, {
            onSuccess: () => {
                setEditingDept(null);
                setSelectedManagerId('');
            }
        });
    };

    // Signature Modal State
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signingEmployee, setSigningEmployee] = useState(null);
    const [isSigning, setIsSigning] = useState(false);
    const sigCanvas = useRef({});
    const [contractCanvasDims, setContractCanvasDims] = useState({ width: 440, height: 196 });
    const contractContainerRef = useCallback((node) => {
        if (node !== null) {
            setContractCanvasDims({
                width: node.clientWidth,
                height: node.clientHeight
            });
        }
    }, []);

    // NDA Canvas Dims
    const [ndaCanvasDims, setNdaCanvasDims] = useState({ width: 440, height: 196 });
    const ndaContainerRef = useCallback((node) => {
        if (node !== null) {
            setNdaCanvasDims({
                width: node.clientWidth,
                height: node.clientHeight
            });
        }
    }, []);

    const openSignatureModal = (employee) => {
        setSigningEmployee(employee);
        setShowSignatureModal(true);
    };

    const handleSignContract = () => {
        if (sigCanvas.current.isEmpty()) {
            alert('Tanda tangan tidak boleh kosong!');
            return;
        }

        const dataURL = sigCanvas.current.getCanvas().toDataURL('image/png');
        
        router.post(route('core-hr.contract', signingEmployee.id), {
            signature_base64: dataURL
        }, {
            onStart: () => setIsSigning(true),
            onFinish: () => setIsSigning(false),
            onSuccess: () => {
                setShowSignatureModal(false);
                setSigningEmployee(null);
            },
            onError: (errors) => {
                alert(errors.error || 'Gagal menyimpan tanda tangan dan menghasilkan PDF kontrak.');
            }
        });
    };

    // NDA Modal State
    const [showNdaModal, setShowNdaModal] = useState(false);
    const ndaSigCanvas = useRef({});

    const openNdaModal = (employee) => {
        setSigningEmployee(employee);
        setShowNdaModal(true);
    };

    const handleSignNda = () => {
        if (ndaSigCanvas.current.isEmpty()) {
            alert('Tanda tangan tidak boleh kosong!');
            return;
        }

        const dataURL = ndaSigCanvas.current.getCanvas().toDataURL('image/png');
        
        router.post(route('core-hr.nda', signingEmployee.id), {
            signature: dataURL
        }, {
            onStart: () => setIsSigning(true),
            onFinish: () => setIsSigning(false),
            onSuccess: () => {
                setShowNdaModal(false);
                setSigningEmployee(null);
            },
            onError: (errors) => {
                alert(errors.error || 'Gagal menyimpan tanda tangan dan menghasilkan PDF NDA.');
            }
        });
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        department_id: '',
        job_title: '',
        basic_salary: '',
        salary_type: 'gross',
        employment_status: 'probation',
        ptkp_status: 'TK/0',
        join_date: new Date().toISOString().split('T')[0],
        contract_start_date: '',
        contract_end_date: '',
        is_contract_extendable: false,
        identity_number: '',
        latest_education: '',
        university_name: '',
        graduation_year: '',
        birth_date: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        ktp_file: null,
        avatar_file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingEmployee) {
            router.post(route('core-hr.update', editingEmployee.id), {
                ...data,
                _method: 'put'
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setShowAddModal(false);
                    setEditingEmployee(null);
                    reset();
                }
            });
        } else {
            post(route('core-hr.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setShowAddModal(false);
                    reset();
                }
            });
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setData({
            first_name: employee.first_name || '',
            last_name: employee.last_name || '',
            email: employee.email_raw || '',
            department_id: employee.department_id || '',
            job_title: employee.role || '',
            basic_salary: employee.basic_salary || '',
            salary_type: employee.salary_type || 'gross',
            employment_status: employee.employment_status_raw || 'probation',
            ptkp_status: employee.ptkp_status || 'TK/0',
            join_date: employee.join_date_raw || new Date().toISOString().split('T')[0],
            contract_start_date: employee.contract_start_date_raw || '',
            contract_end_date: employee.contract_end_date_raw || '',
            is_contract_extendable: employee.is_contract_extendable || false,
            identity_number: employee.identity_number_raw || '',
            latest_education: employee.latest_education_raw || '',
            university_name: employee.university_name_raw || '',
            graduation_year: employee.graduation_year_raw || '',
            birth_date: employee.birth_date_raw || '',
            emergency_contact_name: employee.emergency_contact_name_raw || '',
            emergency_contact_phone: employee.emergency_contact_phone_raw || '',
            ktp_file: null,
            avatar_file: null,
        });
        setShowAddModal(true);
    };

    const handleDelete = (employeeId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus karyawan ini? Data yang dihapus tidak dapat dikembalikan.')) {
            router.delete(route('core-hr.destroy', employeeId));
        }
    };

    const openAddModal = () => {
        setEditingEmployee(null);
        reset();
        setShowAddModal(true);
    };

    // Use data from Controller
    const employees = employeesData;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold leading-tight text-[#141733]">
                        Core HR & Org Chart
                    </h2>
                    <button 
                        onClick={openAddModal}
                        className="bg-[#bbff00] text-[#141733] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#a5e600] shadow-sm flex items-center justify-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Karyawan
                    </button>
                </div>
            }
        >
            <Head title="Core HR" />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                        <h3 className="text-2xl font-bold text-[#141733]">{employees.length}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Karyawan Baru</p>
                        <h3 className="text-2xl font-bold text-[#141733]">12 <span className="text-sm font-normal text-gray-400">bulan ini</span></h3>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Kontrak Berakhir</p>
                        <h3 className="text-2xl font-bold text-[#141733]">5 <span className="text-sm font-normal text-gray-400">bulan ini</span></h3>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Tingkat Retensi</p>
                        <h3 className="text-2xl font-bold text-[#141733]">96.5%</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                
                {/* Tabs */}
                <div className="border-b border-gray-200 px-6 pt-4 flex gap-6">
                    <button 
                        onClick={() => setActiveTab('directory')}
                        className={`pb-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'directory' ? 'border-[#141733] text-[#141733]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Direktori Karyawan
                    </button>
                    <button 
                        onClick={() => setActiveTab('orgchart')}
                        className={`pb-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'orgchart' ? 'border-[#141733] text-[#141733]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Struktur Organisasi
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'directory' && (
                        <div className="animate-in fade-in duration-300">
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                <div className="relative w-full sm:w-96">
                                    <input type="text" placeholder="Cari nama, ID, atau posisi..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#bbff00] focus:border-[#bbff00] transition-colors outline-none" />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <div className="flex gap-2">
                                    <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                        Filter
                                    </button>
                                    <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Export
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Karyawan</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Karyawan</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Departemen & Posisi</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {employees.map((emp, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-sm">{emp.name}</div>
                                                            <div className="text-xs text-gray-500">{emp.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{emp.employee_code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-900 text-sm">{emp.department}</div>
                                                    <div className="text-xs text-gray-500">{emp.role}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        emp.status === 'Full time' ? 'bg-green-100 text-green-700' :
                                                        emp.status === 'Contract' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {emp.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center">
                                                    <div className="flex flex-col gap-1 items-end">
                                                        {emp.contract_document_path ? (
                                                            <a href={emp.contract_document_path} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-800 font-bold flex items-center gap-1 text-xs">
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                Unduh Kontrak
                                                            </a>
                                                        ) : (
                                                            loggedInUser.id === emp.user_id ? (
                                                                <button onClick={() => openSignatureModal(emp)} className="text-[#bbff00] hover:text-[#a5e600] bg-[#141733] px-2 py-1 rounded font-bold flex items-center gap-1 text-xs">
                                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                    Sign Kontrak
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-400 font-medium text-xs italic">Menunggu TTD Kontrak</span>
                                                            )
                                                        )}
                                                        {emp.nda_document_path ? (
                                                            <a href={emp.nda_document_path} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-800 font-bold flex items-center gap-1 text-xs">
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                Unduh NDA
                                                            </a>
                                                        ) : (
                                                            loggedInUser.id === emp.user_id ? (
                                                                <button onClick={() => openNdaModal(emp)} className="text-[#bbff00] hover:text-[#a5e600] bg-gray-700 px-2 py-1 rounded font-bold flex items-center gap-1 text-xs">
                                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                    Sign NDA
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-400 font-medium text-xs italic">Menunggu TTD NDA</span>
                                                            )
                                                        )}
                                                    </div>
                                                    {loggedInUser.role !== 'employee' && (
                                                        <>
                                                            <button onClick={() => handleEdit(emp)} className="text-indigo-600 hover:text-indigo-900 font-bold ml-2">Edit</button>
                                                            <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700 font-bold">Hapus</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination Placeholder */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                <span className="text-sm text-gray-500 font-medium">Menampilkan 1 hingga {employees.length} dari {employees.length} data</span>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed text-sm font-bold">Prev</button>
                                    <button className="px-3 py-1.5 border border-transparent bg-[#141733] text-white rounded-lg text-sm font-bold shadow-sm">1</button>
                                    <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 text-sm font-bold transition-colors">2</button>
                                    <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 text-sm font-bold transition-colors">3</button>
                                    <span className="px-2 py-1.5 text-gray-400">...</span>
                                    <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 text-sm font-bold transition-colors">Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orgchart' && (
                        <div className="animate-in fade-in duration-300 overflow-x-auto py-8">
                            <div className="min-w-max flex flex-col items-center">
                                {/* Top Level */}
                                <div className="bg-[#141733] text-white p-4 rounded-xl shadow-lg w-64 text-center border-b-4 border-[#bbff00] z-10 relative">
                                    <div className="w-12 h-12 rounded-full bg-white/10 mx-auto mb-3 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#bbff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div className="font-bold text-lg">Direksi / Board</div>
                                    <div className="text-xs text-white/70 mt-1">Top Management</div>
                                </div>
                                
                                <div className="w-px h-8 bg-gray-300"></div>
                                
                                <div className="flex justify-center relative px-8">
                                    {/* Horizontal Line for Departments */}
                                    {departments.length > 1 && (
                                        <div className="absolute top-0 h-px bg-gray-300" style={{ left: 'calc(50% / ' + departments.length + ')', right: 'calc(50% / ' + departments.length + ')' }}></div>
                                    )}

                                    <div className="flex gap-8">
                                        {departments.map((dept, index) => {
                                            const manager = employees.find(e => e.id === dept.manager_id);
                                            const staffs = employees.filter(e => e.department_id === dept.id && e.id !== dept.manager_id);

                                            return (
                                                <div key={dept.id} className="flex flex-col items-center relative">
                                                    {/* Vertical line down from horizontal */}
                                                    <div className="w-px h-8 bg-gray-300"></div>
                                                    
                                                    {/* Department Head Card */}
                                                    <div className="bg-white border-t-4 border-[#bbff00] p-4 rounded-xl shadow-sm w-56 text-center z-10 relative group hover:shadow-md transition-shadow">
                                                        <button 
                                                            onClick={() => {
                                                                setEditingDept(dept);
                                                                setSelectedManagerId(dept.manager_id || '');
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 bg-gray-100 text-gray-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                                                            title="Atur Kepala Departemen"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <h4 className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider bg-gray-50 py-1 rounded-md">{dept.name}</h4>
                                                        {manager ? (
                                                            <div className="flex flex-col items-center">
                                                                <img src={manager.avatar} alt={manager.name} className="w-14 h-14 rounded-full mb-2 object-cover border-2 border-gray-100" />
                                                                <div className="font-bold text-[#141733] text-sm leading-tight">{manager.name}</div>
                                                                <div className="text-xs text-gray-500 mt-1">{manager.role}</div>
                                                            </div>
                                                        ) : (
                                                            <div className="py-4">
                                                                <div className="w-10 h-10 rounded-full bg-gray-100 mx-auto mb-2 flex items-center justify-center border-2 border-dashed border-gray-300">
                                                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                                </div>
                                                                <div className="text-xs text-gray-400 font-medium">Head Kosong</div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Staff List */}
                                                    {staffs.length > 0 && (
                                                        <>
                                                            <div className="w-px h-6 bg-gray-300"></div>
                                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 w-56 shadow-inner">
                                                                <div className="text-[10px] text-gray-400 font-bold mb-2 px-2 uppercase tracking-wide">Tim ({staffs.length})</div>
                                                                <div className="space-y-1">
                                                                    {staffs.map(staff => (
                                                                        <div key={staff.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:border-[#bbff00] transition-colors cursor-default">
                                                                            <img src={staff.avatar} alt={staff.name} className="w-8 h-8 rounded-full object-cover" />
                                                                            <div className="text-left overflow-hidden">
                                                                                <div className="text-xs font-bold text-gray-800 truncate">{staff.name}</div>
                                                                                <div className="text-[10px] text-gray-500 truncate">{staff.role}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 md:p-6">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                            <h3 className="text-lg font-bold text-[#141733]">{editingEmployee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 overflow-y-auto no-scrollbar flex-1">
                                
                                {/* Foto Profil Upload */}
                                <div className="mb-6 flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 mb-3 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                        {data.avatar_file ? (
                                            <img src={URL.createObjectURL(data.avatar_file)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editingEmployee && editingEmployee.avatar && !editingEmployee.avatar.includes('pravatar') ? (
                                            <img src={editingEmployee.avatar} alt="Current Photo" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        )}
                                    </div>
                                    <label htmlFor="avatar-upload" className="cursor-pointer text-sm font-bold text-[#bbff00] bg-[#141733] px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
                                        Unggah Foto
                                    </label>
                                    <input 
                                        id="avatar-upload"
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={e => setData('avatar_file', e.target.files[0])}
                                    />
                                    {errors.avatar_file && <div className="text-red-500 text-xs mt-1">{errors.avatar_file}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nama Depan *</label>
                                        <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" required />
                                        {errors.first_name && <div className="text-red-500 text-xs mt-1">{errors.first_name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nama Belakang</label>
                                        <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Perusahaan *</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" required />
                                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Departemen *</label>
                                        <select value={data.department_id} onChange={e => setData('department_id', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" required>
                                            <option value="">Pilih Departemen</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                        {errors.department_id && <div className="text-red-500 text-xs mt-1">{errors.department_id}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Posisi / Jabatan *</label>
                                        <input type="text" value={data.job_title} onChange={e => setData('job_title', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" required />
                                        {errors.job_title && <div className="text-red-500 text-xs mt-1">{errors.job_title}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Gaji Pokok (Rp) *</label>
                                        <input 
                                            type="text" 
                                            value={data.basic_salary ? Number(data.basic_salary).toLocaleString('id-ID') : ''} 
                                            onChange={e => {
                                                const rawValue = e.target.value.replace(/\D/g, '');
                                                setData('basic_salary', rawValue);
                                            }} 
                                            className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" 
                                            required 
                                        />
                                        {errors.basic_salary && <div className="text-red-500 text-xs mt-1">{errors.basic_salary}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tipe Gaji *</label>
                                        <select value={data.salary_type} onChange={e => setData('salary_type', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" required>
                                            <option value="gross">Gross (Kotor)</option>
                                            <option value="net">Net (Bersih)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Status Karyawan *</label>
                                        <select value={data.employment_status} onChange={e => setData('employment_status', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" required>
                                            <option value="full_time">Full Time</option>
                                            <option value="contract">Contract</option>
                                            <option value="freelance">Freelance</option>
                                            <option value="probation">Probation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Bergabung (Pertama Kali) *</label>
                                        <input type="date" value={data.join_date} onChange={e => setData('join_date', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" required />
                                        {errors.join_date && <div className="text-red-500 text-xs mt-1">{errors.join_date}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Status PTKP *</label>
                                        <select value={data.ptkp_status} onChange={e => setData('ptkp_status', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" required>
                                            <option value="TK/0">TK/0 (Tidak Kawin, 0 Tanggungan)</option>
                                            <option value="TK/1">TK/1 (Tidak Kawin, 1 Tanggungan)</option>
                                            <option value="TK/2">TK/2 (Tidak Kawin, 2 Tanggungan)</option>
                                            <option value="TK/3">TK/3 (Tidak Kawin, 3 Tanggungan)</option>
                                            <option value="K/0">K/0 (Kawin, 0 Tanggungan)</option>
                                            <option value="K/1">K/1 (Kawin, 1 Tanggungan)</option>
                                            <option value="K/2">K/2 (Kawin, 2 Tanggungan)</option>
                                            <option value="K/3">K/3 (Kawin, 3 Tanggungan)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100">
                                        <h4 className="font-bold text-[#141733] mb-4 text-sm uppercase tracking-wide">Periode Kontrak Saat Ini</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Mulai Kontrak</label>
                                                <input type="date" value={data.contract_start_date} onChange={e => setData('contract_start_date', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" />
                                                {errors.contract_start_date && <div className="text-red-500 text-xs mt-1">{errors.contract_start_date}</div>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Selesai Kontrak</label>
                                                <input type="date" value={data.contract_end_date} onChange={e => setData('contract_end_date', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" />
                                                {errors.contract_end_date && <div className="text-red-500 text-xs mt-1">{errors.contract_end_date}</div>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Opsi Perpanjangan</label>
                                                <label className="flex items-center gap-2 mt-2">
                                                    <input type="checkbox" checked={data.is_contract_extendable} onChange={e => setData('is_contract_extendable', e.target.checked)} className="rounded border-gray-300 text-[#141733] focus:ring-[#bbff00]" />
                                                    <span className="text-sm text-gray-600">Kontrak dapat diperpanjang</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 pt-6 mt-2 border-t border-gray-100">
                                        <h4 className="font-bold text-[#141733] mb-4 text-lg">Informasi Tambahan & Pribadi</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Nomor KTP (NIK)</label>
                                                <input type="text" value={data.identity_number} onChange={e => setData('identity_number', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" maxLength={20} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Upload KTP (PDF/JPG/PNG)</label>
                                                <input type="file" onChange={e => setData('ktp_file', e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#bbff00] file:text-[#141733] hover:file:bg-[#a5e600] file:transition-colors" accept=".pdf,.jpg,.jpeg,.png" />
                                                {errors.ktp_file && <div className="text-red-500 text-xs mt-1">{errors.ktp_file}</div>}
                                                {editingEmployee?.ktp_file_path && (
                                                    <div className="mt-2 text-xs">
                                                        <a href={editingEmployee.ktp_file_path} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Lihat KTP Saat Ini</a>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Lahir</label>
                                                <input type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Gelar Terakhir</label>
                                                <select value={data.latest_education} onChange={e => setData('latest_education', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]">
                                                    <option value="">Pilih Pendidikan Terakhir</option>
                                                    <option value="SMA/SMK">SMA/SMK</option>
                                                    <option value="D3">Diploma (D3)</option>
                                                    <option value="S1">Sarjana (S1)</option>
                                                    <option value="S2">Magister (S2)</option>
                                                    <option value="S3">Doktor (S3)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Tahun Lulus</label>
                                                <input type="number" value={data.graduation_year} onChange={e => setData('graduation_year', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Universitas / Institusi</label>
                                                <input type="text" value={data.university_name} onChange={e => setData('university_name', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" />
                                            </div>
                                            <div className="md:col-span-2 mt-2">
                                                <h5 className="font-bold text-gray-700 mb-3 text-sm">Kontak Darurat (Emergency Contact)</h5>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Kontak Darurat</label>
                                                <input type="text" value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" placeholder="Misal: Istri / Orang Tua" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Telepon Kontak Darurat</label>
                                                <input type="text" value={data.emergency_contact_phone} onChange={e => setData('emergency_contact_phone', e.target.value)} className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Batal</button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="bg-[#141733] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        editingEmployee ? 'Simpan Perubahan' : 'Simpan Karyawan'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Department Manager Modal */}
            {editingDept && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h3 className="text-lg font-bold text-[#141733]">Atur Kepala Departemen</h3>
                            <button onClick={() => setEditingDept(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateManager} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Kepala {editingDept.name}</label>
                                <select 
                                    value={selectedManagerId} 
                                    onChange={(e) => setSelectedManagerId(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:ring-[#bbff00] focus:border-[#bbff00]"
                                >
                                    <option value="">-- Kosongkan --</option>
                                    {employees
                                        .filter(emp => emp.department_id === editingDept.id)
                                        .map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                                        ))
                                    }
                                </select>
                                <p className="text-xs text-gray-500 mt-2">Hanya karyawan di departemen {editingDept.name} yang bisa dipilih.</p>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setEditingDept(null)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
                                <button type="submit" className="bg-[#141733] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Signature Modal */}
            {showSignatureModal && signingEmployee && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-[#141733]">Tanda Tangani Kontrak</h3>
                            <button onClick={() => setShowSignatureModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Silakan baca pratinjau Perjanjian Kerja (PKWT) di bawah ini, lalu gambar tanda tangan digital Anda untuk menyetujuinya.
                            </p>
                            <div className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-lg p-6 mb-5">
                                <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <p className="text-sm text-gray-600 text-center mb-4 max-w-xs">Pastikan Anda telah membaca dokumen kontrak dalam format PDF asli sebelum menandatanganinya.</p>
                                <a 
                                    href={route('core-hr.contract.preview', signingEmployee.id)} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 hover:text-indigo-600 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    Buka Pratinjau Dokumen PDF
                                </a>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden relative" style={{ height: '200px' }}>
                                <span className="absolute top-2 left-3 text-xs text-gray-400 font-medium">Area Tanda Tangan:</span>
                                <SignatureCanvas 
                                    ref={sigCanvas} 
                                    penColor="#141733"
                                    canvasProps={{ 
                                        width: 440, 
                                        height: 196, 
                                        className: 'w-full h-full cursor-crosshair' 
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
                            <button type="button" disabled={isSigning} onClick={() => setShowSignatureModal(false)} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">Batal</button>
                            <button 
                                onClick={handleSignContract} 
                                disabled={isSigning}
                                className="bg-[#bbff00] text-[#141733] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#a5e600] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSigning ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#141733]" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        Simpan & Generate PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NDA Signature Modal */}
            {showNdaModal && signingEmployee && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-[#141733]">Tanda Tangani NDA</h3>
                            <button onClick={() => setShowNdaModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Silakan baca pratinjau Non-Disclosure Agreement (NDA) di bawah ini, lalu gambar tanda tangan digital Anda untuk menyetujuinya.
                            </p>
                            <div className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-lg p-6 mb-5">
                                <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <p className="text-sm text-gray-600 text-center mb-4 max-w-xs">Pastikan Anda telah membaca dokumen NDA dalam format PDF asli sebelum menandatanganinya.</p>
                                <a 
                                    href={route('core-hr.nda.preview', signingEmployee.id)} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 hover:text-indigo-600 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    Buka Pratinjau Dokumen NDA
                                </a>
                            </div>

                            <div ref={ndaContainerRef} className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden relative" style={{ height: '200px' }}>
                                <span className="absolute top-2 left-3 text-xs text-gray-400 font-medium">Area Tanda Tangan:</span>
                                <SignatureCanvas 
                                    ref={ndaSigCanvas} 
                                    penColor="#141733"
                                    canvasProps={{ 
                                        width: ndaCanvasDims.width, 
                                        height: ndaCanvasDims.height, 
                                        className: 'cursor-crosshair' 
                                    }} 
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => ndaSigCanvas.current.clear()} 
                                    className="text-sm text-red-500 font-bold hover:text-red-700"
                                >
                                    Hapus & Ulangi
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <button type="button" disabled={isSigning} onClick={() => setShowNdaModal(false)} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">Batal</button>
                            <button 
                                onClick={handleSignNda} 
                                disabled={isSigning}
                                className="bg-[#141733] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSigning ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        Simpan & Generate PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
