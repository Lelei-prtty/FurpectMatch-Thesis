import React from 'react'
import { X } from 'lucide-react'

export default function AdoptionHistoryModal({ open, onClose }) {
  if (!open) return null

  const adoptionHistory = [
    {
      petName: 'Coco',
      breed: 'Rabbit',
      adoptionDate: 'May 30, 2024',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f4?w=300&h=300&fit=crop',
      status: 'Currently with us',
      notes: 'Coco is a sweet and gentle rabbit who loves fresh vegetables and quiet spaces.'
    },
    {
      petName: 'Whiskers',
      breed: 'Siamese Cat',
      adoptionDate: 'January 15, 2023',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop',
      status: 'Previously adopted',
      notes: 'Whiskers was adopted but later returned. Very affectionate and loves playtime.'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6">
      <div className="w-full max-w-3xl overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/10">
        <div className="flex flex-col gap-4 border-b border-[#CACACA] bg-[#683B0D] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#CEA74E]">My Pets</p>
            <p className="mt-2 text-2xl font-semibold text-white">Adoption History</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#683B0D] shadow-sm ring-1 ring-[#CACACA] transition hover:bg-[#CACACA]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-172px)] overflow-y-auto p-5 sm:p-6">
          <div className="space-y-6">
            {adoptionHistory.length > 0 ? (
              adoptionHistory.map((adoption, index) => (
                <div key={index} className="rounded-4xl border border-[#CACACA] bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
                    <div className="h-32 w-32 shrink-0 overflow-hidden rounded-3xl bg-[#CACACA]">
                      <img
                        src={adoption.image}
                        alt={adoption.petName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-[#683B0D]">{adoption.petName}</p>
                          <p className="mt-1 text-sm text-[#989797]">{adoption.breed}</p>
                        </div>
                        <span className="inline-flex rounded-full bg-[#CEA74E] px-3 py-1 text-sm font-semibold text-white w-fit">
                          {adoption.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-[#989797]">
                        Adoption Date: <span className="text-[#683B0D]">{adoption.adoptionDate}</span>
                      </p>
                      <p className="mt-4 leading-6 text-[#989797]">{adoption.notes}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-4xl border border-[#CACACA] bg-[#CACACA]/20 p-8 text-center">
                <p className="text-[#989797]">No adoption history yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
