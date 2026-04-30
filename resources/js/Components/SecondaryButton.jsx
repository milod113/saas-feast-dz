export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-stone-700 shadow-sm transition duration-150 ease-in-out hover:border-amber-300 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-25 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-amber-500 dark:hover:text-amber-300 dark:focus:ring-offset-stone-950 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
