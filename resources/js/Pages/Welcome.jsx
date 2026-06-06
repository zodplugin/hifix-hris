import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import DashboardMotionWidget from '@/Components/DashboardMotionWidget';

const testimonials = [
    {
        quote: "Proses payroll yang dulunya memakan waktu berhari-hari karena hitungan lembur dan PPh 21 TER, sekarang selesai dalam hitungan jam. HRIS by Hifix sangat intuitif dan membebaskan tim kami untuk lebih strategis.",
        name: "Amanda S.",
        role: "HR Director Retail Group",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
    },
    {
        quote: "Fitur Geofencing sangat membantu memantau staf lapangan kami di berbagai titik secara real-time tanpa kecurangan lokasi. Sangat membantu operasional kami!",
        name: "Budi Santoso",
        role: "Ops Manager Logistics Corp",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
    },
    {
        quote: "Penyusunan roster kerja staf F&B kami yang kompleks sekarang sangat mudah diatur dengan modul Advanced Rostering. Karyawan juga senang bisa cek shift di portal mandiri.",
        name: "Citra Lestari",
        role: "People Ops F&B Chains",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"
    },
    {
        quote: "Evaluasi kinerja KPI & OKR 360 derajat kini tersentralisasi dengan baik. Tidak ada lagi form evaluasi yang tercecer, semuanya terdokumentasi dengan rapi.",
        name: "Dedi Kurniawan",
        role: "HR Manager Tech Start-up",
        image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80"
    },
    {
        quote: "Proses onboarding karyawan baru menjadi sangat terstruktur dengan checklist otomatis. Memberikan impresi pertama yang profesional bagi talent baru.",
        name: "Eka Wijaya",
        role: "Talent Acquisition Lead",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
    }
];

const faqs = [
    {
        question: "Apakah Hifix mendukung regulasi PPh 21 terbaru?",
        answer: "Ya, Hifix HRIS sepenuhnya mendukung perhitungan PPh 21 menggunakan regulasi PMK Tarif Efektif Rata-rata (TER) terbaru secara otomatis untuk meminimalisir kesalahan manual."
    },
    {
        question: "Bagaimana sistem absensi menangani shift malam?",
        answer: "Sistem absensi Hifix dilengkapi dengan Advanced Rostering yang mendukung pembagian shift kerja lintas hari (cross-day shift), memastikan pencatatan jam masuk dan pulang shift malam tetap akurat tanpa bentrok tanggal."
    },
    {
        question: "Apakah ada fitur untuk penilaian OKR/KPI?",
        answer: "Ya, Hifix menyediakan modul Talent & Performance terintegrasi untuk menetapkan target OKR, memantau pencapaian KPI bulanan/kuartalan, serta melakukan evaluasi 360-degree feedback."
    },
    {
        question: "Berapa lama waktu implementasinya?",
        answer: "Waktu implementasi sangat cepat, berkisar antara 3 hingga 7 hari kerja tergantung kompleksitas data karyawan dan aturan shift perusahaan Anda. Tim support kami akan mendampingi proses setup penuh."
    }
];

