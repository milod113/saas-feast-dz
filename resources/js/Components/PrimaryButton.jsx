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
                `inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-orange-500/20 transition duration-150 ease-in-out hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-[0.99] dark:focus:ring-offset-stone-950 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
