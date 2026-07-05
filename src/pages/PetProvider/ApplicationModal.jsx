import React from 'react';
import { Clock, X, User } from 'lucide-react';

const ApplicationModal = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{application.name}</h2>
            <p className="text-sm text-gray-500">Application for {application.pet}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[320px_auto]">
          <div className="rounded-[32px] border border-gray-100 bg-gray-50 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white shadow-sm">
                <User className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Applicant</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{application.name}</p>
              </div>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Pet requested</p>
              <p className="mt-2 font-semibold text-gray-900">{application.pet}</p>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Contact</p>
              <p className="mt-2 text-sm text-gray-900">{application.email}</p>
              <p className="mt-1 text-sm text-gray-600">{application.phone}</p>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Submitted</p>
              <p className="mt-2 font-semibold text-gray-900">{application.time}</p>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Current status</p>
              <span className="mt-2 inline-flex rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700">
                {application.status}
              </span>
            </div>
          </div>

          <div className="space-y-5 rounded-[32px] bg-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 rounded-[32px] bg-white p-5 shadow-sm">
              <Clock className="h-5 w-5 text-purple-700" />
              <p className="text-sm text-gray-600">Review the adoption request and prepare the next step.</p>
            </div>

            <div className="rounded-[32px] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Applicant note</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {application.note}
              </p>
            </div>

            <div className="rounded-[32px] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Message</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {application.message}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-purple-50"
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-black transition hover:bg-purple-700"
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
