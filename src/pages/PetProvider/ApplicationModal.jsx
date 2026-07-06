import React from 'react';
import { Clock, X, User } from 'lucide-react';

const ApplicationModal = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex flex-col gap-4 border-b border-[#CACACA] px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#683B0D]">{application.name}</h2>
            <p className="text-sm text-[#989797]">Application for {application.pet}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#989797] transition hover:bg-[#CACACA]/20 hover:text-[#683B0D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[320px_auto]">
          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white shadow-sm">
                <User className="h-6 w-6 text-[#683B0D]" />
              </div>
              <div>
                <p className="text-sm text-[#989797]">Applicant</p>
                <p className="mt-2 text-lg font-semibold text-[#683B0D]">{application.name}</p>
              </div>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Pet requested</p>
              <p className="mt-2 font-semibold text-[#683B0D]">{application.pet}</p>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Contact</p>
              <p className="mt-2 text-sm text-[#683B0D]">{application.email}</p>
              <p className="mt-1 text-sm text-[#989797]">{application.phone}</p>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Submitted</p>
              <p className="mt-2 font-semibold text-[#683B0D]">{application.time}</p>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Current status</p>
              <span className="mt-2 inline-flex rounded-full bg-[#683B0D]50 px-3 py-1 text-sm font-semibold text-[#683B0D]">
                {application.status}
              </span>
            </div>
          </div>

          <div className="space-y-5 rounded-[32px] bg-[#CACACA]/20 p-6 shadow-sm">
            <div className="flex items-center gap-3 rounded-[32px] bg-white p-5 shadow-sm">
              <Clock className="h-5 w-5 text-[#683B0D]" />
              <p className="text-sm text-[#989797]">Review the adoption request and prepare the next step.</p>
            </div>

            <div className="rounded-[32px] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#683B0D]">Applicant note</h3>
              <p className="mt-3 text-sm leading-6 text-[#989797]">
                {application.note}
              </p>
            </div>

            <div className="rounded-[32px] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#683B0D]">Message</h3>
              <p className="mt-3 text-sm leading-6 text-[#989797]">
                {application.message}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#683B0D] transition hover:bg-[#683B0D]50"
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-full bg-[#683B0D]600 px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#683B0D]700"
              >
                Approve application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
