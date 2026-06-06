import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-2 rounded-xl bg-gray-50 text-[#141733]">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2 2a2 2 0 012-2m-2 2H9M3 21h18M4 10h16M4 10a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Update Password
                    </h2>
                    <p className="text-xs text-gray-500">
                        Ensure your account uses a strong, random password to stay secure.
                    </p>
                </div>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <InputLabel
                            htmlFor="current_password"
                            value="Current Password"
                            className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1"
                        />

                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#141733] focus:ring-[#141733]"
                            autoComplete="current-password"
                        />

                        <InputError
                            message={errors.current_password}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="New Password" className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1" />

                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#141733] focus:ring-[#141733]"
                            autoComplete="new-password"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1"
                        />

                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#141733] focus:ring-[#141733]"
                            autoComplete="new-password"
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 border-t border-gray-100 pt-5">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-[#141733] hover:bg-[#1f234d] active:bg-[#141733] focus:ring-[#141733] rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#bbff00] transition-colors"
                    >
                        Change Password
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-semibold text-green-600">
                            Password updated.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
