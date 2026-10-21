import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import SearchSelect from '../../components/SearchSelect.jsx';
import AgeInput from '../../components/AgeInput.jsx';
import { AREA_OPTIONS, COAT_COLORS, getBreedOptions, suggestSize } from '../../Data/Petbreeds.jsx';

// Photos are shrunk before uploading (a raw phone photo can be several MB).
const MAX_PHOTO_SIDE = 800

function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image.'))
    }
    img.src = url
  })
}

const DEFAULT_PET = {
  image: null,
  name: '',
  species: 'Dog',
  breed: '',
  age: '',
  gender: 'Male',
  size: 'Average pet-size',
  color: '',
  area: '',
  vaccinated: false,
  spayedNeutered: false,
  houseTrained: false,
  goodWithKids: false,
  goodWithPets: false,
  description: '',
  specialNeeds: '',
  status: 'Available',
};

// Used both to add a pet and (with initialPet = an existing listing) to edit one.
const AddPetModal = ({ onClose, onSubmit, initialPet = {}, title, subtitle, submitLabel }) => {
  const isEditing = Boolean(initialPet?.id);
  const heading = title ?? (isEditing ? 'Edit pet listing' : 'Add pet for adoption');
  const subheading =
    subtitle ?? (isEditing ? 'Update the details, description and photo.' : 'Enter the pet details to create a listing.');
  const buttonLabel = submitLabel ?? (isEditing ? 'Save changes' : 'Add pet');
  const [pet, setPet] = useState(() => {
    const merged = { ...DEFAULT_PET, ...initialPet };
    // Saved listings can have empty/null values; the form expects strings.
    ['name', 'breed', 'age', 'color', 'area', 'description', 'specialNeeds'].forEach((field) => {
      merged[field] = merged[field] ?? '';
    });
    merged.size = merged.size || DEFAULT_PET.size;
    merged.image = merged.image || null;
    return merged;
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setPet((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // A breed belongs to a type of pet, so changing the type clears the breed.
  const changeSpecies = (species) => {
    setPet((current) => (current.species === species ? current : { ...current, species, breed: '' }));
  };

  // Picking a known breed fills in a typical size, unless the size was already chosen by hand.
  const sizeTouched = useRef(isEditing);
  const handleBreedPick = (breed) => {
    if (sizeTouched.current) return;
    const size = suggestSize(pet.species, breed);
    if (size) updateField('size', size);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    try {
      updateField('image', await shrinkImage(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pet.name.trim() || !pet.breed.trim() || !pet.age.trim()) {
      setError("Please fill in the pet's name, breed, and age before continuing.");
      return;
    }

    setSaving(true);
    setError('');
    const result = await onSubmit({
      ...pet,
      image: pet.image || null,
      name: pet.name.trim(),
      breed: pet.breed.trim(),
      age: pet.age.trim(),
      color: pet.color.trim(),
      area: pet.area.trim(),
      description: pet.description.trim(),
      specialNeeds: pet.specialNeeds.trim(),
      status: pet.status || 'Available',
    });
    setSaving(false);

    // The dashboard closes the modal on success; show why it didn't otherwise.
    if (result && !result.ok) {
      setError(
        result.reason === 'auth'
          ? 'Please log in again to add a pet.'
          : result.reason === 'photo'
            ? "We couldn't upload the photo. Please try a different image, or add the pet without one."
            : "We couldn't save this listing. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-[#CACACA] px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[#683B0D]">{heading}</h2>
            <p className="text-sm text-[#989797]">{subheading}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#989797] transition hover:bg-[#CACACA]/20 hover:text-[#683B0D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4 p-6 pt-4" onSubmit={handleSubmit} noValidate>
          {error && (
            <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
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
                {pet.image && (
                  <button
                    type="button"
                    onClick={() => updateField('image', null)}
                    className="mt-3 rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Remove photo
                  </button>
                )}
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
                  onChange={(event) => changeSpecies(event.target.value)}
                  className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                >
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Rabbit</option>
                  <option>Bird</option>
                  <option>Other</option>
                </select>
              </label>

              <div className="space-y-2 text-sm font-semibold text-[#683B0D]">
                <label htmlFor="pet-breed" className="block">Breed</label>
                <SearchSelect
                  id="pet-breed"
                  value={pet.breed}
                  onChange={(breed) => updateField('breed', breed)}
                  onPick={handleBreedPick}
                  options={getBreedOptions(pet.species)}
                  placeholder={pet.species === 'Other' ? 'Type the kind of animal' : 'Search or pick a breed'}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 text-sm font-semibold text-[#683B0D]">
              <label htmlFor="pet-age" className="block">Age</label>
              <AgeInput id="pet-age" value={pet.age} onChange={(age) => updateField('age', age)} />
            </div>
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
                onChange={(event) => {
                  sizeTouched.current = true;
                  updateField('size', event.target.value);
                }}
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
              >
                <option>Tiny pet-size</option>
                <option>Lap pet-size</option>
                <option>Average pet-size</option>
                <option>Big pet-size</option>
              </select>
            </label>
            <div className="space-y-2 text-sm font-semibold text-[#683B0D]">
              <label htmlFor="pet-color" className="block">Color / Markings</label>
              <SearchSelect
                id="pet-color"
                value={pet.color}
                onChange={(color) => updateField('color', color)}
                options={COAT_COLORS}
                placeholder="Pick a color or describe it"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-1">
            <div className="space-y-2 text-sm font-semibold text-[#683B0D]">
              <label htmlFor="pet-area" className="block">Location (city / area)</label>
              <SearchSelect
                id="pet-area"
                value={pet.area}
                onChange={(area) => updateField('area', area)}
                options={AREA_OPTIONS}
                placeholder="Defaults to your profile location"
              />
            </div>
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
              disabled={saving}
              className="rounded-full bg-[#683B0D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;
