import React from 'react';
import { X, Heart, PawPrint } from 'lucide-react';

const PetModal = ({ pet, onClose }) => {
  if (!pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex flex-col gap-4 border-b border-[#CACACA] px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#683B0D]">{pet.name}</h2>
            <p className="text-sm text-[#989797]">Pet profile details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#989797] transition hover:bg-[#CACACA]/20 hover:text-[#683B0D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[360px_auto]">
          <div className="overflow-hidden rounded-[32px] bg-[#CACACA]/20 shadow-sm">
            <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[32px] bg-[#683B0D]50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#683B0D]">Breed</p>
                <p className="mt-2 text-lg font-semibold text-[#683B0D]">{pet.breed}</p>
              </div>
              <div className="rounded-[32px] bg-[#683B0D]50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#683B0D]">Age</p>
                <p className="mt-2 text-lg font-semibold text-[#683B0D]">{pet.age}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                <PawPrint className="h-4 w-4" />
                {pet.status}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#CACACA]/20 px-4 py-2 text-sm font-semibold text-[#683B0D]">
                <Heart className="h-4 w-4 text-red-500" />
                {pet.health}
              </span>
            </div>

            <div className="rounded-[32px] bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#683B0D]">About {pet.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[#989797]">
                {pet.name} is a friendly {pet.breed} aged {pet.age}. They are in {pet.health} and currently listed as {pet.status}.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[32px] bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Recent views</p>
                <p className="mt-2 text-lg font-semibold text-[#683B0D]">1.2k</p>
              </div>
              <div className="rounded-[32px] bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Favorites</p>
                <p className="mt-2 text-lg font-semibold text-[#683B0D]">342</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full bg-[#683B0D]600 px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#683B0D]700"
              >
                Close profile
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-[#CACACA] bg-white px-5 py-3 text-sm font-semibold text-[#683B0D] transition hover:border-purple-500 hover:text-[#683B0D]"
              >
                Send update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;
