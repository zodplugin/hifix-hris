import { motion } from 'framer-motion';

export default function DashboardMotionWidget() {
    return (
        <div className="w-full bg-[#141733] rounded-[2.5rem] p-6 text-white border border-white/10 shadow-2xl relative overflow-hidden flex flex-col gap-6 select-none aspect-[4/3] justify-center">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Title / Header */}
            <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
                    <span className="text-xs font-black uppercase tracking-widest text-white/50">Hifix Live Monitor</span>
                </div>
                <div className="text-[10px] bg-[#bbff00]/10 text-[#bbff00] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                    System OK
                </div>
            </div>

            {/* Grid Layout inside the preview */}
            <div className="relative z-10 grid grid-cols-2 gap-4 flex-1">
                
                {/* Panel 1: Radar Geofencing */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col justify-between items-center relative overflow-hidden">
                    <div className="text-[10px] font-bold text-white/50 tracking-wider uppercase mb-2 self-start">Geofence GPS Attendance</div>
                    
                    {/* Concentric Radar pulses */}
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                            className="absolute w-12 h-12 rounded-full border border-[#bbff00]/40 bg-[#bbff00]/5"
                        />
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0.6 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.7, ease: "easeOut" }}
                            className="absolute w-12 h-12 rounded-full border border-[#bbff00]/25 bg-[#bbff00]/5"
                        />
                        <div className="absolute w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                            {/* Pin icon with bounce */}
                            <motion.svg 
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className="w-6 h-6 text-[#bbff00]" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </motion.svg>
                        </div>
                    </div>

                    <div className="text-[10px] text-white/70 font-semibold mt-2">Geofence Radius: 100m</div>
                </div>

                {/* Panel 2: Live Activity / Auto Payroll */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-white/50 tracking-wider uppercase mb-2">Automated Payroll Process</div>
                    
                    {/* Live Progress Bar loop */}
                    <div className="space-y-4 my-auto">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                                <span>PPh 21 TER Calculations</span>
                                <span className="text-[#bbff00]">100%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ repeat: Infinity, duration: 3, repeatDelay: 1, ease: "easeInOut" }}
                                    className="h-full bg-[#bbff00] rounded-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                                <span>BPJS Deductions</span>
                                <span className="text-[#bbff00]">100%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ repeat: Infinity, duration: 3, delay: 0.5, repeatDelay: 1, ease: "easeInOut" }}
                                    className="h-full bg-[#bbff00] rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-[9px] text-[#bbff00] font-black uppercase tracking-wider text-right mt-2">
                        One-click Run Ready
                    </div>
                </div>
            </div>
            
            {/* Dynamic Activity Feed Loop */}
            <div className="relative z-10 bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#bbff00] text-[#141733] flex items-center justify-center font-black text-xs">
                        JD
                    </div>
                    <div>
                        <p className="text-xs font-bold">John Doe (Engineering)</p>
                        <p className="text-[10px] text-white/55">Clocked in at Office Geofence</p>
                    </div>
                </div>
                <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-[10px] font-bold text-green-400"
                >
                    Verified GPS
                </motion.div>
            </div>
        </div>
    );
}
