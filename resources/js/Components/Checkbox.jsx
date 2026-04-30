export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-stone-300 bg-white text-amber-600 shadow-sm focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-900 dark:text-amber-500 dark:focus:ring-amber-500 ' +
                className
            }
        />
    );
}
