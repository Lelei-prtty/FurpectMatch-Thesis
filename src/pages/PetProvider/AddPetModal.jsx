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
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add pet for adoption</h2>
            <p className="text-sm text-gray-500">Enter the pet details to create a listing.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-6 p-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-gray-700">
              Image URL
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-gray-700">
              Pet name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter pet name"
                className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </label>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-gray-700">
              Breed
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Enter breed"
                className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-gray-700">
              Color
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Enter coat color"
                className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-semibold text-gray-700">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description about the pet"
              className="w-full min-h-[140px] rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-black transition hover:bg-purple-700"
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
