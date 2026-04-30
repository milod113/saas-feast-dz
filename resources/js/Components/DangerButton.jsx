export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-rose-600 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm transition duration-150 ease-in-out hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 active:bg-rose-700 dark:focus:ring-offset-stone-950 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
