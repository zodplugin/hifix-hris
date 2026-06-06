import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function getMenuIcon(label) {
    const className = "w-5 h-5 transition-transform duration-200 group-hover:scale-110";
    switch (label) {
        // Employee Lifecycle
        case "Core HR & Org Chart":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            );
        case "Recruitment (ATS)":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );
        case "Onboarding/Offboarding":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            );
        // Time & Attendance
        case "Live Attendance":
        case "My Attendance":
        case "Team Attendance":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case "Advanced Rostering":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        case "Overtime & Leave":
        case "My Time Off":
        case "Team Leave Approval":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        // Payroll & Tax
        case "Run Payroll":
        case "PPh 21 TER":
        case "Disbursement & Payslip":
        case "My Payslips":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        // Talent & Performance
        case "KPI & OKR Tracking":
        case "Performance (KPI)":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h-2a2 2 0 00-2-2z" />
                </svg>
            );
        case "360 Degree Feedback":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            );
        case "Learning Management":
        case "My Learning":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            );
        // System
        case "Company Settings":
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            );
        default:
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            );
    }
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.message) {
            toast(flash.message);
        }
    }, [flash]);

    // Admin / Manager sidebar
    const adminGroups = [
        {
            title: "Employee Lifecycle",
            items: [
                { label: "Core HR & Org Chart", href: route('core-hr'), active: route().current('core-hr*') },
                { label: "Recruitment (ATS)", href: route('recruitment'), active: route().current('recruitment*') },
                { label: "Onboarding/Offboarding", href: route('onboarding'), active: route().current('onboarding*') },
            ]
        },
        {
            title: "Time & Attendance",
            items: [
                { label: "Live Attendance", href: route('live-attendance'), active: route().current('live-attendance*') },
                { label: "Advanced Rostering", href: route('rostering'), active: route().current('rostering*') },
                { label: "Overtime & Leave", href: route('overtime'), active: route().current('overtime*') },
            ]
        },
        {
            title: "Payroll & Tax",
            items: [
                { label: "Run Payroll", href: route('run-payroll'), active: route().current('run-payroll*') },
                { label: "PPh 21 TER", href: route('tax'), active: route().current('tax*') },
                { label: "Disbursement & Payslip", href: route('payslip'), active: route().current('payslip*') },
            ]
        },
        {
            title: "Talent & Performance",
            items: [
                { label: "KPI & OKR Tracking", href: route('kpi'), active: route().current('kpi*') },
                { label: "360 Degree Feedback", href: route('feedback'), active: route().current('feedback*') },
                { label: "Learning Management", href: route('learning'), active: route().current('learning*') },
            ]
        },
        {
            title: "System",
            items: [
                { label: "Company Settings", href: route('settings.index'), active: route().current('settings.index') },
            ]
        }
    ];

    // Employee Self Service sidebar
    const employeeGroups = [
        {
            title: "Self Service",
            items: [
                { label: "My Attendance", href: route('live-attendance'), active: route().current('live-attendance*') },
                { label: "My Time Off", href: route('overtime'), active: route().current('overtime*') },
                { label: "My Payslips", href: route('my-payslips'), active: route().current('my-payslips*') },
                { label: "My Learning", href: route('learning'), active: route().current('learning*') },
            ]
        }
    ];

    // Manager Self Service sidebar
    const managerGroups = [
        {
            title: "Self Service",
            items: [
                { label: "My Attendance", href: route('live-attendance'), active: route().current('live-attendance*') },
                { label: "My Time Off", href: route('overtime'), active: route().current('overtime*') },
                { label: "My Payslips", href: route('my-payslips'), active: route().current('my-payslips*') },
                { label: "My Learning", href: route('learning'), active: route().current('learning*') },
            ]
        },
        {
            title: "Team Management",
            items: [
                { label: "Team Attendance", href: route('live-attendance'), active: route().current('live-attendance*') },
                { label: "Team Leave Approval", href: route('overtime'), active: route().current('overtime*') },
                { label: "Performance (KPI)", href: route('kpi'), active: route().current('kpi*') },
            ]
        }
    ];

    const sidebarGroups = user.role === 'employee' ? employeeGroups : (user.role === 'manager' ? managerGroups : adminGroups);
    const dashboardActive = route().current('dashboard');

    return (
        <div className="flex h-screen bg-gray-50" style={{ fontFamily: "'Figtree', sans-serif" }}>
            <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'Figtree', sans-serif", fontSize: '14px', fontWeight: 'bold' } }} />
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-72 bg-[#141733] text-white shadow-xl flex-shrink-0 border-r border-white/5">
                <div className="flex items-center px-8 h-20 border-b border-white/10 shrink-0">
                    <Link href="/">
                        <div className="relative inline-block pb-3.5">
                            <span className="text-4xl font-black tracking-widest text-white leading-none">HRIS</span>
                            <span className="absolute bottom-0 right-0 text-[10px] font-black tracking-widest text-[#bbff00] uppercase translate-y-0.5">by Hifix</span>
                        </div>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 space-y-8">
                    {/* Dashboard Primary Link */}
                    <Link
                        href={route('dashboard')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold shadow-md transition-all duration-200 hover:scale-[1.02] ${dashboardActive
                            ? 'bg-[#bbff00] text-[#141733]'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Dashboard
                    </Link>

                    {sidebarGroups.map((group, idx) => (
                        <div key={idx} className="space-y-2">
                            <h3 className="px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                                {group.title}
                            </h3>
                            <ul className="space-y-1">
                                {group.items.map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            href={item.href}
                                            className={`group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-r-lg transition-all duration-200 ${item.active
                                                ? 'bg-gradient-to-r from-[#bbff00]/10 to-transparent text-[#bbff00] border-l-4 border-[#bbff00] pl-3'
                                                : 'text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-1'
                                                }`}
                                        >
                                            {getMenuIcon(item.label)}
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* User Profile & Actions Bottom Section */}
                <div className="p-4 border-t border-white/10 shrink-0 space-y-3 bg-[#111329]">
                    {/* Action buttons (Edit Profile & Logout) above user card */}
                    <div className="flex gap-2">
                        <Link
                            href={route('profile.edit')}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors border border-white/5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/10"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Log Out
                        </Link>
                    </div>

                    {/* Static User profile details card */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="h-9 w-9 rounded-full bg-[#bbff00] flex items-center justify-center text-[#141733] font-black uppercase text-sm shadow-sm shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-white/50 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-[#141733] h-16 flex items-center justify-between px-4 shrink-0">
                    <div className="relative inline-block pb-2.5">
                        <span className="text-2xl font-black tracking-widest text-white leading-none">HRIS</span>
                        <span className="absolute bottom-0 right-0 text-[8px] font-black tracking-widest text-[#bbff00] uppercase translate-y-0.5">by Hifix</span>
                    </div>
                    <button onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)} className="text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showingNavigationDropdown ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </header>

                {/* Mobile Menu Dropdown */}
                {showingNavigationDropdown && (
                    <div className="md:hidden bg-[#141733] text-white border-t border-white/10 absolute top-16 w-full z-50 shadow-xl overflow-y-auto no-scrollbar max-h-[calc(100vh-4rem)] pb-6">
                        <div className="p-4 space-y-6">
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')} className="text-white">
                                Dashboard
                            </ResponsiveNavLink>
                            {sidebarGroups.map((group, idx) => (
                                <div key={idx} className="mt-4">
                                    <div className="px-4 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">{group.title}</div>
                                    {group.items.map((item, i) => (
                                        <ResponsiveNavLink key={i} href={item.href} active={item.active} className="text-white/80 hover:bg-white/10">{item.label}</ResponsiveNavLink>
                                    ))}
                                </div>
                            ))}
                            <div className="border-t border-white/20 pt-4 mt-6">
                                <ResponsiveNavLink href={route('profile.edit')} className="text-white">Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-white">Log Out</ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Page Header */}
                {header && (
                    <div className="bg-white border-b border-gray-200 shrink-0">
                        <div className="py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
