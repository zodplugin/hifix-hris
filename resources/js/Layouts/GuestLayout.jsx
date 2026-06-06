import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import AuthAnimation from '@/Components/AuthAnimation';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-white" style={{ fontFamily: "'Figtree', sans-serif" }}>
            {/* Left Side Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#141733] relative flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#141733] to-[#0a0c1f]"></div>
                <div className="absolute -bottom-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-radial from-[#bbff00]/10 to-transparent rounded-full blur-3xl"></div>
                
                {/* Framer Motion Animation Component */}
                <div className="relative z-10 w-full flex justify-center -mt-6">
                    <AuthAnimation />
                </div>

                <div className="relative z-10 px-12 max-w-xl text-center -mt-4">
                    <Link href="/">
                        <div className="relative inline-block pb-3.5 mb-3">
                            <span className="text-5xl font-black tracking-widest text-white leading-none">HRIS</span>
                            <span className="absolute bottom-0 right-0 text-xs font-black tracking-widest text-[#bbff00] uppercase translate-y-0.5">by Hifix</span>
                        </div>
                    </Link>
                    <h2 className="text-2xl font-bold text-white mb-2">Solusi Cerdas Pengelolaan SDM</h2>
                    <p className="text-white/75 text-sm font-light leading-relaxed">
                        Sederhanakan proses HR mulai dari siklus hidup karyawan, absensi geofencing, hingga payroll yang sesuai dengan regulasi PPh 21 terbaru di Indonesia.
                    </p>
                </div>
            </div>

            {/* Right Side Form */}
            <div className="flex w-full lg:w-1/2 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/">
                            <div className="relative inline-block pb-3.5">
                                <span className="text-4xl font-black tracking-widest text-[#141733] leading-none">HRIS</span>
                                <span className="absolute bottom-0 right-0 text-[10px] font-black tracking-widest text-[#bbff00] uppercase translate-y-0.5">by Hifix</span>
                            </div>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
