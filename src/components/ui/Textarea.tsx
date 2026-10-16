import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className = '', id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full rounded-control bg-surface border border-line px-4 py-3 text-base sm:text-small text-ink placeholder:text-ink-4 focus:outline-none focus:border-line-strong focus:ring-4 focus:ring-ink/[0.04] transition-[border-color,box-shadow] duration-200 ease-soft resize-y min-h-[100px] ${error ? 'ring-2 ring-negative/40' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-small text-negative">{error}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'
export default Textarea
