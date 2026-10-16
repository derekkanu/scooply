import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, className = '', id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`w-full rounded-control bg-surface border border-line px-4 py-3 text-small text-ink focus:outline-none focus:border-line-strong focus:ring-4 focus:ring-ink/[0.04] transition-[border-color,box-shadow] duration-200 ease-soft ${error ? 'ring-2 ring-negative/40' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-small text-negative">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
