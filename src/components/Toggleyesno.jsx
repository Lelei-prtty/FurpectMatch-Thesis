export default function ToggleYesNo({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#683B0D]">{label}</p>
      <div className="mt-2 flex gap-2">
        {['Yes', 'No'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              value === option
                ? 'bg-[#683B0D] text-white'
                : 'bg-[#CACACA]/30 text-[#989797] hover:bg-[#CACACA]/50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}