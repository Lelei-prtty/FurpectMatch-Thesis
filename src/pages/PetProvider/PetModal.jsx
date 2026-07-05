import React from 'react';
import { X, Heart, PawPrint } from 'lucide-react';

const PetModal = ({ pet, onClose }) => {
  if (!pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{pet.name}</h2>
            <p className="text-sm text-gray-500">Pet profile details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[360px_auto]">
          <div className="overflow-hidden rounded-[32px] bg-gray-100 shadow-sm">
            <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[32px] bg-purple-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Breed</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{pet.breed}</p>
              </div>
              <div className="rounded-[32px] bg-purple-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Age</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{pet.age}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                <PawPrint className="h-4 w-4" />
                {pet.status}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                <Heart className="h-4 w-4 text-red-500" />
                {pet.health}
              </span>
            </div>

            <div className="rounded-[32px] bg-gray-50 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">About {pet.name}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {pet.name} is a friendly {pet.breed} aged {pet.age}. They are in {pet.health} and currently listed as {pet.status}.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[32px] bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Recent views</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">1.2k</p>
              </div>
              <div className="rounded-[32px] bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Favorites</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">342</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-black transition hover:bg-purple-700"
              >
                Close profile
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-purple-500 hover:text-purple-700"
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
