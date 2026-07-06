import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddPetModal = ({ onClose, onSubmit }) => {
  const [image, setImage] = useState('https://via.placeholder.com/640x480.png?text=Pet+Image');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !breed || !color || !description) {
      alert('Please fill in all fields.');
      return;
    }

    onSubmit({
      image,
      name,
      breed,
      age: '1 yr',
      status: 'Available',
      health: 'Good Health',
      color,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
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

        <form className="space-y-6 p-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Image URL
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]-500 focus:ring-2 focus:ring-[#CEA74E]-100"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Pet name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter pet name"
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]-500 focus:ring-2 focus:ring-[#CEA74E]-100"
              />
            </label>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Breed
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Enter breed"
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]-500 focus:ring-2 focus:ring-[#CEA74E]-100"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
              Color
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Enter coat color"
                className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]-500 focus:ring-2 focus:ring-[#CEA74E]-100"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-semibold text-[#683B0D]">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description about the pet"
              className="w-full min-h-[140px] rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]-500 focus:ring-2 focus:ring-[#CEA74E]-100"
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
              className="rounded-full bg-[#683B0D]600 px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#683B0D]700"
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
