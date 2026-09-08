import { PET_PREFERENCES_LABELS } from './Petpreferencesoptions'

export default function PetPreferencesSummary({ values }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PET_PREFERENCES_LABELS.map(([field, label, suffix]) => {
        const rawValue = values?.[field]
        const displayValue = rawValue === '' || rawValue === undefined || rawValue === null
          ? '—'
          : suffix
            ? `${rawValue} ${suffix}`
            : rawValue
        return (
          <div key={field} className="rounded-3xl bg-[#CACACA]/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">{label}</p>
            <p className="mt-2 text-sm font-semibold text-[#683B0D]">{displayValue}</p>
          </div>
        )
      })}
    </div>
  )
}