export default function Welcome({ auth }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [activeFaq, setActiveFaq] = useState(null);

    // Animation presets
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const fadeIn = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <>
            <Head>
                <title>HRIS by Hifix</title>
                <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <div className="bg-white text-gray-900 antialiased overflow-x-hidden" style={{ fontFamily: "'Figtree', sans-serif" }}>
                
                {/* Hero Section */}
                <div className="p-2 md:p-4">
                    <header className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[85vh] flex flex-col">
                        {/* Background Image */}
                        <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" alt="Office" className="absolute inset-0 w-full h-full object-cover object-center" />
                        
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-[#141733]/70 mix-blend-multiply"></div>
                        <div className="bg-gradient-to-r from-[#141733]/90 to-transparent absolute top-0 right-0 bottom-0 left-0"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#141733] to-transparent opacity-90"></div>

                        {/* Navigation */}
                        <motion.nav 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-20 flex justify-between items-center px-6 py-8 md:px-12 text-white"
                        >
                            <div className="relative inline-block pb-2.5">
                                <span className="text-2xl font-black tracking-widest text-white leading-none">HRIS</span>
                                <span className="absolute bottom-0 right-0 text-[8px] font-black tracking-widest text-[#bbff00] uppercase translate-y-0.5">by Hifix</span>
                            </div>
                            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                                <a href="#modules" className="hover:text-[#bbff00] transition-colors">Modul</a>
                                <a href="#testimonials" className="hover:text-[#bbff00] transition-colors">Testimoni</a>
                                <a href="#about" className="hover:text-[#bbff00] transition-colors">Tentang Kami</a>
                                <Link href={route('careers')} className="hover:text-[#bbff00] transition-colors">Karir / Loker</Link>
                                <a href="#contact" className="hover:text-[#bbff00] transition-colors">Kontak</a>
                            </div>
                            {auth?.user ? (
                                <Link href={route('dashboard')} className="hidden md:block bg-[#bbff00] text-[#141733] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-opacity-90 transition-colors">
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="hidden md:flex gap-4">
                                    <Link href={route('login')} className="text-white hover:text-[#bbff00] px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="bg-[#bbff00] text-[#141733] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-opacity-90 transition-colors">
                                        Coba Gratis
                                    </Link>
                                </div>
                            )}
                        </motion.nav>

                        {/* Hero Content */}
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-20 flex-1 flex flex-col justify-end px-6 py-12 md:px-12 md:py-24 max-w-3xl"
                        >
                            <h1 className="text-4xl md:text-5xl md:leading-tight tracking-tight font-bold text-white mb-6">
                                Tingkatkan Efisiensi <span className="text-[#bbff00]">HR Anda</span>
                            </h1>
                            <p className="text-base md:text-lg text-white/90 mb-8 max-w-xl font-light leading-relaxed">
                                Sistem manajemen SDM all-in-one yang dirancang untuk kepatuhan regulasi Indonesia, menyederhanakan payroll, dan memaksimalkan potensi tim Anda.
                            </p>
                            <Link href={route('register')} className="w-fit bg-[#bbff00] text-[#141733] pl-6 pr-2 py-2 rounded-full flex items-center gap-4 hover:bg-opacity-90 transition-colors group shadow-lg">
                                <span className="text-base font-bold">Mulai Transformasi Sekarang</span>
                                <span className="bg-[#141733] text-[#bbff00] p-1.5 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </Link>
                        </motion.div>
                    </header>
                </div>

                {/* Intro Section */}
                <section className="py-20 px-6 md:px-12 max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full"
                    >
                        <h2 className="text-3xl md:text-4xl leading-tight tracking-tight font-bold mb-12 max-w-xl text-[#141733]">
                            Satu platform untuk seluruh siklus karyawan
                        </h2>
                        <div className="flex flex-wrap gap-12 md:gap-20">
                            <div>
                                <div className="text-4xl md:text-5xl tracking-tight font-bold leading-none mb-2 text-[#bbff00]">100<span className="text-3xl">%</span></div>
                                <div className="text-base text-gray-600 font-medium">Akurat & Patuh Pajak (TER)</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl tracking-tight font-bold leading-none mb-2 text-[#bbff00]">10<span className="text-3xl">x</span></div>
                                <div className="text-base text-gray-600 font-medium">Lebih Cepat Proses Payroll</div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full mt-8 lg:mt-0"
                    >
                        <DashboardMotionWidget />
                    </motion.div>
                </section>

                {/* Philosophy Section */}
                <motion.section 
                    {...fadeInUp}
                    className="py-20 px-6 md:px-12 max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start border-t border-gray-100"
                >
                    <div className="col-span-1">
                        <p className="text-sm text-[#141733] font-bold leading-relaxed max-w-[200px] uppercase tracking-widest">Skalabilitas Tanpa Batas</p>
                    </div>
                    <div className="col-span-1 lg:col-span-3">
                        <h3 className="text-2xl md:text-3xl tracking-tight font-bold leading-snug max-w-4xl text-[#141733]">
                            Kami mengotomatisasi hal yang kompleks seperti lembur dan pajak, agar Anda dapat fokus mengembangkan SDM perusahaan.
                        </h3>
                    </div>
                </motion.section>

                {/* Modules Section */}
                <section id="modules" className="py-12 px-6 md:px-12 max-w-[90rem] mx-auto flex flex-col gap-6">
                    
                    {/* Module 1: Employee Lifecycle */}
                    <motion.div 
                        {...fadeInUp}
                        className="relative w-full rounded-[2rem] overflow-hidden min-h-[300px] flex items-center group"
                    >
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Employee Lifecycle" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#141733]/95 via-[#141733]/80 to-transparent"></div>
                        
                        <div className="relative z-10 w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="max-w-xl">
                                <h4 className="text-3xl md:text-4xl text-white tracking-tight font-bold mb-6">Employee Lifecycle</h4>
                                <ul className="text-white/90 space-y-3 text-base font-light">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#bbff00] shrink-0"></div>
                                        <span><strong>Core HR & Org Chart:</strong> Master data terpusat, visualisasi hierarki, dan manajemen dokumen.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#bbff00] shrink-0"></div>
                                        <span><strong>Recruitment (ATS):</strong> Portal karir internal hingga otomasi Offering Letter.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#bbff00] shrink-0"></div>
                                        <span><strong>Onboarding & Offboarding:</strong> Checklist terotomasi untuk transisi yang mulus.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-[#bbff00] flex flex-col items-start md:items-end md:self-end">
                                <span className="text-sm md:text-base font-medium mb-1">Modul Dasar</span>
                                <span className="text-3xl md:text-4xl font-bold tracking-tight leading-none">Core HR</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Module 2: Time & Attendance */}
                    <motion.div 
                        {...fadeInUp}
                        className="relative w-full rounded-[2rem] overflow-hidden min-h-[300px] flex items-center group"
                    >
                        <img src="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Time and Attendance" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent"></div>
                        
                        <div className="relative z-10 w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="max-w-xl">
                                <h4 className="text-3xl md:text-4xl text-[#bbff00] tracking-tight font-bold mb-6">Time & Attendance</h4>
                                <ul className="text-white/90 space-y-3 text-base font-light">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
                                        <span><strong>Geofencing & Biometric:</strong> Absensi via mobile dengan validasi GPS & sinkronisasi mesin.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
                                        <span><strong>Advanced Rostering:</strong> Pengelolaan shift kompleks untuk F&B, Retail, atau Pabrik.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
                                        <span><strong>Overtime & Leave Workflow:</strong> Multi-level approval langsung di genggaman Anda.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-white flex flex-col items-start md:items-end md:self-end">
                                <span className="text-sm md:text-base font-medium mb-1">Add-on Terfavorit</span>
                                <span className="text-3xl md:text-4xl font-bold tracking-tight leading-none text-white/90">Absensi</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Module 3: Payroll & Tax */}
                    <motion.div 
                        {...fadeInUp}
                        className="relative w-full rounded-[2rem] overflow-hidden min-h-[300px] flex items-center group"
                    >
                        <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2026&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Payroll" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#bbff00]/95 via-[#bbff00]/90 to-transparent"></div>
                        
                        <div className="relative z-10 w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="max-w-xl">
                                <h4 className="text-3xl md:text-4xl text-[#141733] tracking-tight font-bold mb-6">Payroll & Tax (ID)</h4>
                                <ul className="text-[#141733]/90 space-y-3 text-base font-medium">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#141733] shrink-0"></div>
                                        <span><strong>One-Click Payroll:</strong> Hitung gaji, potongan BPJS, dan pinjaman dalam satu klik.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#141733] shrink-0"></div>
                                        <span><strong>PPh 21 TER:</strong> Selalu update dengan regulasi PMK Tarif Efektif Rata-rata.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#141733] shrink-0"></div>
                                        <span><strong>Digital Payslip:</strong> Transfer file massal bank & kirim slip gaji terenkripsi via WA.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-[#141733] flex flex-col items-start md:items-end md:self-end">
                                <span className="text-sm md:text-base font-bold mb-1">Fitur Andalan</span>
                                <span className="text-3xl md:text-4xl font-black tracking-tight leading-none text-[#141733]">Payroll</span>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* More than HR Section */}
                <section className="py-24 px-6 md:px-12 max-w-[90rem] mx-auto overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8"
                    >
                        <h2 className="text-3xl md:text-4xl tracking-tight font-bold leading-tight text-[#141733]">
                            Dibuat khusus untuk<br />perusahaan modern Indonesia.
                        </h2>
                        <p className="max-w-md text-base text-gray-600 font-medium lg:text-right">
                            HRIS by Hifix memastikan perusahaan Anda mematuhi regulasi pemerintah sambil memberikan pengalaman karyawan yang luar biasa.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1 */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="bg-gray-100 p-8 rounded-[2rem] h-full flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-[#141733] mb-3">Integrasi Mudah</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Hubungkan Hifix dengan sistem akuntansi atau ERP internal Anda melalui API yang handal dan fleksibel.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" className="w-full aspect-[4/3] object-cover rounded-[2rem]" alt="Team working" />
                        </motion.div>

                        {/* Column 2 */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col gap-6 md:pt-12"
                        >
                            <a href="#contact" className="bg-[#141733] text-white rounded-[2rem] p-8 h-[240px] flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl">
                                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#bbff00]/10 rounded-full blur-2xl"></div>
                                <h3 className="text-2xl tracking-tight font-bold leading-tight relative z-10 flex flex-col gap-2">
                                    <span>Konsultasi<br/>Gratis</span>
                                    <span className="flex items-center gap-2 text-[#bbff00] text-lg mt-4">Hubungi Kami <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
                                </h3>
                            </a>
                            <div className="bg-[#bbff00] p-8 rounded-[2rem] h-[320px] flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-[#141733] mb-3">Talent & Performance</h3>
                                <p className="text-[#141733]/80 font-medium text-sm leading-relaxed">Tingkatkan produktivitas dengan KPI/OKR tracking, feedback 360 derajat, dan learning management system terintegrasi.</p>
                            </div>
                        </motion.div>

                        {/* Column 3 */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col gap-6"
                        >
                            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" className="w-full h-[240px] object-cover rounded-[2rem]" alt="Business meeting" />
                            <div className="bg-gray-900 p-8 rounded-[2rem] h-full flex flex-col justify-center text-white">
                                <h3 className="text-2xl font-bold text-[#bbff00] mb-3">Keamanan Bank-Grade</h3>
                                <p className="text-white/80 text-sm leading-relaxed">Data sensitif perusahaan dan karyawan Anda dilindungi dengan enkripsi tingkat tinggi dan kontrol akses role-based.</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonial Section */}
                <motion.section 
                    {...fadeInUp}
                    id="testimonials" 
                    className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center flex flex-col items-center"
                >
                    <h2 className="text-3xl md:text-4xl tracking-tight font-bold mb-4 text-[#141733]">Dipercaya HR Manager Indonesia</h2>
                    <p className="text-base text-gray-500 font-medium mb-12">Dengarkan dari mereka yang telah bertransformasi.</p>
                    
                    {/* Avatars Row */}
                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 mb-10">
                        {testimonials.map((testi, idx) => {
                            const isActive = idx === activeIdx;
                            return (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveIdx(idx)}
                                    className={`relative rounded-2xl overflow-hidden focus:outline-none transition-all duration-300 ${
                                        isActive 
                                            ? 'w-20 h-20 md:w-24 md:h-24 shadow-2xl ring-4 ring-[#bbff00] scale-110 z-10' 
                                            : 'w-14 h-14 md:w-16 md:h-16 opacity-60 hover:opacity-90 grayscale hover:grayscale-0'
                                    }`}
                                >
                                    <img src={testi.image} alt={testi.name} className="w-full h-full object-cover" />
                                </button>
                            );
                        })}
                    </div>

                    {/* Active testimonial details with fade animation */}
                    <div className="min-h-[160px] flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIdx}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-4xl"
                            >
                                <p className="text-lg md:text-xl font-medium tracking-tight leading-relaxed mb-6 text-[#141733]">
                                    "{testimonials[activeIdx].quote}"
                                </p>
                                <p className="text-base font-bold text-gray-900 tracking-tight">
                                    {testimonials[activeIdx].name}
                                </p>
                                <p className="text-xs text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">
                                    {testimonials[activeIdx].role}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* FAQ Section */}
                <section className="py-20 px-6 md:px-12 max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12 overflow-hidden">
                    <motion.h2 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl tracking-tight font-bold leading-tight w-full lg:w-1/3 text-[#141733]"
                    >
                        Pertanyaan<br />yang sering<br />diajukan
                    </motion.h2>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-2/3 relative rounded-[2rem] overflow-hidden bg-[#141733] min-h-[400px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#141733] to-[#141733]/80"></div>
                        
                        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full gap-2">
                            {faqs.map((faq, idx) => {
                                const isOpen = activeFaq === idx;
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                                        className={`border-b border-white/20 py-5 cursor-pointer select-none transition-colors ${idx === faqs.length - 1 ? 'border-b-0' : ''}`}
                                    >
                                        <div className="flex justify-between items-center text-white gap-4">
                                            <span className="text-lg md:text-xl font-bold">{faq.question}</span>
                                            <motion.span 
                                                animate={{ rotate: isOpen ? 45 : 0 }}
                                                className="text-[#bbff00] font-bold text-xl transition-transform shrink-0"
                                            >
                                                +
                                            </motion.span>
                                        </div>
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pt-3 text-sm text-white/70 leading-relaxed font-light">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <div className="p-2 md:p-4 pb-4">
                    <footer className="bg-[#141733] text-white rounded-[2rem] overflow-hidden relative">
                        
                        <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none opacity-20">
                            <div className="absolute -bottom-1/2 -left-1/4 w-[120%] h-[120%] bg-gradient-radial from-[#bbff00]/30 to-transparent rounded-full blur-3xl"></div>
                            <div className="absolute top-1/4 -right-1/4 w-[80%] h-[80%] bg-gradient-radial from-[#bbff00]/20 to-transparent rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            
                            <motion.div 
                                {...fadeIn}
                                className="px-8 py-8 md:px-12 border-b border-white/20 flex flex-col md:flex-row justify-between items-center gap-6"
                            >
                                <h3 className="text-2xl tracking-tight font-bold">Siap mentransformasi HR Anda?</h3>
                                <Link href={route('register')} className="bg-[#bbff00] text-[#141733] pl-6 pr-2 py-2 rounded-full flex items-center gap-4 hover:bg-opacity-90 transition-colors group">
                                    <span className="text-sm font-bold">Jadwalkan Demo</span>
                                    <span className="bg-[#141733] text-[#bbff00] p-1.5 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </Link>
                            </motion.div>

                            <div className="px-8 py-12 md:px-12 flex flex-col lg:flex-row justify-between gap-12">
                                
                                <div className="flex-1 max-w-md">
                                    <div className="relative inline-block pb-3.5 mb-3">
                                        <span className="text-3xl font-black tracking-widest text-white leading-none">HRIS</span>
                                        <span className="absolute bottom-0 right-0 text-[9px] font-black tracking-widest text-[#bbff00] uppercase translate-y-0.5">by Hifix</span>
                                    </div>
                                    <p className="text-lg font-light text-white/90 leading-tight">
                                        Solusi HR Cerdas<br />untuk Bisnis Skala Cepat.
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col lg:items-end w-full max-w-2xl">
                                    
                                    <div className="flex gap-2 mb-10 flex-wrap lg:justify-end">
                                        <a href="#modules" className="border border-white/30 rounded-full px-5 py-2 text-xs font-bold hover:bg-[#bbff00] hover:text-[#141733] hover:border-[#bbff00] transition-colors">Modul</a>
                                        <a href="#testimonials" className="border border-white/30 rounded-full px-5 py-2 text-xs font-bold hover:bg-[#bbff00] hover:text-[#141733] hover:border-[#bbff00] transition-colors">Testimoni</a>
                                        <a href="#about" className="border border-white/30 rounded-full px-5 py-2 text-xs font-bold hover:bg-[#bbff00] hover:text-[#141733] hover:border-[#bbff00] transition-colors">Perusahaan</a>
                                        <Link href={route('careers')} className="border border-white/30 rounded-full px-5 py-2 text-xs font-bold hover:bg-[#bbff00] hover:text-[#141733] hover:border-[#bbff00] transition-colors">Karir</Link>
                                        <a href="#contact" className="border border-white/30 rounded-full px-5 py-2 text-xs font-bold hover:bg-[#bbff00] hover:text-[#141733] hover:border-[#bbff00] transition-colors">Kontak</a>
                                    </div>

                                    <div className="w-full flex flex-col md:flex-row justify-between lg:justify-end gap-10 lg:gap-16 mb-4">
                                        <div className="lg:text-left">
                                            <h5 className="text-base tracking-tight font-bold mb-2 text-[#bbff00]">Hubungi Kami</h5>
                                            <a href="mailto:hello@hifix.id" className="block text-sm font-light text-white hover:text-[#bbff00] transition-colors mb-1">hello@hifix.id</a>
                                            <a href="tel:+62811223344" className="block text-sm font-light text-white hover:text-[#bbff00] transition-colors">+62 (811) 2233-4455</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-6 md:px-12 mt-auto flex flex-col md:flex-row justify-between items-center text-white/70 text-xs font-light gap-4 border-t border-white/10">
                                <p>&copy; {new Date().getFullYear()} HRIS by Hifix. Hak Cipta Dilindungi.</p>
                                <div className="flex gap-6">
                                    <a href="#" className="hover:text-[#bbff00] transition-colors">Kebijakan Privasi</a>
                                    <a href="#" className="hover:text-[#bbff00] transition-colors">Syarat & Ketentuan</a>
                                </div>
                            </div>

                        </div>
                    </footer>
                </div>

            </div>
        </>
    );
}
