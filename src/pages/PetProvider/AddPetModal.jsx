import React, { useState } from 'react';
import { X } from 'lucide-react';

const DEFAULT_PET = {
  image: 'https://via.placeholder.com/640x480.png?text=Pet+Image',
  name: '',
  species: 'Dog',
  breed: '',
  age: '',
  gender: 'Male',
  size: 'Medium',
  color: '',
  vaccinated: false,
  spayedNeutered: false,
  houseTrained: false,
  goodWithKids: false,
  goodWithPets: false,
  description: '',
  specialNeeds: '',
  status: 'Available',
  health: 'Good Health',
};

const AddPetModal = ({ onClose, onSubmit, initialPet = {} }) => {
  const [pet, setPet] = useState(() => ({
    ...DEFAULT_PET,
    ...initialPet,
  }));

  const updateField = (field, value) => {
    setPet((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField('image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!pet.name || !pet.breed || !pet.age) {
      alert('Please fill in the pet\'s name, breed, and age before continuing.');
      return;
    }

    onSubmit({
      ...pet,
      image: pet.image?.trim() || DEFAULT_PET.image,
      name: pet.name.trim(),
      breed: pet.breed.trim(),
      age: pet.age.trim(),
      color: pet.color.trim(),
      description: pet.description.trim(),
      specialNeeds: pet.specialNeeds.trim(),
      status: pet.status || 'Available',
      health: pet.health || 'Good Health',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-[#CACACA] px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[#683B0D]">Add pet for adoption</h2>
            <p className="text-sm text-[#989797]">Enter the pet details to create a listing.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#989797] transition hover:bg-[#CACACA]/20 hover:text-[#683B0D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4 p-6 pt-4" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-[1.1fr_1fr] items-start">
            <div className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Pet image
              <div className="overflow-hidden rounded-3xl border border-[#CACACA] bg-[#CACACA]/10 p-3">
                {pet.image && (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-[#CACACA] bg-[#CACACA]/10">
                    <img
                      src={pet.image}
                      alt="Pet preview"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-[#683B0D] file:mr-4 file:rounded-full file:border-0 file:bg-[#683B0D] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#CEA74E]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
                Pet name
                <input
                  type="text"
                  value={pet.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Enter pet name"
                  className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
                Type of Pet
                <select
                  value={pet.species}
                  onChange={(event) => updateField('species', event.target.value)}
                  className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                >
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Rabbit</option>
                  <option>Bird</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
                Breed
                <input
                  type="text"
                  value={pet.breed}
                  onChange={(event) => updateField('breed', event.target.value)}
                  placeholder="Enter breed"
                  className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Age
              <input
                type="text"
                value={pet.age}
                onChange={(event) => updateField('age', event.target.value)}
                placeholder="e.g. 2 years"
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Sex
              <select
                value={pet.gender}
                onChange={(event) => updateField('gender', event.target.value)}
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </label>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Size of Pet
              <select
                value={pet.size}
                onChange={(event) => updateField('size', event.target.value)}
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
              >
                <option>Tiny pet-size</option>
                <option>Lap pet-size</option>
                <option>Average pet-size</option>
                <option>Big pet-size</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Color / Markings
              <input
                type="text"
                value={pet.color}
                onChange={(event) => updateField('color', event.target.value)}
                placeholder="Enter coat color"
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
              />
            </label>
          </div>

          <div className="rounded-3xl border border-[#CACACA] bg-[#CACACA]/10 p-5">
            <p className="mb-4 text-sm font-semibold text-[#683B0D]">Health & Temperament</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                <input
                  type="checkbox"
                  checked={pet.vaccinated}
                  onChange={(event) => updateField('vaccinated', event.target.checked)}
                  className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                />
                Vaccinated
              </label>
              <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                <input
                  type="checkbox"
                  checked={pet.spayedNeutered}
                  onChange={(event) => updateField('spayedNeutered', event.target.checked)}
                  className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                />
                Spayed / Neutered
              </label>
              <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                <input
                  type="checkbox"
                  checked={pet.houseTrained}
                  onChange={(event) => updateField('houseTrained', event.target.checked)}
                  className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                />
                House-trained
              </label>
              <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                <input
                  type="checkbox"
                  checked={pet.goodWithKids}
                  onChange={(event) => updateField('goodWithKids', event.target.checked)}
                  className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                />
                Good with kids
              </label>
              <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                <input
                  type="checkbox"
                  checked={pet.goodWithPets}
                  onChange={(event) => updateField('goodWithPets', event.target.checked)}
                  className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                />
                Good with other pets
              </label>
            </div>
          </div>

          <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
            Description
            <textarea
              value={pet.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Tell guardians about this pet's personality and history..."
              rows={4}
              className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
            Special Needs / Medical Notes (optional)
            <textarea
              value={pet.specialNeeds}
              onChange={(event) => updateField('specialNeeds', event.target.value)}
              placeholder="Any ongoing medication, allergies, or accommodations..."
              rows={3}
              className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#CACACA] bg-white px-5 py-3 text-sm font-semibold text-[#683B0D] transition hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#683B0D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
            >
              Add pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;
