export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-[#bbff00] px-4 py-3 text-sm font-bold tracking-wide text-[#141733] transition duration-150 ease-in-out hover:bg-[#a5e600] focus:bg-[#a5e600] focus:outline-none focus:ring-2 focus:ring-[#bbff00] focus:ring-offset-2 active:bg-[#92cc00] shadow-sm ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
