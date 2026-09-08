export default function ScaleSelector({ label, value, onChange, lowLabel = 'Low', highLabel = 'High' }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#683B0D]">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`flex h-10 w-10 flex-1 items-center justify-center rounded-full text-sm font-semibold transition sm:h-11 sm:w-11 sm:flex-none ${
              value === num
                ? 'bg-[#683B0D] text-white'
                : 'bg-[#CACACA]/30 text-[#989797] hover:bg-[#CACACA]/50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-[#989797]">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}