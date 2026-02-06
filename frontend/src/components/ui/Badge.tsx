const variantClasses = {
  success: 'bg-[#107e3e]',
  warning: 'bg-[#e9730c]',
  danger: 'bg-[#bb0000]',
  info: 'bg-[#0070F2]',
  default: 'bg-[#6b7280]',
}

type BadgeVariant = keyof typeof variantClasses

interface BadgeProps {
  text: string
  variant?: BadgeVariant
}

export default function Badge({ text, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${variantClasses[variant]}`}
    >
      {text}
    </span>
  )
}
