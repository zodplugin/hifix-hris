import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            Account Profile
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Manage your personal details, credentials, and settings
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Left Column: Premium Profile Summary Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Card Decorative Banner */}
                            <div className="h-32 bg-gradient-to-br from-[#141733] to-[#252a5c] relative flex items-center justify-end p-4">
                                <div className="absolute top-2 right-2 text-[10px] font-black tracking-widest text-[#bbff00]/30 uppercase">
                                    HIFIX Member
                                </div>
                                <div className="w-24 h-24 bg-white/5 rounded-full blur-xl absolute -top-8 -left-8"></div>
                            </div>
                            
                            {/* User Avatar Circle (Overlaps Banner) */}
                            <div className="px-6 pb-6 relative">
                                <div className="flex justify-between items-end -mt-12 mb-4">
                                    <div className="h-24 w-24 rounded-2xl bg-[#bbff00] ring-4 ring-white flex items-center justify-center text-[#141733] text-4xl font-black uppercase shadow-md select-none">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#141733] text-[#bbff00]">
                                        {user.role || 'employee'}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-gray-900 leading-snug">{user.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                                </div>

                                <hr className="my-5 border-gray-100" />

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-semibold uppercase tracking-wider">Account Status</span>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-semibold uppercase tracking-wider">Joined Since</span>
                                        <span className="text-gray-700 font-bold">{formatDate(user.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-semibold uppercase tracking-wider">Last Updated</span>
                                        <span className="text-gray-700 font-bold">{formatDate(user.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms sections */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <UpdatePasswordForm />
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-red-100/80 bg-red-50/5 shadow-sm">
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
