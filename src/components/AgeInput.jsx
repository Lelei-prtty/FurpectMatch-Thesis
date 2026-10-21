import React, { useState } from 'react'

// Age as "a number + months/years" instead of free text. It hands back text like
// "2 years" or "8 months" (the format the rest of the app already shows).
// An older age that isn't in that format (e.g. "Puppy") is left alone until the person
// picks a new one.

const AGE_RE = /^\s*(\d+)\s*(months?|mos?|years?|yrs?|y)\b\.?\s*(old)?\s*$/i

function parseAge(value) {
  const text = String(value ?? '').trim()
  if (!text) return { amount: '', unit: 'years', recognised: true }
  const match = AGE_RE.exec(text)
  if (!match) return { amount: '', unit: 'years', recognised: false }
  return { amount: match[1], unit: /^m/i.test(match[2]) ? 'months' : 'years', recognised: true }
}

export function formatAge(amount, unit) {
  const n = Number(amount)
  if (!amount || !Number.isFinite(n) || n <= 0) return ''
  const label = unit === 'months' ? 'month' : 'year'
  return `${n} ${label}${n === 1 ? '' : 's'}`
}

const BASE = 'rounded-3xl border bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:ring-2'
const OK = 'border-[#CACACA] focus:border-[#CEA74E] focus:ring-[#CACACA]/20'
const BAD = 'border-red-400 focus:border-red-500 focus:ring-red-200'

export default function AgeInput({ id, value, onChange, invalid = false }) {
  const [initial] = useState(() => parseAge(value))
  const [amount, setAmount] = useState(initial.amount)
  const [unit, setUnit] = useState(initial.unit)
  const [changed, setChanged] = useState(false)

  const update = (nextAmount, nextUnit) => {
    setAmount(nextAmount)
    setUnit(nextUnit)
    setChanged(true)
    onChange(formatAge(nextAmount, nextUnit))
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={amount}
          placeholder="e.g. 2"
          aria-label="Age number"
          aria-invalid={invalid || undefined}
          onChange={(event) => update(event.target.value.replace(/\D/g, '').slice(0, 3), unit)}
          className={`${BASE} ${invalid ? BAD : OK} min-w-0 flex-1`}
        />
        <select
          value={unit}
          aria-label="Age unit"
          onChange={(event) => update(amount, event.target.value)}
          className={`${BASE} ${OK} w-32 shrink-0`}
        >
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </div>
      {!initial.recognised && !changed && value && (
        <p className="mt-1 text-xs font-normal text-[#989797]">
          Saved as “{value}”. Enter a number to change it.
        </p>
      )}
    </div>
  )
}
