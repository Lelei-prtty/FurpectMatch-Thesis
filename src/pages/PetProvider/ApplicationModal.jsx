import React from 'react';
import { Clock, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const statusClass = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'Under Review': 'bg-orange-100 text-orange-800',
  Approved: 'bg-green-100 text-green-800',
  Declined: 'bg-red-100 text-red-700',
};

const ApplicationModal = ({ application, onClose, onChangeStatus, onOpenChat }) => {
  if (!application) return null;

  const initial = (application.name || '?').charAt(0).toUpperCase();
  const decided = application.status === 'Approved' || application.status === 'Declined';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-4 border-b border-[#CACACA] px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#683B0D]">{application.name}</h2>
            <p className="text-sm text-[#989797]">Application for {application.pet}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-[#989797] transition hover:bg-[#CACACA]/20 hover:text-[#683B0D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[320px_auto]">
          <div className="space-y-4 rounded-[32px] border border-[#CACACA] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#CEA74E]/25 text-xl font-bold text-[#683B0D]">
                {initial}
              </div>
              <div>
                <p className="text-sm text-[#989797]">Applicant</p>
                <p className="mt-1 text-lg font-semibold text-[#683B0D]">{application.name}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-[#CACACA]/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Pet requested</p>
              <p className="mt-2 font-semibold text-[#683B0D]">{application.pet}</p>
              {application.matchPercent !== null && (
                <p className="mt-1 text-xs text-[#989797]">
                  Model match when they applied: {Math.max(0, application.matchPercent)}%
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-[#CACACA]/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Contact</p>
              <p className="mt-2 break-all text-sm text-[#683B0D]">{application.email || 'Not provided'}</p>
              <p className="mt-1 text-sm text-[#989797]">{application.phone || 'No phone number'}</p>
              {application.location && <p className="mt-1 text-sm text-[#989797]">{application.location}</p>}
            </div>

            <div className="rounded-3xl bg-[#CACACA]/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Submitted</p>
              <p className="mt-2 font-semibold text-[#683B0D]">{formatDate(application.createdAt)}</p>
            </div>

            <div className="rounded-3xl bg-[#CACACA]/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Current status</p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  statusClass[application.status] || 'bg-[#CACACA]/30 text-[#683B0D]'
                }`}
              >
                {application.status}
              </span>
            </div>
          </div>

          <div className="space-y-5 rounded-[32px] bg-[#CACACA]/20 p-6 shadow-sm">
            <div className="flex items-center gap-3 rounded-[32px] bg-white p-5 shadow-sm">
              <Clock className="h-5 w-5 text-[#683B0D]" />
              <p className="text-sm text-[#989797]">
                {decided
                  ? application.status === 'Approved'
                    ? 'You approved this request. The guardian has been notified and the two of you can now chat.'
                    : 'You declined this request. The guardian can see this in My Applications.'
                  : 'Review the adoption request, then approve, decline, or mark it as under review.'}
              </p>
            </div>

            {application.note && (
              <div className="rounded-[32px] bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-[#683B0D]">Applicant note</h3>
                <p className="mt-3 text-sm leading-6 text-[#989797]">{application.note}</p>
              </div>
            )}
            {application.message && (
              <div className="rounded-[32px] bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-[#683B0D]">Message</h3>
                <p className="mt-3 text-sm leading-6 text-[#989797]">{application.message}</p>
              </div>
            )}
            {!application.note && !application.message && (
              <div className="rounded-[32px] bg-white p-5 shadow-sm">
                <p className="text-sm text-[#989797]">No note was included with this request.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#CACACA] bg-white px-5 py-3 text-sm font-semibold text-[#683B0D] transition hover:bg-[#CACACA]/10"
              >
                Close
              </button>
              <button
                type="button"
                disabled={application.status === 'Declined'}
                onClick={() => onChangeStatus?.(application, 'Declined')}
                className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Decline
              </button>
              <button
                type="button"
                disabled={application.status === 'Approved'}
                onClick={() => onChangeStatus?.(application, 'Approved')}
                className="rounded-full bg-[#683B0D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Approve
              </button>
            </div>
            {application.status === 'Approved' && onOpenChat && (
              <button
                type="button"
                onClick={() => onOpenChat(application)}
                className="w-full rounded-full bg-[#CEA74E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#683B0D]"
              >
                Message {application.name}
              </button>
            )}
            {application.status === 'Pending' && (
              <button
                type="button"
                onClick={() => onChangeStatus?.(application, 'Under Review')}
                className="w-full text-center text-sm font-semibold text-[#683B0D] hover:text-[#CEA74E]"
              >
                Mark as under review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ApplicationModal;
