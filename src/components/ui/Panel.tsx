interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'surface' | 'muted' | 'warm' | 'glass'
  radius?: 'card' | 'panel' | 'sheet'
  elevation?: 'none' | 'hairline' | 'float' | 'lift'
}

const toneClasses = {
  surface: 'bg-surface text-ink',
  muted: 'bg-surface-muted text-ink',
  warm: 'bg-surface-warm text-ink',
  glass: 'sc-glass text-ink',
}

const radiusClasses = { card: 'rounded-card', panel: 'rounded-panel', sheet: 'rounded-sheet' }
const elevationClasses = { none: '', hairline: 'shadow-hairline', float: 'shadow-float', lift: 'shadow-lift' }

/** The container family: sheet (outer) → panel → card. Nest one level down at a time. */
export default function Panel({
  tone = 'surface',
  radius = 'panel',
  elevation = 'hairline',
  className = '',
  ...props
}: PanelProps) {
  return (
    <div
      className={`${toneClasses[tone]} ${radiusClasses[radius]} ${elevationClasses[elevation]} ${className}`}
      {...props}
    />
  )
}
