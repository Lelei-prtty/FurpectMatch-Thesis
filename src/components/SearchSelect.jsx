import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

// A text box with a drop-down list that filters as you type (a "combobox").
//   - Click it (or press the down arrow) to see every option; type to narrow the list.
//   - Pick an option with the mouse, or the arrow keys + Enter.
//   - By default you may also keep something that isn't on the list (a custom breed).
//     With `strict`, anything that isn't an option snaps back to the last valid choice.
// `onChange(text)` fires for every keystroke and every pick; `onPick(option)` only for a pick.

const normalize = (text) => String(text ?? '').trim().toLowerCase()

const BASE =
  'w-full rounded-3xl border bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:ring-2 disabled:opacity-60'
const OK = 'border-[#CACACA] focus:border-[#CEA74E] focus:ring-[#CACACA]/20'
const BAD = 'border-red-400 focus:border-red-500 focus:ring-red-200'

export default function SearchSelect({
  id,
  value,
  onChange,
  onPick,
  options = [],
  placeholder = '',
  invalid = false,
  strict = false,
  disabled = false,
  ...rest
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const listId = `${inputId}-list`
  const wrapRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const text = value ?? ''
  const exact = options.find((option) => normalize(option) === normalize(text)) ?? null
  const lastValid = useRef(exact ?? '')
  useEffect(() => {
    if (exact) lastValid.current = exact
  }, [exact])

  // Nothing typed, or a complete option showing: list everything. Otherwise filter.
  const filtered = useMemo(() => {
    const query = normalize(text)
    if (!query || exact) return options
    const starts = options.filter((option) => normalize(option).startsWith(query))
    const contains = options.filter(
      (option) => !normalize(option).startsWith(query) && normalize(option).includes(query)
    )
    return [...starts, ...contains]
  }, [options, text, exact])

  useEffect(() => {
    if (open && active >= 0) {
      document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
    }
  }, [active, open, listId])

  const pick = (option) => {
    onChange(option)
    if (onPick) onPick(option)
    setOpen(false)
    setActive(-1)
  }

  const handleBlur = (event) => {
    if (wrapRef.current?.contains(event.relatedTarget)) return
    setOpen(false)
    setActive(-1)
    if (strict && text.trim() && !exact) onChange(lastValid.current || '')
  }

  const handleKeyDown = (event) => {
    if (disabled) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setActive(0)
      } else {
        setActive((current) => Math.min(filtered.length - 1, current + 1))
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) setOpen(true)
      setActive((current) => Math.max(0, current - 1))
    } else if (event.key === 'Enter') {
      if (open && active >= 0 && filtered[active]) {
        event.preventDefault() // choose the highlighted option instead of submitting the form
        pick(filtered[active])
      } else if (open) {
        setOpen(false)
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className="relative" onBlur={handleBlur}>
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        className={`${BASE} ${invalid ? BAD : OK}`}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      {open && options.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-[#CACACA] bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-2 text-sm font-normal text-[#989797]">
              {strict ? 'No matches.' : `No match. “${text.trim()}” will be used as typed.`}
            </li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option === exact}
                onMouseDown={(event) => event.preventDefault()} // keep focus in the box
                onClick={() => pick(option)}
                onMouseEnter={() => setActive(index)}
                className={`cursor-pointer px-4 py-2 text-sm font-normal text-[#683B0D] ${
                  index === active ? 'bg-[#CEA74E]/20' : ''
                } ${option === exact ? 'font-semibold' : ''}`}
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
