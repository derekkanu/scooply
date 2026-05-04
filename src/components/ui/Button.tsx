import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  primary: 'bg-black text-white hover:bg-zinc-800 active:bg-zinc-900',
  secondary: 'bg-white text-black border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100',
  ghost: 'text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export default Button
