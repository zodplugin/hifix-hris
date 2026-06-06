import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-2 rounded-xl bg-gray-50 text-[#141733]">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Profile Information
                    </h2>
                    <p className="text-xs text-gray-500">
                        Update your account's profile details and email address.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1" />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#141733] focus:ring-[#141733]"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1" />

                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#141733] focus:ring-[#141733]"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                        <p className="font-semibold">
                            Your email address is unverified.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="mt-1.5 font-bold text-amber-900 hover:text-amber-950 underline focus:outline-none"
                        >
                            Click here to re-send the verification email.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-bold text-green-700">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 border-t border-gray-100 pt-5">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-[#141733] hover:bg-[#1f234d] active:bg-[#141733] focus:ring-[#141733] rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#bbff00] transition-colors"
                    >
                        Save Details
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-semibold text-green-600">
                            Saved successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
