import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthAnimation() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Rotate through different card previews
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Simulated data
    const employees = [
        { name: 'Sarah Connor', role: 'Product Designer', status: 'Present', time: '08:58 AM' },
        { name: 'Alex Rivera', role: 'Software Engineer', status: 'Present', time: '09:02 AM' },
        { name: 'Maria Utama', role: 'HR Manager', status: 'On Leave', time: '-' },
    ];

    return (
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center select-none">
            {/* Glowing Backdrop Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.15, 0.9, 1],
                    x: [0, 20, -15, 0],
                    y: [0, -30, 20, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-72 h-72 rounded-full bg-[#bbff00]/15 blur-3xl -top-10 -right-10"
            />
            <motion.div
                animate={{
                    scale: [1, 0.9, 1.1, 1],
                    x: [0, -25, 20, 0],
                    y: [0, 20, -15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-80 h-80 rounded-full bg-[#38bdf8]/10 blur-3xl -bottom-10 -left-10"
            />

            {/* Interactive Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Main Interactive Showcase */}
            <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {activeIndex === 0 && (
                        <motion.div
                            key="attendance"
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -15 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-[85%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
                        >
                            {/* Attendance Tracking Card */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Realtime Attendance</span>
                                    <h4 className="text-white font-bold text-lg">Kehadiran Hari Ini</h4>
                                </div>
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>

                            <div className="space-y-3">
                                {employees.map((emp, i) => (
                                    <motion.div
                                        key={emp.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/[0.05]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#bbff00]/20 to-[#38bdf8]/20 flex items-center justify-center border border-white/10 font-bold text-white text-sm">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{emp.name}</p>
                                                <p className="text-xs text-white/40">{emp.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                emp.status === 'Present' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                                {emp.status}
                                            </span>
                                            {emp.time !== '-' && (
                                                <p className="text-[10px] text-white/30 mt-1">{emp.time}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeIndex === 1 && (
                        <motion.div
                            key="payroll"
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -15 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-[85%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
                        >
                            {/* Payroll Summary Card */}
                            <div className="mb-6">
                                <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Automatic Payroll</span>
                                <h4 className="text-white font-bold text-lg">Estimasi Gaji & PPh 21</h4>
                            </div>

                            <div className="p-4 rounded-xl bg-gradient-to-br from-[#141733] to-[#252a5c] border border-white/10 mb-4">
                                <span className="text-xs text-white/60">Total Pembayaran Gaji</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-2xl font-extrabold text-[#bbff00]"
                                    >
                                        Rp 148.500.000
                                    </motion.span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '78%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-[#bbff00] to-[#38bdf8] rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                    <span className="text-[10px] text-white/40 block">Terbayarkan Otomatis</span>
                                    <span className="text-sm font-semibold text-white">12 Karyawan</span>
                                </div>
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                    <span className="text-[10px] text-white/40 block">Pajak PPh 21 Terhitung</span>
                                    <span className="text-sm font-semibold text-emerald-400">Sesuai Regulasi</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeIndex === 2 && (
                        <motion.div
                            key="geofencing"
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -15 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-[85%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
                        >
                            {/* Geofencing Absensi Card */}
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Geofencing Security</span>
                                    <h4 className="text-white font-bold text-lg">Absensi GPS Presisi</h4>
                                </div>
                                <span className="text-xs bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 px-2 py-0.5 rounded-full font-medium">GPS Active</span>
                            </div>

                            {/* Simulated Map Radar */}
                            <div className="relative w-full h-36 bg-[#101226]/80 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                                {/* Radar Pulse */}
                                <motion.div 
                                    animate={{ scale: [1, 2.5, 4], opacity: [0.6, 0.3, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                                    className="absolute w-12 h-12 rounded-full border-2 border-[#bbff00] bg-[#bbff00]/5"
                                />
                                <motion.div 
                                    animate={{ scale: [1, 2.5, 4], opacity: [0.6, 0.3, 0] }}
                                    transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeOut" }}
                                    className="absolute w-12 h-12 rounded-full border-2 border-[#38bdf8] bg-[#38bdf8]/5"
                                />

                                {/* Office Marker */}
                                <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-tr from-[#bbff00] to-emerald-400 flex items-center justify-center shadow-lg border-2 border-[#101226]">
                                    <svg className="w-4 h-4 text-[#101226]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>

                                {/* Floating Checked-in Avatar */}
                                <motion.div 
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute right-12 top-6 bg-[#141733] border border-white/10 rounded-lg p-1.5 flex items-center gap-1.5 shadow-xl scale-90"
                                >
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex-shrink-0" />
                                    <span className="text-[10px] text-white font-medium">Budi checked-in</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dot Indicators */}
                <div className="absolute bottom-6 flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                activeIndex === i ? 'bg-[#bbff00] w-6' : 'bg-white/20'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
